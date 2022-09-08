const handleSignin = (client, bcrypt) => async (req, res) => {
  const { password, email } = req.body // getting information from front end
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
}
  try {
    const queryText = `SELECT email, hash FROM login WHERE email = '${email}'`
    const data = await client.query(queryText)
    let user = bcrypt.compare(password, data.rows[0].hash, async (err, result) => {
      console.log(result)
      if (result === true && email === data.rows[0].email) {
        const queryText2 = `SELECT * FROM users WHERE email = '${email}'`
        const userChecked = await client.query(queryText2)
        res.json(userChecked.rows[0]) 
      }
    })  
  } catch (err) {
      res.status(400).json('wrong credentials')
  }
}

  
/* 
  try {
      client.query(`SELECT email, hash FROM login WHERE email = '${email}'`)
      // getting specific information from frontend login table from database
      .then(data => {
        // comparing the password introduced on the front end input with the hash we have stored in our database.
        bcrypt.compare(password, data.rows[0].hash, (err, result) => {
          // if the result of this comparison is true,
          // also the email introduced in the front-end input matches with the email stored in the database
          // then return the user from the database user table
          if (result === true && email === data.rows[0].email) { //checking  information
            return client.query(`SELECT * FROM users WHERE email = '${email}'`) //selecting database
              // selecting users table
              // checking the correct user we want to grab
              .then(user => {
                res.json(user.rows[0]); // sending the correct user back to the front-end
              })
          } else {
            res.status(400).json('error loggin in');
          }
        })
      })
  } catch (err) {
    res.status(400).json('wrong credentials')
  }
}
*/



module.exports = {
  handleSignin: handleSignin
}
