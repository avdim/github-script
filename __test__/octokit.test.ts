/* eslint-disable @typescript-eslint/no-explicit-any */

import {callAsyncFunction} from '../src/async-function'
import {getOctokit} from "@actions/github";
import * as fs from "fs";

describe('octokit tests', () => {
  test('octoki1', async () => {
    let content = fs.readFileSync('token.txt','utf8');
    console.log("token.txt content:", content)
    // getOctokit()
    // await callAsyncFunction({} as any, 'console')
  })
})
