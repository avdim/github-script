import * as fs from "fs";
import * as path from "path";
const RegClient = require('npm-registry-client');

const npm = require('../src/npm.js')
const REGISTRY = 'http://localhost:55552'

const TGZ_PATH = path.resolve(__dirname, "resources", "test-package-1.0.1.tgz");

describe('npm-api', () => {

  testSkip('upload1', async () => {
    jest.setTimeout(3 * 60_000);
    await npm.load({
      registry: REGISTRY
    }, () => {
      npm.commands.publish([TGZ_PATH], (err:any, data:any) => {
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
    const regClient = new RegClient();
    await regClient.publish(
      REGISTRY,
      {
        body: fs.createReadStream(TGZ_PATH),
        metadata: {
          name: "test-package",//todo argument
          version: "1.0.1"
        },
        auth: {
          username: "Username",
          password: "Password",
          email: "test@example.com"
        }
      },
      (err: any, data: any) => {
        if (err) {
          console.log("err: ", err)
        }
      }
    )
  })

})

function testSkip(name: string, lambda:any) {

}
