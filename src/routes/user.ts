import express from 'express';
import dbConnect from '../utils/db-connect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import UserQuery from '../query/user-query';
import checkToken from '../utils/check-token';

const router: any = express.Router();

router.post('/user/login', async (req: Request, res: any): Promise<void> => {
    const request: any = req.body;
    let {name, password} = request;
    name = name.toLowerCase();
    let db: any;

    try {
        db = await dbConnect();

        let allowedUser = await UserQuery.getUser(db, name);

        if(allowedUser) {
            const isPassword: boolean = await bcrypt.compare(password, allowedUser.password);
            if(!isPassword) {
                throw new Error("You don't have access");
            } else if(isPassword) {
                const db = await dbConnect();
                await db.end();

                const token: any =  jwt.sign(
                    {
                        name,
                    },
                    config.get('jwtSecret'),
                    {
                        expiresIn: '12h'
                    }
                );

                await UserQuery.updateToken(db, name, token);                

                res.json({
                    message: `Hi ${name}! :)`,
                    status: 1,
                    name,
                    token
                })
            }
        } else {
            throw new Error("You don't have access");
        };
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/user/change-pass', async (req: Request, res: any): Promise<void> => {
    let db: any;
    const request: any = req.body;
    const {token, password, name} = request;

    try {
        await checkToken(token, name);
        db = await dbConnect();
        const hash = await bcrypt.hash(password, 15);

        await UserQuery.updatePassword(db, hash, token);

        res.json({
            message: 'Your password has been changed success!',
            status: 1
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/user/logout', async (req: Request, res: any): Promise<void> => {
    let db: any;
    const request: any = req.body;
    const {name} = request;

    try {
        db = await dbConnect();

        await UserQuery.logout(db, name);

        res.json({
            message: 'See you later! :)',
            status: 1
        })
    } catch(e) {
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

router.post('/user/auth', async (req: Request, res: any): Promise<void> => {
    let db: any;
    const request: any = req.body;
    const {token} = request;

    try {   
        const verToken: any = jwt.verify(token, config.get('jwtSecret'));
        await checkToken(token, verToken.name);
        db = await dbConnect();
       
        const user = await UserQuery.getUser(db, verToken.name);

        await db.end();
        res.json({
            message: `Hi ${verToken.name}! :)`,
            status: 1,
            name: verToken.name,
        })
    } catch(e) {
        if(e.message === 'jwt expired') {
            db = await dbConnect();
            await UserQuery.logout(db, token);
        }
        const err = {message: e.message, stack: e.stack};

        res.json({
            message: err,
            status: 0
        })
    } finally {
        db && db.end();
    }
})

export default router;