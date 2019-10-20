const db = require('./dbConfig');

// Checking for whether data is valid or whether
// email is already taken is done on the higher level.
const register = async user => {
  // Expecting first_name, last_name, email and country values

  // Insert user data into table
  await db('users').insert(user);

  // Retrieve the user object again after it's been inserted
  const res = await db('users').where('email', user.email);

  // Return the generated id of the newly registered user
  return parseUser(res[0]);
}

// Returns array of users with specified email
const findByEmail = async email => {
  const matches = await db('users').where('email', email);
  return parseUser(matches[0]);
}

// Returns one user with specified id
const findById = async id => {
  const matches = await db('users').where('id', id);
  return parseUser(matches[0]);
}

const parseUser = user => {
  if(!user) {
    user = {}
  }
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    country: user.country,
    password: user.password
  }
}

module.exports = {
  register,
  findByEmail,
  findById
}