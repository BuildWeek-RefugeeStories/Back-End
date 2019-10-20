const db = require('../data/dbConfig');
const Users = require('./users');

const bcrypt = require('bcryptjs');

// Dummy password
const password = 'Password123';

// Expected user object
const dummyUser = {
  email: 'mtourjoman0@gmail.com',
  first_name: 'Mohammad',
  last_name: 'Tourjoman',
  country: 'Syria',
  password: bcrypt.hashSync(password, 15)
}

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('insert function', () => {
    it('inserts users into the db', async () => {

      let usersNumber = await db('users');
      expect(usersNumber).toHaveLength(0);

      await Users.register(dummyUser);

      usersNumber = await db('users');

      expect(usersNumber).toHaveLength(1);
    })
  })

  describe('find by email function', () => {
    it('retrieves a user by email', async () => {
      let email = dummyUser.email;

      await Users.register(dummyUser);

      const user = await Users.findByEmail(email);

      expect(user.email).toEqual(email);
    })
  })

  describe('find by id function', () => {
    it('retrieves a user by id', async () => {
      await Users.register(dummyUser);

      const user = await Users.findById(1);

      expect(user.email).toEqual(dummyUser.email);
    })
  })
});