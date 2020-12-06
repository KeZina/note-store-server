import jwt from 'jsonwebtoken';
import config from 'config';

const createJwt = (name: string): string => {
    const token: string =  jwt.sign(
        {
            name,
        },
        config.get('jwtSecret'),
        {
            expiresIn: '12h'
        }
    );

    return token;
}

export default createJwt;