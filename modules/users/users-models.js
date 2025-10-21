const { readFile, writeToFile } = require("../../shared/utils");

const filePath = "./data/users.json";

async function getAllUsers() {
    return readFile(filePath);
}

async function getUserById(customerId) {
    const users = await getAllUsers();
    const foundUserIndex = users.findIndex((user) => user.customerid === customerId);
    
    if (foundUserIndex !== -1) {
        return users[foundUserIndex];
    } else {
        throw new Error("User not found");
    }
}

async function addUser(newUser) {
    const users = await getAllUsers();
    users.push(newUser);
    await writeToFile(filePath, users);
    return newUser;
}

async function updateUser(customerId, updatedUser) {
    const users = await getAllUsers();
    const index = users.findIndex((user) => user.customerid === customerId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        await writeToFile(filePath, users);
        return users[index];
    } else {
        throw new Error("User not found");
    }
}

async function deleteUser(customerId) {
    const users = await getAllUsers();
    const index = users.findIndex((user) => user.customerid === customerId);

    if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        await writeToFile(filePath, users);
        return deletedUser;
    } else {
        throw new Error("User not found");
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};