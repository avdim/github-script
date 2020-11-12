/* eslint-disable @typescript-eslint/no-explicit-any */

import {getOctokit} from '@actions/github'
import * as fs from 'fs'
import {Octokit} from '@octokit/core'

describe('octokit tests', () => {
  test('mail', async () => {
    let tokenStr: string = fs.readFileSync('token.txt', 'utf8')
    console.log('token.txt content:', tokenStr)
    let octokit: Octokit = getOctokit(tokenStr)
    let mailResponse = await octokit.request('GET /user/emails')
    console.log('first mail: ', mailResponse.data[0].email)
    expect(mailResponse.data[0].email).toEqual('avdim@mail.ru')
  })
})
