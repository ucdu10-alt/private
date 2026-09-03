import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// This sandbox blocks Remotion's own Chrome Headless Shell download host,
// but a Playwright-provisioned Chromium build is preinstalled -- reuse it
// instead of trying to fetch a separate browser binary.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
