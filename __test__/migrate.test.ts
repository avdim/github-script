/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs'
// const migrate = require('npm-migrate')
const moduleName = 'test-package'
const from = 'http://localhost:55551'
const to = 'http://localhost:55552'

describe('migrate', () => {
  test('test1', async () => {
    // console.log("migrate fun: ", migrate)
    // migrate(moduleName, from, to, {debug: false})
    expect('a').toEqual('a')
  })
})
