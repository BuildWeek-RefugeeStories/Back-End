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
  return res[0].id;
}

// Returns array of users with specified email
const findByEmail = async email => {
  return await db('users').where('email', email);
}

module.exports = {
  register,
  findByEmail
}