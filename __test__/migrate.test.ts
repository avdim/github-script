import {DockerComposeEnvironment, StartedTestContainer} from "testcontainers";
import * as path from "path";

const npmCliLogin = require('npm-cli-login');
const migrate = require('../src/npm-migrate')
const npmUtils = require('../src/npm_utils')
const {GenericContainer} = require("testcontainers");

const moduleName = 'test-package'
const from = 'http://localhost:55551'
const to = 'http://localhost:55552'

describe('migrate', () => {
  test('test1', async () => {
    jest.setTimeout(60_000);
    const environment = await new DockerComposeEnvironment(
      path.resolve(__dirname, "../"),
      "npm-registries.yml"
    ).up();
    npmCliLogin("Username", "Password", "test@example.com", "http://localhost:55551")
    npmCliLogin("Username", "Password", "test@example.com", "http://localhost:55552")
    //sh: node_modules/.bin/npm-cli-login -u Username -p Password -e test@example.com -r http://localhost:55551

    try {
      console.log("migrate fun: ", migrate)
      await migrate(moduleName, from, to, {debug: false})
        .then((migrated: any) => console.log("migrated", migrated)) // list of migrated packages
        .catch((err: any) => console.error("my err", err))

      //todo publish test-package

      let resultVersions: Array<string> = await npmUtils.getVersionList(moduleName, to);
      // expect(resultVersions.indexOf("1.0.1") >= 0).toEqual(true)//todo
    } finally {
      await environment.down()
    }

  })
})
