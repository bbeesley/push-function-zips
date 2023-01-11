import { globby } from 'globby';

/**
 * Gets a list of files matching one or more globbing patterns
 *
 * @export
 * @param {string} path The path to start from
 * @param {string[]} include The globbing patterns to include
 * @param {string[]} [exclude=[]] Any globbing patterns to exclude
 * @return {*}  {Promise<string[]>}
 */
export async function getFileList(
  path: string,
  include: string[],
  exclude: string[] = [],
): Promise<string[]> {
  const files = await globby(include, {
    cwd: path,
    ignore: [...exclude],
  });
  return files;
}
