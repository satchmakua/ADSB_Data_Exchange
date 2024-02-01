const axios = require('axios')

const uri = 'http://localhost:3000/oauth'
describe('Testing oauth API calls...', () => 
{
   /* setup function: set up a db */
   /* break down function: destroy db */

   test('Test 1: Registering user...', async () =>
   {
      const result = await axios.post((uri + '/register'),
         {
            "username": "JohnSmith123",
            "email": "john.smith@aol.com",
            "password": "bad_password123",
         })

      expect(result).toBeDefined()
   })

   test('Test 2: Logging out user...', async () =>
   {
      const result = await axios.post((uri + '/logout'),
         {
            "username": "JohnSmith123",
         })

      expect(result.data['code']).toBe(200)
   })

   test('Test 3: Logging user in with email...', async () => 
   {
      const result = await axios.post((uri + '/login'),
         {
            "email": "john.smith@aol.com",
            "password": "bad_password123",
         })
      const result2 = await axios.post((uri + '/logout'),
         {
            "username": result.data.username,
         })

      expect(result2.data['code']).toBe(200)
   })
})