import {DockerComposeEnvironment, StartedTestContainer} from "testcontainers";
import * as path from "path";

const npmCliLogin = require('npm-cli-login');
const migrate = require('../src/npm-migrate')
const npmUtils = require('../src/npm_utils')
const {GenericContainer} = require("testcontainers");
const util = require('util');

const MODULE_NAME = 'test-package'
const TO = 'http://localhost:55552'
const ROOT_PATH = path.resolve(__dirname, "../");
const DEFAULT_NPM_PORT = 4873

describe('migrate', () => {
  test('test1', async () => {
    jest.setTimeout(3 * 60_000);

    const buildContext = path.resolve(ROOT_PATH, "test-package-dir");
    const container = await GenericContainer.fromDockerfile(buildContext).build();

    const startedContainer = await container
      .withExposedPorts(DEFAULT_NPM_PORT)
      .start();
    //todo speedup to local test
    // const startedContainer = await new GenericContainer("temp/npm_test_package", "tag1")
    //   .withExposedPorts(DEFAULT_NPM_PORT)
    //   .start()

    let mappedFromPort: number = startedContainer.getMappedPort(DEFAULT_NPM_PORT);
    console.log("mappedPort: ", mappedFromPort)
    const FROM = `http://localhost:${mappedFromPort}`

    console.log("before timeout", new Date().getSeconds())
    await timeout(5_000)
    console.log("after timeout", new Date().getSeconds())

    // const environment = await new DockerComposeEnvironment(ROOT_PATH, "npm-registries.yml").up();
    npmCliLogin("Username", "Password", "test@example.com", FROM)
    // npmCliLogin("Username", "Password", "test@example.com", TO)
    //sh: node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55551

    try {
      await migrate(MODULE_NAME, FROM, TO, {debug: true})
        .then((migrated: any) => console.log("migrated", migrated)) // list of migrated packages
        .catch((err: any) => console.error("my err", err))
      let resultVersions: Array<string> = await npmUtils.getVersionList(MODULE_NAME, TO);
      expect(resultVersions.indexOf("1.0.1") >= 0).toEqual(true)
    } finally {
      // await environment.down()
    }

  })
})

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
