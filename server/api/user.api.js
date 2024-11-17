

const createUser = async (req, res) => {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.json(user);
}

const login = async (req, res) => {
    const { email, password } = req.body;

}


const createRandomUser = async (req, res) => {
    const randomName = faker.person.fullName();
    const randomEmail = faker.internet.email();

    const user = await User.create({ name: randomName, email: randomEmail });
    res.json(user);
}

module.exports = {
    createUser,
    createRandomUser,
    login
}