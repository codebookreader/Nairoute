import crypto from 'crypto';

function hashPassword(password){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password,storedHash){
    if(!storedHash) return false;
    if(!storedHash.includes(':')){
        return password === storedHash;
    }
    const [salt,originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');
    return hash === originalHash
}
export { hashPassword, verifyPassword };