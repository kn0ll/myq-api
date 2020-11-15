import MyQ from '../../src';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MYQ_EMAIL?: string;
      MYQ_PASSWORD?: string;
    }
  }
}

function expectEnv(value: string | undefined) {
  if (value === undefined) {
    expect(value).toBeDefined();
  }

  return value;
}

test('login() fails when credentials are incorrect', async () => {
  const account = new MyQ();
  const promise = account.login('fake', 'fake');

  await expect(promise).rejects.toMatchObject({
    code: MyQ.constants.codes.AUTHENTICATION_FAILED,
  });
});

test('login() succeeds when credentials are correct', async () => {
  const email = expectEnv(process.env.MYQ_EMAIL);
  const password = expectEnv(process.env.MYQ_EMAIL);

  if (!email || !password) {
    return;
  }

  const account = new MyQ();
  const promise = account.login(email, password);

  await expect(promise).resolves.toEqual(
    expect.objectContaining({
      code: MyQ.constants.codes.OK,
      securityToken: expect.any(String),
    })
  );
});

test('getAccountId() succeeds', async () => {
  const email = expectEnv(process.env.MYQ_EMAIL);
  const password = expectEnv(process.env.MYQ_EMAIL);

  if (!email || !password) {
    return;
  }

  const account = new MyQ();
  await account.login(email, password);
  const promise = account._getAccountId();

  await expect(promise).resolves.toEqual(
    expect.objectContaining({
      code: MyQ.constants.codes.OK,
      accountId: expect.any(String),
    })
  );
});

test('getDevices() succeeds', async () => {
  const email = expectEnv(process.env.MYQ_EMAIL);
  const password = expectEnv(process.env.MYQ_EMAIL);

  if (!email || !password) {
    return;
  }

  const account = new MyQ();
  await account.login(email, password);
  const promise = account.getDevices();

  await expect(promise).resolves.toEqual(
    expect.objectContaining({
      code: MyQ.constants.codes.OK,
      devices: expect.any(Array),
    })
  );
});
