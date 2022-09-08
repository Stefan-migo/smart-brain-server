const handleProfileGet = async (req, res, client) => {
  const { id } = req.params;
  try {
    const getUser = await client.query(`SELECT * FROM users WHERE id = '${id}'`)
    if (getUser.rows.length) {
      res.json(getUser.rows[0])
    } else {
      res.status(400).json('User not found')
    }
  } catch (err) {
    console.log(err)
    res.status(404).json('error getting user')
  }
} 
 


module.exports = {
  handleProfileGet
}