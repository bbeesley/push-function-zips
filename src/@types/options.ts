export enum Platform {
  'AWS' = 'AWS',
  'GCP' = 'GCP',
}

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
  bucket: string;
  /**
   * The key name to upload the function zip as
   *
   * @type {string}
   */
  functionKey: string;
  /**
   * The key name to upload the layer as
   *
   * @type {string}
   */
  layerKey?: string;
  /**
   * The name of a google project to upload to
   *
   * @type {string}
   */
  project?: string;
  /**
   * The target we're uploading to
   *
   * @type {Platform}
   */
  platform: Platform;
};

export type OptionsNoLayer = {
  include: string[];
  exclude: string[];
  createLayer: false;
} & Options;
export type OptionsForLayer = {
  layerKey: string;
  include: string[];
  exclude: string[];
  createLayer: true;
} & Options;
