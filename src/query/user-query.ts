export default class UserQuery {

    public static async getUser(db: any, name: string): Promise<any> {
        try {
            const allowedUser: any = await db.query(`
                SELECT *
                FROM profile
                WHERE name = '${name}'
            `)

            return allowedUser.rows[0];
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async addUser(db: any, name: string, hash: string, token: string): Promise<void> {
        try {
            await db.query(`
                INSERT INTO profile 
                (name, password, token)
                VALUES ('${name}', '${hash}', '${token}')
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async deleteUser(db: any, name: string): Promise<void> {
        try {
            await db.query(`
                DELETE FROM profile
                WHERE name = '${name}'
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async updateToken(db: any, name: string, token: string): Promise<void> {
        try {
            await db.query(`
                UPDATE profile
                SET token = '${token}'
                WHERE name = '${name}'
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async logout(db: any, name: string): Promise<void> {
        try {
            await db.query(`
                UPDATE profile
                SET token = null
                WHERE name = '${name}'
            `)
        } catch(e) {
            throw new Error(e);
        }
    }

    public static async updatePassword(db: any, hash: string, token: string): Promise<void> {
        try {
            await db.query(`
                UPDATE profile
                SET password = '${hash}'
                WHERE token = '${token}'
            `)
        } catch(e) {
            throw new Error(e);
        }
    }
}