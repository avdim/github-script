/* eslint-disable @typescript-eslint/no-explicit-any */

import {getOctokit} from '@actions/github'
import * as fs from 'fs'
import {Octokit} from '@octokit/core'

function getOctokitWithToken(): Octokit {
  let tokenStr: string = fs.readFileSync('token.txt', 'utf8')
  console.log('token.txt content:', tokenStr)
  return getOctokit(tokenStr);
}

describe('octokit-tests', () => {
  test('mail', async () => {
    let octokit = getOctokitWithToken();
    //https://docs.github.com/en/free-pro-team@latest/rest/reference/users#list-email-addresses-for-the-authenticated-user
    let mailResponse = await octokit.request('GET /user/emails')
    console.log('first mail: ', mailResponse.data[0].email)
    expect(mailResponse.data[0].email).toEqual('avdim@mail.ru')
  })
})
