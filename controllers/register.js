const handleRegister = (req, res, client, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    //we are hashing the password with async bcrypt(), then storing the pass into the database
    //bcrypt() has as parameters: the plainPassword, the salt, and a function with err and hash as a parameters
    bcrypt.hash(password, 10, async function (err, hash) {
        // I want to store(insert) a new element(object(user)) into the database(client), which is a function that returns an array[tables] with a list of elements(objects(users)) inside of it.
        // into the database we have two tables. users and login. just to keep thing organized, it is how relational databases work.
        // in order to do this we use a transaction query builder.
        try {
            await client.query('BEGIN')
            const insertIntoLogin = `INSERT INTO login (hash, email) VALUES ('${hash}', '${email}') RETURNING email`
            const emailLogin = await client.query(insertIntoLogin)
            const queryText2 = `INSERT INTO users (email, name, joined) VALUES ('${emailLogin.rows[0].email}', '${name}', NOW()) RETURNING * `
            const user = await client.query(queryText2)
            res.json(user.rows[0])
            await client.query('COMMIT')
        } catch(err) {
            client.query('ROLLBACK')
            console.log(err)
            res.status(400).json('unable to register')
        }
    })
}

//there are two way to do it. this second one also works, but the first one the code is much more clean.

      /*
      client.query('BEGIN')
        const insertIntoLogin = `INSERT INTO login (hash, email) VALUES ('${hash}', '${email}') RETURNING email`
        client.query(insertIntoLogin)
        .then (emailLogin => {
            console.log(emailLogin.rows[0])
            const queryText2 = `INSERT INTO users (email, name, joined) VALUES ('${emailLogin.rows[0].email}', '${name}', NOW()) RETURNING * `
            client.query(queryText2)
            .then(user => {
                console.log(user.rows[0])
                res.json(user.rows[0])
             })
        })
        client.query('COMMIT')
        .catch (err => {
            client.query('ROLLBACK')
            res.status(400).json('unable to register')
        })
        
    })  
}
*/

module.exports = {
    handleRegister: handleRegister
};


