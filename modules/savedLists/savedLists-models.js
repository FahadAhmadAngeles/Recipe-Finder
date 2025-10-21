const { readFile, writeToFile } = require("../../shared/utils");

const filePath = "./data/savedLists.json";

async function getAllLists() {
    return readFile(filePath);
}

async function getListByUserId(customerId) {
    const lists = await getAllLists();
    const foundList = lists.find((list) => list.customerid === customerId);
    
    if (foundList) {
        return foundList;
    } else {
        throw new Error("Saved list not found");
    }
}

async function createList(newList) {
    const lists = await getAllLists();
    lists.push(newList);
    await writeToFile(filePath, lists);
    return newList;
}

async function updateList(customerId, updatedRecipeIds) {
    const lists = await getAllLists();
    const index = lists.findIndex((list) => list.customerid === customerId);

    if (index !== -1) {
        lists[index].recipeIds = updatedRecipeIds;
        await writeToFile(filePath, lists);
        return lists[index];
    } else {
        throw new Error("Saved list not found");
    }
}

async function deleteList(customerId) {
    const lists = await getAllLists();
    const index = lists.findIndex((list) => list.customerid === customerId);

    if (index !== -1) {
        const deletedList = lists.splice(index, 1)[0];
        await writeToFile(filePath, lists);
        return deletedList;
    } else {
        throw new Error("Saved list not found");
    }
}

module.exports = {
    getAllLists,
    getListByUserId,
    createList,
    updateList,
    deleteList
};