const { faker } = require('@faker-js/faker');

/// function to generate random traffic from the client side
const generateRandomTraffic = async (req, res) => {
    console.log("THIS IS A RANDOM TRAFFIC");
    const type = ["GET", "POST", "PUT", "DELETE"];
    const randomType = type[Math.floor(Math.random() * type.length)];
    const randomPath = faker.internet.url();
    const uuid = faker.string.uuid();
    const status_code = [200, 201, 204];
    res.json({ type: randomType, path: randomPath, uuid });

};

/// function to create some random errors
const generateRandomErrors = async (req, res) => {
    console.log("THIS IS A RANDOM ERROR");
    const type = ["GET", "POST", "PUT", "DELETE"];
    const randomType = type[Math.floor(Math.random() * type.length)];
    const randomPath = faker.internet.url();
    const uuid = faker.string.uuid();
    const errorCode = [400, 401, 404, 500];
    const randomErrorCode = errorCode[Math.floor(Math.random() * errorCode.length)];
    
    res.json({ code: randomErrorCode ,type: randomType, path: randomPath, uuid });
};


module.exports = {
    generateRandomTraffic,
    generateRandomErrors
}