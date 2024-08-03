import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";


const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

// Database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Auth_user's_data",
    password: "yogesh777",
    port: 5432
});

db.connect();




// Get Routes
app.get('/', (req, res) => {
    res.render("auth.ejs");
})

app.get('/signup', (req, res) => {
    res.render("sign-up.ejs");
})

app.get('/signin', (req, res) => {
    res.render("sign-in.ejs");
})


// Route to check if username exists
app.get('/check-username', async (req, res) => {
    const username = req.query.username;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0 || username.length < 5) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Post routes
app.post('/signup', async(req, res) => {
    const userName = req.body.username;
    const email = req.body.userEmail;
    const password = req.body.password;

    try{
        const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if(checkEmail.rows.length > 0){
            res.send("Email is already exist!");
        } else{
            bcrypt.hash(password, saltRounds, async(err, hash) => {
                if(err){
                    console.log("Error while generating a hash password: ",err);
                } else{
                    await db.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3)", [userName, email, hash])
                }
            })
            res.render("home.ejs");
        }


    }catch(err)
    {
        console.log("Error while checking email does exist: ", err);
    }
})

app.post('/signin', async(req, res) => {
    const userEmail = req.body.userEmail;
    const userPassword = req.body.password;

    try{
        const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [userEmail]);

        if(checkEmail.rows.length > 0){
            const storedPassword = checkEmail.rows[0].password;

            bcrypt.compare(userPassword, storedPassword, (err, result) => {
                if(err){
                    console.log("Error while comparing password: ",err);
                } else{
                    if(result){
                        res.render("home.ejs");
                    }else{
                        res.send("Incorect password");
                    }
                }
            })
        }else{
            res.send("Email does not exist!");
        }

    }catch(err){
        console.log("Error while sign in Email: ", err);
    }
})






app.listen(port, () => {
    console.log("Server is running on port ", port);
})