import jwt from 'jsonwebtoken';
import config from 'config';
import dbConnect from './db-connect';
import UserQuery from "../query/user-query";

const checkToken = async (token: string, name: string): Promise<void> => {
    const db: any = await dbConnect();
    const user: any = await UserQuery.getUser(db, name);
    const isSameToken: boolean = token === user.token ? true : false;

    if(isSameToken) {
        jwt.verify(token, config.get('jwtSecret'));
    } else throw new Error(`Wrong token`);

    await db.end();
}

export default checkToken;