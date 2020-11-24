import * as fs from "fs";
import * as path from "path";

const RegClient = require('npm-registry-client');

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

  testSkip('upload1', async () => {
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

  test('upload2', async () => {
    jest.setTimeout(3 * 60_000);
    //https://github.com/npm/npm-registry-client
    //https://github.com/postmanlabs/npm-cli-login/blob/master/lib/login.js#L51
    await addUser(REGISTRY, AUTH)
    await publishAsync(REGISTRY, TGZ_PATH, MODULE_NAME, AUTH)
    expect(await getModuleInfo(REGISTRY, MODULE_NAME, "1.0.1", AUTH) != undefined).toEqual(true)
  })

})

function testSkip(name: string, lambda: any) {

}

async function addUser(registryUrl: string, auth: any): Promise<unknown> {
  return await new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
    const regClient = new RegClient();
    regClient.adduser(
      registryUrl,
      {
        auth: auth
      },
      (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  });
}

async function publishAsync(registryUrl: string, tgzPath: string, moduleName: string, auth: any): Promise<unknown> {
  return await new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
    const regClient = new RegClient();
    regClient.publish(
      registryUrl,
      {
        body: fs.createReadStream(tgzPath),
        metadata: {
          name: moduleName,//todo определять автоматически
          version: "1.0.1"//todo определять автоматически
        },
        auth: auth
      },
      (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  });
}

async function getModuleInfo(registryUrl: string, moduleName:String, version:string, auth: any): Promise<unknown> {
  let regInfo:any = await new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
    const regClient = new RegClient();
    regClient.get(
      registryUrl + `/${moduleName}`,
      {
        auth: auth,
        fullMetadata: true
      },
      (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
          reject(err)
        } else {
          resolve(data)
        }
      }
    );
  });
  return regInfo.versions[version]
}

