import * as fs from "fs";
import * as path from "path";

const RegClient = require('npm-registry-client');

const npm = require('../src/npm.js')
const REGISTRY = 'http://localhost:55552'
const MODULE_NAME = 'test-package'
const REG_CLIENT = new RegClient();

const TGZ_PATH = path.resolve(__dirname, "resources", "test-package-1.0.1.tgz");
const AUTH = {
  username: "Username",
  password: "Password",
  email: "test@example.com"
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
    await publishAsync(REGISTRY, TGZ_PATH, MODULE_NAME, AUTH)

    // REG_CLIENT.get(
    //   REGISTRY,
    //   {
    //     auth: AUTH,
    //     fullMetadata: true
    //   },
    //   (err: any, data: any) => {
    //     if (err) {
    //       console.log("err: ", err)
    //     } else {
    //       console.log("regClient.get data: ", data)
    //     }
    //   }
    // );

  })

})

function testSkip(name: string, lambda: any) {

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
          version: "1.0.1"
        },
        auth: auth
      },
      (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
          reject(err)
        } else {
          console.log("regClient.publish data: ", data)
          resolve(data)
        }
      }
    )
    // setTimeout(() => resolve("готово!"), 1000)
  });
}

