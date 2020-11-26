import * as path from "path";
import {addUser, createEmptyNpmRegistry, getModuleInfo, publishAsync} from "../src/npm-api";

const npm = require('../src/npm.js')
const REGISTRY = 'http://localhost:55552'
const MODULE_NAME = 'test-package'

const TGZ_PATH = path.resolve(__dirname, "resources", "test-package-1.0.1.tgz");
const AUTH = {
  username: "Username",
  password: "Password",
  email: "test@example.com",
  // alwaysAuth: true,
};

describe('npm-api', () => {

  testSkip('upload old', async () => {
    jest.setTimeout(3 * 60_000);
    await npm.load({
      registry: REGISTRY
    }, () => {
      npm.commands.publish([TGZ_PATH], (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
        }
      })
    })
  })

  test('upload type script', async () => {
    jest.setTimeout(3 * 60_000);
    const {startedContainer, registryUrl} = await createEmptyNpmRegistry();
    try {
      //https://github.com/npm/npm-registry-client
      //https://github.com/postmanlabs/npm-cli-login/blob/master/lib/login.js#L51
      await addUser(registryUrl, AUTH)
      await publishAsync(registryUrl, TGZ_PATH, MODULE_NAME, AUTH)
      expect(await getModuleInfo(registryUrl, MODULE_NAME, "1.0.1", AUTH) != undefined).toEqual(true)
    } finally {
      startedContainer.stop()
    }
  })

})

function testSkip(name: string, lambda: any) {

}
