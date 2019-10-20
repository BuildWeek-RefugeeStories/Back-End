const app = require("../index");
const bcrypt = require("bcryptjs");
const Users = require("./users");
const request = require("supertest");

// Dummy password
const password = "Password123";

// Expected user object
const dummyUser = {
  email: "mtourjoman0@gmail.com",
  first_name: "Mohammad",
  last_name: "Tourjoman",
  country: "Syria",
  password: bcrypt.hashSync(password, 15)
};

const dummyUserFromClient = {
  email: "mtourjoman01@gmail.com",
  firstName: "Mohammad",
  lastName: "Tourjoman",
  country: "Syria",
  password
}

describe("POST /auth/login", () => {
  it("successfully autenticates a user", async () => {
    await Users.register(dummyUser);

    return request(app).post('/auth/login')
    .send({email: dummyUser.email, password})
    .expect(200);
  });

  it('successfully protects from incorrect password', async () => {
    await Users.register(dummyUser);

    return request(app).post('/auth/login')
    .send({email: dummyUser.email, password: 'Password152'})
    .expect(401);
  })

  it('checks for an email', async () => {
    await Users.register(dummyUser);

    return request(app).post('/auth/login')
    .send({password})
    .expect(400);
  })

  it('checks for a password', async () => {
    await Users.register(dummyUser);
    
    return request(app).post('/auth/login')
    .send({email: dummyUser.email})
    .expect(400);
  })
});

describe("POST /auth/register", () => {
  it('successfully registers a user', () => {
    return request(app).post('/auth/register')
    .send(dummyUserFromClient)
    .expect(201);
  })

  it('makes sure email is not taken', async () => {
    return request(app).post('/auth/register')
    .send(dummyUserFromClient)
    .expect(401);
  })
})
