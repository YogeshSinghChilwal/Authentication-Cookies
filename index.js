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

app.use(session({
    secret: "Top-secret-data",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(passport.initialize());
app.use(passport.session());

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

// Route to check if username exists in Real time
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

// Rooute for home page directly
app.get('/home', (req, res) => {
    if(req.isAuthenticated()){
        res.render('home.ejs');
    } else{
        res.render('sign-in.ejs');
    }
})

app.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
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
                    const resut = await db.query("INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *", [userName, email, hash])
                    const user = resut.rows[0];

                    req.login(user, (err) => {
                        if(err) console.log(err);
                        res.redirect("/home");
                    })
                }
            })
            // res.render("home.ejs");
        }


    }catch(err)
    {
        console.log("Error while checking email does exist: ", err);
    }
})

app.post('/signin', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/signin"
}))


passport.use(new Strategy( async function verify(username, password, cb){
    
    try{
        const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [username]);

        if(checkEmail.rows.length > 0){
            const storedPassword = checkEmail.rows[0].password;
            const user = checkEmail.rows[0];

            bcrypt.compare(password, storedPassword, (err, result) => {
                if(err){
                    return cb(err);
                } else{
                    if(result){
                        return cb(null, user);
                    }else{
                        return cb(null, false);
                    }
                }
            })
        }else{
            return cb("user not found");
        }

    }catch(err){
        return cb(err);
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})



app.listen(port, () => {
    console.log("Server is running on port ", port);
})