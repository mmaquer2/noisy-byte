const { faker } = require('@faker-js/faker');

const createTask = async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.create({ name, description });
    res.json(task);
}

const createRandomTask = async (req, res) => {
    const randomName = faker.commerce.productName();
    const randomDescription = faker.lorem.sentence();
    const uuid = simpleFaker.string.uuid();

    const task = await Task.create({ name: randomName, description: randomDescription, "uuid": uuid });
    res.json(task);
}

module.exports = {
    createTask,
    createRandomTask
}