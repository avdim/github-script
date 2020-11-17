import {DockerComposeEnvironment, StartedTestContainer} from "testcontainers";
import * as path from "path";

const npmCliLogin = require('npm-cli-login');
const migrate = require('../src/npm-migrate')
const npmUtils = require('../src/npm_utils')
const {GenericContainer} = require("testcontainers");
const util = require('util');

const MODULE_NAME = 'test-package'
const FROM = 'http://localhost:55551'
const TO = 'http://localhost:55552'
const ROOT_PATH = path.resolve(__dirname, "../");

describe('migrate', () => {
  test('test1', async () => {
    jest.setTimeout(2 * 60_000);
    const environment = await new DockerComposeEnvironment(
      ROOT_PATH,
      "npm-registries.yml"
    ).up();
    npmCliLogin("Username", "Password", "test@example.com", "http://localhost:55551")
    npmCliLogin("Username", "Password", "test@example.com", "http://localhost:55552")
    //sh: node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55551

    //todo publish test-package
    const exec = util.promisify(require('child_process').exec);
    async function lsWithGrep() {
      try {
        const {stdout, stderr} = await exec('npm ci && npm publish', {
          cwd: path.resolve(ROOT_PATH, "test-package-dir")
        });
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
      } catch (err) {
        console.error("my catch, err:", err);
      }
    }
    await lsWithGrep();

    try {
      console.log("migrate fun: ", migrate)
      await migrate(MODULE_NAME, FROM, TO, {debug: false})
        .then((migrated: any) => console.log("migrated", migrated)) // list of migrated packages
        .catch((err: any) => console.error("my err", err))
      let resultVersions: Array<string> = await npmUtils.getVersionList(MODULE_NAME, TO);
      // expect(resultVersions.indexOf("1.0.1") >= 0).toEqual(true)//todo
    } finally {
      await environment.down()
    }

  })
})
