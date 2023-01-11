import { type Options, Platform } from './@types/options.js';
import { packageAndUploadCloudFn } from './cloud-function.js';
import { packageAndUploadLambda } from './lambda.js';

export * from './@types/index.js';

/**
 * Packages up an asset based on globs and uploads zips to storage
 *
 * @exports
 * @param {Options} arg Configuration defining what to upload to where
 * @returns {*}  {Promise<void>}
 */
export async function packageAndUpload(arg: Options): Promise<void> {
  if (arg.platform === Platform.AWS) await packageAndUploadLambda(arg);
  if (arg.platform === Platform.GCP) await packageAndUploadCloudFn(arg);
}
