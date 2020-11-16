/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs'
const migrate = require('../src/npm-migrate')
const npmUtils = require('../src/npm_utils')
const moduleName = 'test-package'
const from = 'http://localhost:55551'
const to = 'http://localhost:55552'

describe('migrate', () => {
  test('test1', async () => {
    console.log("migrate fun: ", migrate)
    await migrate(moduleName, from, to, {debug: false})
      .then((migrated:any) => console.log("migrated", migrated)) // list of migrated packages
      .catch((err:any) => console.error("my err", err))

    let resultVersions: Array<string> = await npmUtils.getVersionList(moduleName, to);
    expect(resultVersions.indexOf("1.0.1") >= 0).toEqual(true)

    expect('a').toEqual('a')
  })
})
