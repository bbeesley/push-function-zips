import type {
  Options,
  OptionsForLayer,
  OptionsNoLayer,
} from './@types/options.js';
import { s3Upload } from './storage/s3.js';
import { createZip, createZipStream } from './create-zip.js';
import { getFileList } from './util.js';
import { debug } from './constants.js';

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
      options.layerKey &&
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
    bucket,
    functionKey,
    layerKey,
  } = options;
  const functionFiles = await getFileList(inputPath, include, [
    ...exclude,
    '**/node_modules/**',
  ]);
  console.info(`creating fn zip for ${functionKey}`);
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
  await s3Upload(bucket, functionKey, functionZipUint8Array, options);
  console.info('sent fn zip', {
    Bucket: bucket,
    Key: `${functionKey}.zip`,
  });
  const layerFiles = await getFileList(
    inputPath,
    ['node_modules/**'],
    [...exclude],
  );
  console.info(`creating layer zip for ${layerKey}`);
  if (debug) console.info('creating zip from files', { layerFiles });
  const layerZipStream = await createZipStream(inputPath, layerFiles, 'nodejs');
  console.info('sending layer zip');
  await s3Upload(bucket, layerKey, layerZipStream, options);
  console.info('sent layer zip');
  console.info('sent layer zip', {
    Bucket: bucket,
    Key: `${layerKey}.zip`,
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
  const { inputPath, include, exclude, rootDir, bucket, functionKey } = options;
  const functionFiles = await getFileList(inputPath, include, exclude);
  console.info(`creating fn zip for ${functionKey}`);
  if (debug) console.info('creating zip from files', { functionFiles });
  const functionZipStream = await createZipStream(
    inputPath,
    functionFiles,
    rootDir,
  );
  console.info('sending fn zip');
  await s3Upload(bucket, functionKey, functionZipStream, options);
  console.info('sent fn zip', {
    Bucket: bucket,
    Key: `${functionKey}.zip`,
  });
}

/**
 * Packages up an asset based on globs and uploads zips to s3
 *
 * @exports
 * @param {Options} arg Configuration defining what to upload to where
 * @returns {*}  {Promise<void>}
 */
export async function packageAndUploadLambda(arg: Options): Promise<void> {
  const options = {
    include: ['**/**'],
    exclude: [],
    createLayer: true,
    ...arg,
  };
  if (options.createLayer && !options.layerKey) {
    throw new Error(
      'if createLayer is true you must specify a layer key for saving the artefact in s3',
    );
  }

  if (isOptionsForLayer(options)) return packageAndUploadWithLayer(options);
  if (isOptionsNoLayer(options)) return packageAndUploadNoLayer(options);
  throw new Error('invalid options supplied');
}
