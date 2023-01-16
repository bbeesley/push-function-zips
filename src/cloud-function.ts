import type { Options } from './@types/index.js';
import { debug } from './constants.js';
import { createZipStream } from './create-zip.js';
import { storageUpload } from './storage/cloud-storage.js';
import { getFileList } from './util.js';

/**
 * Creates a zip file containing function code and uploads to Google Cloud Storage
 *
 * @export
 * @param {Options} options Options describing the operation to perform
 * @return {*}  {Promise<void>}
 */
export async function packageAndUploadCloudFn(options: Options): Promise<void> {
  const {
    inputPath,
    include = ['**/**'],
    exclude,
    rootDir,
    bucket,
    functionKey,
  } = options;
  const functionFiles = await getFileList(inputPath, include, exclude);
  console.info(`creating fn zip for ${functionKey}`);
  if (debug) console.info('creating zip from files', { functionFiles });
  const functionZipStream = await createZipStream(
    inputPath,
    functionFiles,
    rootDir,
  );
  console.info('sending fn zip');
  await storageUpload(bucket, functionKey, functionZipStream);
  console.info('sent fn zip', {
    Bucket: bucket,
    Key: `${functionKey}.zip`,
  });
}
