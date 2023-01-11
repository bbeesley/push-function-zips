import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import JSZip from 'jszip';

/**
 * Adds files to a zip
 *
 * @private
 * @param {string} inputPath A pointer to the lambda artefact
 * @param {string[]} files A list of files to add
 * @param {string} [rootDir] An optional directory name within which the content should reside
 * @returns {*}  {Promise<JSZip>}
 */
export async function createZip(
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
 * Create a readable stream of a zip file containing files included from a list
 *
 * @private
 * @param {string} inputPath A pointer to the lambda artefact
 * @param {string[]} files A list of files to add
 * @param {string} [rootDir] An optional directory name within which the content should reside
 * @returns {*}  {Promise<NodeJS.ReadableStream>}
 */
export async function createZipStream(
  inputPath: string,
  files: string[],
  rootDir?: string,
): Promise<NodeJS.ReadableStream> {
  const zip = await createZip(inputPath, files, rootDir);
  return zip.generateNodeStream({
    platform: 'UNIX',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
  });
}
