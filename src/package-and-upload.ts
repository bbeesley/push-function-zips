import { type Options, Platform } from './@types/options.js';
import { packageAndUploadCloudFn } from './cloud-function.js';
import { debug } from './constants.js';
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
  if (debug) console.info(`running with args ${JSON.stringify(arg)}`);
  if (arg.platform === Platform.AWS) {
    await packageAndUploadLambda(arg);
    return;
  }

  if (arg.platform === Platform.GCP) {
    await packageAndUploadCloudFn(arg);
    return;
  }

  console.error(
    `no handler for platform "${
      arg.platform as string
    }", allowed values are ${Object.values(Platform).join(' ,')}`,
  );
  throw new TypeError('no handler for platform');
}
