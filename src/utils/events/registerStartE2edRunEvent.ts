import {RunEnvironment} from '../../configurator';
import {
  e2edEnvironment,
  EVENTS_DIRECTORY_PATH,
  ExitCode,
  PATH_TO_TEST_FILE_VARIABLE_NAME,
  TMP_DIRECTORY_PATH,
} from '../../constants/internal';

import {getFullPackConfig, updateConfig} from '../config';
import {getPathToPack, setDotEnvValuesToEnvironment} from '../environment';
import {E2edError} from '../error';
import {setGlobalExitCode} from '../exit';
import {createDirectory, removeDirectory, writeStartInfo} from '../fs';
import {generalLog, writeLogsToFile} from '../generalLog';
import {compilePack} from '../packCompiler';
import {getStartInfo} from '../startInfo';

import {runBeforePackFunctions} from './runBeforePackFunctions';

/**
 * Registers start e2ed run event (for report) before running any test.
 * @internal
 */
// eslint-disable-next-line max-statements
export const registerStartE2edRunEvent = async (): Promise<void> => {
  await removeDirectory(TMP_DIRECTORY_PATH);
  await createDirectory(EVENTS_DIRECTORY_PATH);

  let errorSettingDotEnv: unknown;

  await setDotEnvValuesToEnvironment().catch((error: unknown) => {
    errorSettingDotEnv = error;
  });

  const pathToTestFile = process.argv[2];

  if (pathToTestFile !== undefined) {
    e2edEnvironment[PATH_TO_TEST_FILE_VARIABLE_NAME] = pathToTestFile;
  }

  let compileErrors: readonly Readonly<Record<string, string>>[] = [];
  let configCompileTimeWithUnits = '';

  try {
    ({compileErrors, configCompileTimeWithUnits} = compilePack());
  } catch (cause) {
    setGlobalExitCode(ExitCode.HasErrorsInCompilingConfig);

    throw new E2edError('Caught an error on compiling config', {cause});
  }

  const startInfo = getStartInfo({configCompileTimeWithUnits});

  try {
    try {
      await runBeforePackFunctions(startInfo);
    } catch (cause) {
      setGlobalExitCode(ExitCode.HasErrorsInDoBeforePackFunctions);

      throw new E2edError('Caught an error on running "before pack" functions', {cause});
    }

    const fullPackConfig = getFullPackConfig();

    updateConfig(fullPackConfig, startInfo);

    if (errorSettingDotEnv !== undefined) {
      generalLog('Caught an error on setting environment variables from `variables.env` file', {
        errorSettingDotEnv,
      });
    }

    if (compileErrors.length !== 0) {
      const pathToPack = getPathToPack();

      generalLog(`Caught errors on compiling pack ${pathToPack}`, {compileErrors});
    }

    const {e2ed, runEnvironment} = startInfo;
    const isLocalRun = runEnvironment !== RunEnvironment.Docker;
    const startMessage = `Run tests ${isLocalRun ? 'local' : 'in docker'} with e2ed@${e2ed.version}`;

    generalLog(startMessage, startInfo);
  } finally {
    await writeStartInfo(startInfo);
    await writeLogsToFile();
  }
};
