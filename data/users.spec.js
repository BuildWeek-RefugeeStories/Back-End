const db = require('../data/dbConfig');
const Users = require('./users');

const bcrypt = require('bcryptjs');

describe('users model', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('insert function', () => {
    it('inserts users into the db', async () => {
      let usersNumber = await db('users');
      expect(usersNumber).toHaveLength(0);

      const password = 'Password123';

      // Expected user object
      const user = {
        email: 'mtourjoman0@gmail.com',
        first_name: 'Mohammad',
        last_name: 'Tourjoman',
        country: 'Syria',
        password: bcrypt.hashSync(password, 15)
      }

      await Users.register(user);

      usersNumber = await db('users');

      expect(usersNumber).toHaveLength(1);
    })
  })
});