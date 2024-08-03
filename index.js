import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";


const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));

// Database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Auth_user's_data",
    password: "yogesh777",
    port: 5432
});

db.connect();




// Routes
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
        if (result.rows.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});







app.listen(port, () => {
    console.log("Server is running on port ", port);
})