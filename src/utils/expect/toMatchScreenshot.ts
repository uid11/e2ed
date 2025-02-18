import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

import {
  EXPECTED_SCREENSHOTS_DIRECTORY_PATH,
  INTERNAL_REPORTS_DIRECTORY_PATH,
} from '../../constants/internal';
import {getOutputDirectoryName} from '../../context/outputDirectoryName';
import {getTestStaticOptions} from '../../context/testStaticOptions';

import {getFullPackConfig} from '../config';
import {getPathToPack, getRunLabel} from '../environment';
import {E2edError} from '../error';
import {writeFile} from '../fs';
import {setReadonlyProperty} from '../setReadonlyProperty';

import type {
  FilePathFromRoot,
  ScreenshotMeta,
  Selector,
  ToMatchScreenshotOptions,
  Url,
} from '../../types/internal';

import type {Expect} from './Expect';

import {expect} from '@playwright/test';

type AdditionalLogFields = {
  actualScreenshotId: string | undefined;
  actualScreenshotUrl: Url | undefined;
  diffScreenshotId: string | undefined;
  diffScreenshotUrl: Url | undefined;
  expectedScreenshotId: string;
  expectedScreenshotUrl: Url | undefined;
};

/**
 * Checks that the selector screenshot matches the one specified by `expectedScreenshotId`.
 * @internal
 */
// eslint-disable-next-line max-statements
export const toMatchScreenshot = async (
  context: Expect,
  expectedScreenshotId: string,
  options: ToMatchScreenshotOptions,
): Promise<void> => {
  const actualValue = context.actualValue as Selector;
  const {description} = context;
  const {getScreenshotUrlById, readScreenshot, writeScreenshot} =
    getFullPackConfig().matchScreenshot;

  const assertId = randomUUID();
  const screenshotFileName = `${assertId}.png`;
  const screenshotPath = join(
    EXPECTED_SCREENSHOTS_DIRECTORY_PATH,
    screenshotFileName,
  ) as FilePathFromRoot;

  const additionalLogFields: AdditionalLogFields = {
    actualScreenshotId: undefined,
    actualScreenshotUrl: undefined,
    diffScreenshotId: undefined,
    diffScreenshotUrl: undefined,
    expectedScreenshotId,
    expectedScreenshotUrl: undefined,
  };

  setReadonlyProperty(context, 'additionalLogFields', additionalLogFields);

  let expectedScreenshotFound = false;

  if (expectedScreenshotId) {
    additionalLogFields.expectedScreenshotUrl = getScreenshotUrlById(expectedScreenshotId);

    const expectedScreenshot = await readScreenshot(expectedScreenshotId);

    if (expectedScreenshot !== undefined) {
      expectedScreenshotFound = true;
      await writeFile(screenshotPath, expectedScreenshot);
    }
  }

  const {mask = [], ...restOptions} = options;
  const meta: ScreenshotMeta = {
    description,
    isDiff: false,
    options,
    pathToPack: getPathToPack(),
    runLabel: getRunLabel(),
    selector: actualValue.description,
    testStaticOptions: getTestStaticOptions(),
    writeTimeInMs: Date.now(),
  };

  try {
    const playwrightLocator = actualValue.getPlaywrightLocator();

    await expect(playwrightLocator, description).toHaveScreenshot(screenshotFileName, {
      mask: mask.map((selector) => selector.getPlaywrightLocator()),
      ...restOptions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    const output = join(INTERNAL_REPORTS_DIRECTORY_PATH, getOutputDirectoryName());
    const actualScreenshotPath = join(output, `${assertId}-actual.png`) as FilePathFromRoot;
    const diffScreenshotPath = join(output, `${assertId}-diff.png`) as FilePathFromRoot;

    const actualScreenshot = await readFile(actualScreenshotPath);
    const actualScreenshotId = await writeScreenshot(actualScreenshot, meta);

    additionalLogFields.actualScreenshotId = actualScreenshotId;
    additionalLogFields.actualScreenshotUrl = getScreenshotUrlById(actualScreenshotId);

    const diffScreenshot = await readFile(diffScreenshotPath);
    const diffScreenshotId = await writeScreenshot(diffScreenshot, {...meta, isDiff: true});

    additionalLogFields.diffScreenshotId = diffScreenshotId;
    additionalLogFields.diffScreenshotUrl = getScreenshotUrlById(diffScreenshotId);

    throw new E2edError(message);
  }

  if (expectedScreenshotFound) {
    return;
  }

  const actualScreenshot = await readFile(screenshotPath);
  const actualScreenshotId = await writeScreenshot(actualScreenshot, meta);

  additionalLogFields.actualScreenshotId = actualScreenshotId;
  additionalLogFields.actualScreenshotUrl = getScreenshotUrlById(actualScreenshotId);

  const message = expectedScreenshotId
    ? `Cannot read expected screenshot ${expectedScreenshotId}`
    : 'Expected screenshot not specified';

  throw new E2edError(message);
};
