import bcrypt from 'bcrypt';

const createHash = async (password: string): Promise<string> => {
    const hash: string = await bcrypt.hash(password, 15);
    
    return hash;
}

export default createHash;