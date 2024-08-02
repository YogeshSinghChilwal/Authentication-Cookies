import express from "express";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";


const app = express();
const port = 3000;









app.listen(port, () => {
    console.log("Server is running on port ", port);
})