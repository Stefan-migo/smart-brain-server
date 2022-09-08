// what are we actually doing?

/* 
    / We are the back-end!
    / We are creating a server, something that the front-end can comunicate with
        so this app can live more than just our laptop.
    / we are creating urls points and endpoints, and providing a response 
        to the front-end. (Endpoint `equivalent` page on html) 

    / --> '/', we need a root route for an "index.html" endpoint 
        * it'll respond with 'everything is working'
    / --> '/signin' route, this will be a POST request (people have to sign in, send information with an intention)
        * it will respond with 'success/fail'
    / --> /register' route, it will be a POST request (we need to add data to the database)
        * it'll respond with the newly created 'user'
    / --> '/homescreen' route, it will be a GET request (to have the ability tp accees the profile of the user)
    / --> '/profile/userid' route, it'll be  a GET request (the opcional parameter userid allows each user has their own profile homescreen)
        *
    / --> '/image', route, it will be a PUT request (the user already exists, there is an update on the user profile)
        * it will respond with the updated user.entries (object) 'user'.
    
    
    / a server does not have memory by itself. so every time you restart it, it will delete every change it has been made.
    / if we create a back-end for an specific app, we enable the ability to interact between each other.
        We can also include a database, which gives us memorie, so we can have actuall users that our back end will remember
    
     

    / Postman is a tool that allows you to test your server, once everything is working properly
        you can plug it into the font-end. "hey front-end!, this are the endponits that i'm(the server) expecting"

*/ 


// calling express package
const express = require('express');
// calling cors package
const cors = require('cors');
// calling bcrypt package
// bcrypt is a tool that helps to encrypt the passwords we recieve when a new user is signed up.
const bcrypt = require('bcrypt');
// calling client function

const client = require('./elephantsql');

const PORT = process.env.PORT || 3000;



const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


// creating a variable that contains knex'package in order to connect to the database
// here we have all the information about the database


// creating our app by running express
const app = express();

// middleware to be able to access to req.methods.
app.use(express.json());
// middleware that helps to access securely from the web browser to the server
app.use(cors());

// '/', root route or endpoint
/*
    / we just want to make sure that everything is working well

    / so we don't request anything out of the get request
         and we will just respond(res) 'everything is working'
*/
app.get('/', async (req, res) => {
    try {
        const results = await client.query('SELECT * FROM users');
        res.json(results.rows[0]);
    } catch (err) {
        console.log(err);
    }
    })

// '/signin' route or endpoint
/*  
    / we want to check whatever the user enters on the front-end (email and password inputs)
        matches with the information we have stored on our database  

    / so we will ask for some information(req) 
        we will check (if) it's true, 
        and then we will send a response(res) or (err) 'success or fail'

    / remember the (req) is an object that is sent by the fetch().
*/
app.post('/signin', signin.handleSignin(client, bcrypt));

//  '/register' route or endpoint
/*
    / we want to take the information that was introduced on the inputs from the
        register form, and save it on our database as a new user
    / so we will ask(req) for some information(body: name, email and password). 
        we will first hash it(bcrypt) and then we will save it (push) on our database, 
        and then we will send a response(res) or (err) 'user' or 'fail'
    / remember: the lenght of the array - 1 is the last element inside of an array
*/
app.post('/register', (req, res) => { register.handleRegister(req, res, client, bcrypt) })

// '/profile/id' route or endpoint 

/*
    / we want to send back a specific profile when this GET request is made
    
    / so we will ask(req) for some information(params: id),
      we will respond(res) with the object(user) from the database, 
      which matches the id we got from the request
      
    / remember set ':id' to the profile endpoint, will allow us to enter in our browser anything
        and we will be able to grab this 'id' through the 'req.params' property

    / sometimes backend engineers create endpoints that might not be used by the front-end
        instead they will be needed in future installations.
*/
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, client)})

// '/image' route or endpoint

/*
    / we want to update the users' entries count, every time
        they submit an image we want to increase their 'entries'
    
    / so we will ask for some information(req.body), the id of the user who is submiting an image
      we will look for(forEach) the user in the database, once it is found, we will add 1 to de entries' count 
      then we will respond(res) with the entries the user has.
      
    / 
*/
app.put('/image', (req, res) => { image.handleImage(req, res, client)})

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

// port which the server is listening
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})