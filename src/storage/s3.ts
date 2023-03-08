import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { Options } from '../@types/options.js';

let s3: S3Client;

/**
 * Uploads an object to S3
 *
 * @export
 * @param {string} bucket The name of the bucket to upload to
 * @param {string} key The name of the object to create
 * @param {NodeJS.ReadableStream} content The content of the object
 * @param {Options} options Self explanatory
 * @return {*}  {Promise<void>}
 */
export async function s3Upload(
  bucket: string,
  key: string,
  content: Uint8Array,
  options: Options,
): Promise<void> {
  const { region } = options;
  if (!s3) s3 = new S3Client({ region });
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: `${key}.zip`,
      Body: content,
    }),
  );
}
