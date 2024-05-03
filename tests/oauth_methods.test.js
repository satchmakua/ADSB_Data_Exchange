/* TESTS DO NOT WORK because they are testing an old version of oauth */
const client = require('./database/db.js')
const { beforeEach, afterEach } = require('node:test')

const {
   genAuthTokens,
   genOAuthCode, /* not used yet */
   genAccessToken,
   findUserByToken,
   findUserByCredentials,
   removeToken,
   createUser,
} = require('./methods/oauth_methods')




/* might want to create a new db -> beforeAll() & afterAll */

describe('Test: auth token generation...', () => 
{
   /* setup function: insert a user */
   beforeEach(async () =>
   {
      await client.query("INSERT INTO users (username, email, password) VALUES ('fakeUser1', 'faker1@gmail.com', 'ZS35p8mNqRp');")
      await client.query('COMMIT')
   })

   /* break down function: delete user */
   afterEach(async () =>
   {
      await client.query("DELETE FROM users WHERE username='fakeUser1';")
   })


   test('Testing real user data...', async () =>
   {
      const user = await client.query("SELECT username, id FROM users WHERE username='fakeUser1';")
      const result = await genAuthTokens(user, client)
      await expect(result).toBeDefined()
   })

   test('Testing undefined user data...', async () =>
   {
      const user = undefined
      const result = await genAuthTokens(user, client)

      await expect(result).toBeUndefined()
   })

   test('Testing bad user data...', async () =>
   {
      const user =
      {
         "username": "bad_username34",
         "id": 7,
      }
      const result = await genAuthTokens(user, client)

      await expect(result).toBeUndefined()
   })

   // test if incorrect username
})


describe('Test: Find users by credentials...', () => 
{
   /* setup function: insert a user */
   beforeEach(async () =>
   {
      await client.query("INSERT INTO users (username, email, password) VALUES ('fakeUser2', 'faker2@gmail.com', 'ZS35pedcs4f');")
      await client.query('COMMIT')
   })

   /* break down function: delete user */
   afterEach(async () =>
   {
      await client.query("DELETE FROM users WHERE username='fakeUser2';")
   })

   test('Testing NOTHING ...', async () =>
   {
      await expect(true).toBeTruthy()
   })
})


// describe('Test: NOTHING', () => 
// {
//    /* setup function: insert a user */
//    beforeEach(async () =>
//    {
//       await client.query("INSERT INTO users (username, email, password) VALUES ('fakeUser3', 'faker3@gmail.com', 'ZS35pedcs4f');")
//       await client.query('COMMIT')
//    })

//    /* break down function: delete user */
//    afterEach(async () =>
//    {
//       await client.query("DELETE FROM users WHERE username='fakeUser3';")
//    })

//    test('Testing NOTHING ...', async () =>
//    {
//       await expect(true).toBeTruthy()
//    })
// })


