import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { globby } from 'globby';
import JSZip from 'jszip';

const debug = process.env.DEBUG;

/**
 * Options to define an upload task
 *
 * @exports
 */
export type Options = {
  /**
   * A pointer to where the files to upload are located
   *
   * @type {string}
   */
  inputPath: string;
  /**
   * An array of globs to include in the zip
   *
   * @type {string[]}
   */
  include?: string[];
  /**
   * An array of globs to exclude from the zip
   *
   * @type {string[]}
   */
  exclude?: string[];
  /**
   * Whether or not to create a layer zip
   *
   * @type {boolean}
   */
  createLayer?: boolean;
  /**
   * A position within the zip to mount the files
   *
   * @type {string}
   */
  rootDir?: string;
  /**
   * The AWS region to upload the assets to
   *
   * @type {string}
   */
  region: string;
  /**
   * The name of the S3 bucket to upload to
   *
   * @type {string}
   */
  s3Bucket: string;
  /**
   * The key name to upload the function zip as
   *
   * @type {string}
   */
  s3FunctionKey: string;
  /**
   * The key name to upload the layer as
   *
   * @type {string}
   */
  s3LayerKey?: string;
};

type OptionsNoLayer = {
  include: string[];
  exclude: string[];
  createLayer: false;
} & Options;
type OptionsForLayer = {
  s3LayerKey: string;
  include: string[];
  exclude: string[];
  createLayer: true;
} & Options;

/**
 * Checks if an options object is for a fn plus layer job
 *
 * @private
 * @param {Options} opts An options object
 * @returns {*}  {opts is OptionsForLayer}
 */
function isOptionsForLayer(options: Options): options is OptionsForLayer {
  return Boolean(
    options.createLayer &&
      options.s3LayerKey &&
      options.include &&
      options.exclude,
  );
}

/**
 * Checks if an options object is for a fn only job
 *
 * @private
 * @param {Options} opts An options object
 * @returns {*}  {opts is OptionsNoLayer}
 */
function isOptionsNoLayer(options: Options): options is OptionsNoLayer {
  return Boolean(!options.createLayer && options.include && options.exclude);
}

/**
 * Adds files to a zip
 *
 * @private
 * @param {string} inputPath A pointer to the lambda artefact
 * @param {string[]} files A list of files to add
 * @param {string} [rootDir] An optional directory name within which the content should reside
 * @returns {*}  {Promise<JSZip>}
 */
async function createZip(
  inputPath: string,
  files: string[],
  rootDir?: string,
): Promise<JSZip> {
  const zip = new JSZip();
  for (const file of files) {
    const fileContents = await readFile(resolve(inputPath, file));
    const destination = rootDir ? `${rootDir}/${file}` : file;
    zip.file(destination, fileContents);
  }

  return zip;
}

/**
 * Packages up a lambda asset based on globs and uploads both the function and layer zips to s3
 *
 * @private
 * @param {OptionsForLayer} options Configuration defining what to upload to where
 * @returns {*}  {Promise<void>}
 */
async function packageAndUploadWithLayer(
  options: OptionsForLayer,
): Promise<void> {
  const {
    inputPath,
    include,
    exclude,
    rootDir,
    region,
    s3Bucket,
    s3FunctionKey,
    s3LayerKey,
  } = options;
  const client = new S3Client({ region });
  const functionFiles = await globby(include, {
    cwd: inputPath,
    ignore: [...exclude, '**/node_modules/**'],
  });
  console.info(`creating fn zip for ${s3FunctionKey}`);
  if (debug) console.info('creating zip from files', { functionFiles });
  const functionZip = await createZip(inputPath, functionFiles, rootDir);
  console.info('adding a symlink to the layer node_modules');
  functionZip.file('node_modules', '/opt/nodejs/node_modules', {
    // See https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/include/uapi/linux/stat.h#n10
    // 0120000 for the symlink, 0755 for the permissions : 0120755 == 41453
    unixPermissions: 0o12_0755,
  });
  const functionZipUint8Array = functionZip.generateNodeStream({
    platform: 'UNIX',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
  });

  console.info('sending fn zip');
  await client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: `${s3FunctionKey}.zip`,
      Body: new Readable().wrap(functionZipUint8Array),
    }),
  );
  console.info('sent fn zip', {
    Bucket: s3Bucket,
    Key: `${s3FunctionKey}.zip`,
  });
  const layerFiles = await globby(['node_modules/**'], {
    cwd: inputPath,
    ignore: [...exclude],
  });
  console.info(`creating layer zip for ${s3LayerKey}`);
  if (debug) console.info('creating zip from files', { layerFiles });
  const layerZip = await createZip(inputPath, layerFiles, 'nodejs');
  const layerZipStream = layerZip.generateNodeStream({
    compression: 'DEFLATE',
    platform: 'UNIX',
    compressionOptions: {
      level: 9,
    },
  });
  console.info('sending layer zip');
  await client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: `${s3LayerKey}.zip`,
      Body: new Readable().wrap(layerZipStream),
    }),
  );
  console.info('sent layer zip');
  console.info('sent layer zip', {
    Bucket: s3Bucket,
    Key: `${s3LayerKey}.zip`,
  });
}

/**
 * Packages up an asset based on globs and uploads a single zip to s3
 *
 * @private
 * @param {OptionsNoLayer} options Configuration defining what to upload to where
 * @returns {*}  {Promise<void>}
 */
async function packageAndUploadNoLayer(options: OptionsNoLayer): Promise<void> {
  const {
    inputPath,
    include,
    exclude,
    rootDir,
    region,
    s3Bucket,
    s3FunctionKey,
  } = options;
  const client = new S3Client({ region });
  const functionFiles = await globby(include, {
    cwd: inputPath,
    ignore: exclude,
  });
  console.info(`creating fn zip for ${s3FunctionKey}`);
  if (debug) console.info('creating zip from files', { functionFiles });
  const functionZip = await createZip(inputPath, functionFiles, rootDir);
  const functionZipStream = functionZip.generateNodeStream({
    compression: 'DEFLATE',
    platform: 'UNIX',
    compressionOptions: {
      level: 9,
    },
  });
  console.info('sending fn zip');
  await client.send(
    new PutObjectCommand({
      Bucket: s3Bucket,
      Key: `${s3FunctionKey}.zip`,
      Body: new Readable().wrap(functionZipStream),
    }),
  );
  console.info('sent fn zip', {
    Bucket: s3Bucket,
    Key: `${s3FunctionKey}.zip`,
  });
}

/**
 * Packages up an asset based on globs and uploads zips to s3
 *
 * @exports
 * @param {Options} arg Configuration defining what to upload to where
 * @returns {*}  {Promise<void>}
 */
export async function packageAndUpload(arg: Options): Promise<void> {
  const options = {
    include: ['**/**'],
    exclude: [],
    createLayer: true,
    ...arg,
  };
  if (options.createLayer && !options.s3LayerKey) {
    throw new Error(
      'if createLayer is true you must specify a layer key for saving the artefact in s3',
    );
  }

  if (isOptionsForLayer(options)) return packageAndUploadWithLayer(options);
  if (isOptionsNoLayer(options)) return packageAndUploadNoLayer(options);
  throw new Error('invalid options supplied');
}
