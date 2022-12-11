import {join} from 'node:path';

import type {DirectoryPathFromRoot, FilePathFromRoot} from '../types/internal';

/**
 * Absolute path to the project root directory.
 * @internal
 */
export const ABSOLUTE_PATH_TO_PROJECT_ROOT_DIRECTORY = process.cwd();

/**
 * Relative (from root) path to installed e2ed package directory.
 * @internal
 */
export const E2ED_PACKAGE_DIRECTORY_PATH = join('node_modules', 'e2ed') as DirectoryPathFromRoot;

/**
 * Relative (from root) path to reports directory.
 * @internal
 */
export const REPORTS_DIRECTORY_PATH = join('autotests', 'reports') as DirectoryPathFromRoot;

/**
 * Relative (from root) path to tmp directory.
 * @internal
 */
export const TMP_DIRECTORY_PATH = join(REPORTS_DIRECTORY_PATH, 'tmp') as DirectoryPathFromRoot;

/**
 * Relative (from root) path to directory with compiled userland config file.
 * @internal
 */
export const COMPILED_USERLAND_CONFIG_DIRECTORY = join(
  TMP_DIRECTORY_PATH,
  'config',
) as DirectoryPathFromRoot;

/**
 * Relative (from root) path to compiled userland config file.
 * @internal
 */
export const COMPILED_USERLAND_CONFIG_PATH = join(COMPILED_USERLAND_CONFIG_DIRECTORY, 'config.js');

/**
 * Relative (from root) path to events directory.
 * @internal
 */
export const EVENTS_DIRECTORY_PATH = join(TMP_DIRECTORY_PATH, 'events') as DirectoryPathFromRoot;

/**
 * Relative (from root) path to start info JSON file.
 * @internal
 */
export const START_INFO_PATH = join(TMP_DIRECTORY_PATH, 'startInfo.json');

/**
 * Relative (from root) path to userland config file.
 * @internal
 */
export const USERLAND_CONFIG_PATH = join('autotests', 'config.ts') as FilePathFromRoot;

/**
 * Relative (from root) path to userland override config file.
 * @internal
 */
export const USERLAND_OVERRIDE_CONFIG_PATH = join(
  'autotests',
  'overrideConfig.ts',
) as FilePathFromRoot;