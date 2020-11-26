import * as fs from "fs";
import * as http from "http";
import {GenericContainer, StartedTestContainer} from "testcontainers";
import * as path from "path";

const RegClient = require('npm-registry-client');
const DEFAULT_NPM_PORT = 4873

export async function addUser(registryUrl: string, auth: any): Promise<unknown> {
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

export async function publishAsync(registryUrl: string, tgzPath: string, moduleName: string, auth: any): Promise<unknown> {
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

export async function downloadTarball(registryUrl: string, moduleName: String, version: string, auth: any): Promise<string> {
  let moduleInfo:any = await getModuleInfo(registryUrl, moduleName, version, auth);
  const tarballUrl = moduleInfo.dist.tarball as string;
  const tempTgzPath: string = path.join(__dirname, `../.tmp/tmp-${Math.random()}.tgz`)
  await new Promise(resolve => {
    fs.mkdir(path.join(__dirname, `../.tmp/`), () => {
      resolve()
    })
  })
  const file = fs.createWriteStream(tempTgzPath);
  return await new Promise<string>(resolve => {
    const request = http.get(tarballUrl, function(response) {
      response.pipe(file);
      resolve(tempTgzPath)
    });
  })

}

export async function getModuleInfo(registryUrl: string, moduleName: String, version: string, auth: any): Promise<unknown> {
  let regInfo: any = await new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
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

export async function createEmptyNpmRegistry() {
  const startedContainer: StartedTestContainer = await new GenericContainer("verdaccio/verdaccio", "4.8.1")
    .withExposedPorts(DEFAULT_NPM_PORT)
    .start()
  let mappedFromPort: number = startedContainer.getMappedPort(DEFAULT_NPM_PORT);
  const registryUrl = `http://localhost:${mappedFromPort}`
  return {startedContainer, registryUrl};
}
