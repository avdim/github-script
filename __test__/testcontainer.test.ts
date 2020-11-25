import {DockerComposeEnvironment, StartedTestContainer} from "testcontainers";
import * as path from "path";
import {request, RequestOptions} from 'http';

const npmCliLogin = require('npm-cli-login');
const migrate = require('../src/npm-migrate')
const npmUtils = require('../src/npm_utils')
const {GenericContainer} = require("testcontainers");
const util = require('util');
const got = require('got');

const MODULE_NAME = 'test-package'
const FROM = 'http://localhost:55551'
const TO = 'http://localhost:55552'
const ROOT_PATH = path.resolve(__dirname, "../");

function performRequest(options: RequestOptions) {
  return new Promise<string>((resolve, reject) => {
    request(
      options,
      function(response) {
        const { statusCode } = response;
        // @ts-ignore
        if (statusCode >= 300) {
          reject(
            new Error(response.statusMessage)
          )
        }
        const chunks: any[] = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const result = Buffer.concat(chunks).toString();
          resolve(JSON.parse(result));
        });
      }
    )
      .end();
  })
}

describe('testcontainer', () => {
  test('hello get', async () => {
    jest.setTimeout(2 * 60_000);

    // const environment = await new DockerComposeEnvironment(
    //   ROOT_PATH,
    //   "hello-compose.yml"
    // ).up();

    const startedContainer = await new GenericContainer("avdim/ktor_hello", "latest")
      .withExposedPorts(8080)
      .start()
    let mappedPort: number = startedContainer.getMappedPort(8080);
    console.log("mappedPort: ", mappedPort)

    try {
      const resp = await got(`http://localhost:${mappedPort}`)
      console.log("resp.body: ", resp.body)
      const strBody: string = resp.body
      expect(strBody.indexOf("Hello") >= 0).toEqual(true)
      // const response1: string = await performRequest({
      //   host: "localhost",
      //   path: "/",
      //   port: "8080",
      //   method: 'GET',
      // })
      // console.log("response1: ", response1)
    } finally {
      await startedContainer.stop()
      // await environment.down()// await environment.stop()
    }

  })
})
