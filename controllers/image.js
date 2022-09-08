const Clarifai = require('clarifai');

// creating an clarifai app and entering the API key to recieve the API's data
const app = new Clarifai.App({
  apiKey: 'bc9b5d8b955f455d9311c0c09eacbf59'
}) 

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = async (req, res, client) => {
  const { id } = req.body;
  try{
    const entries = await client.query(`UPDATE users SET entries = entries + '1' WHERE id = '${id}' RETURNING entries`)
    res.status(200).json(entries.rows[0].entries);
  } catch(err) {
    console.log(err)
    res.status(400).json('error updating entries')
  } 
}

module.exports = {
  handleImage,
  handleApiCall
}