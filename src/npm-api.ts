const RegClient = require('npm-registry-client');

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
