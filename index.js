import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";


const app = express();
const port = 3000;


app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("auth.ejs");
})

app.get('/signup', (req, res) => {
    res.render("sign-up.ejs");
})

app.get('/signin', (req, res) => {
    res.render("sign-in.ejs");
})




//Add initial HTML structure for sign-up and sign-in pages



app.listen(port, () => {
    console.log("Server is running on port ", port);
})