const bcrypt = require('bcrypt');
const users = [];

const testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: bcrypt.hashSync('test123', 10)
};
users.push(testUser);

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function createUser(email, password, name) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { email, password: hashedPassword, name };
    users.push(newUser);
    return newUser;
}

function addUser(name, email, password) {
    if (findUserByEmail(email)) {
        throw new Error('Email already in use');
    }
    return createUser(email, password, name);
}

function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {users, findUserByEmail, createUser, addUser, comparePassword};