import UserQuery from "../src/query/user-query";
import dbConnect from "../src/utils/db-connect";
import createHash from "../src/utils/create-hash";
import createJwt from "../src/utils/create-jwt";

describe('check user query', () => {
  test('create user', async () => {
    const db: any = await dbConnect();
    const hash: string = await createHash('test_password');
    const token: string = createJwt('test_user');

    await UserQuery.addUser(db, 'test_user', hash, token)
    await db.end();
  });

  test('get user', async () => {
    const db: any = await dbConnect();
    const {name} = await UserQuery.getUser(db, 'test_user');
    
    expect(name).toBe('test_user');

    await db.end();
  });

  test('delete user', async () => {
    const db: any = await dbConnect();

    await UserQuery.deleteUser(db, 'test_user');
    await db.end();
  });

})