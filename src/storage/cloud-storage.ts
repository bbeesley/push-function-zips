import { Storage } from '@google-cloud/storage';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

let storage: Storage;

/**
 * Uploads an object to Google Cloud Storage
 *
 * @export
 * @param {string} bucket The bucket to upload to
 * @param {string} key The name of the object to create
 * @param {NodeJS.ReadableStream} content The content of the object
 * @return {*}  {Promise<void>}
 */
export async function storageUpload(
  bucket: string,
  key: string,
  content: NodeJS.ReadableStream,
): Promise<void> {
  if (!storage) storage = new Storage();
  const file = await streamToBuffer(content);
  await storage.bucket(bucket).file(`${key}.zip`).save(file);
}
