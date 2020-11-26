import * as path from "path";
import {addUser, createEmptyNpmRegistry, downloadTarball, getModuleInfo, publishAsync} from "../src/npm-api";

const npm = require('../src/npm.js')
const REGISTRY = 'http://localhost:55552'
const MODULE_NAME = 'test-package'
const MODULE_VERSION = '1.0.1'

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
    const {startedContainer: container1, registryUrl: registry1} = await createEmptyNpmRegistry();
    const {startedContainer: container2, registryUrl: registry2} = await createEmptyNpmRegistry();
    try {
      //https://github.com/npm/npm-registry-client
      //https://github.com/postmanlabs/npm-cli-login/blob/master/lib/login.js#L51
      await addUser(registry1, AUTH)
      await publishAsync(registry1, TGZ_PATH, MODULE_NAME, AUTH)
      const moduleInfo1:any = await getModuleInfo(registry1, MODULE_NAME, MODULE_VERSION, AUTH);
      expect(moduleInfo1 != undefined).toEqual(true)
      const tmpTgz = await downloadTarball(registry1, MODULE_NAME, MODULE_VERSION, AUTH);
      await addUser(registry2, AUTH)
      await publishAsync(registry2, tmpTgz, MODULE_NAME, AUTH)
      const moduleInfo2:any = await getModuleInfo(registry2, MODULE_NAME, MODULE_VERSION, AUTH);
      expect(moduleInfo2 != undefined).toEqual(true)
    } finally {
      container1.stop()
      container2.stop()
    }
  })

})

function testSkip(name: string, lambda: any) {

}
