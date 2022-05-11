const express = require("express");
const app = express();
const http = require("http").createServer(app);
const fs = require("fs");
const mongoose = require("mongoose");
const io = require("socket.io")(http);
const passport = require("passport");
const path = require("path");
require('dotenv').config() // Importing ENV Data From ENV File, Visit "https://www.npmjs.com/package/dotenv" For More Info.

// Basically This Is One Type Of Global Middleware Who Will Execute Before Every Route, Middleware Is A Function Which Is Used For Executing Code Before Any Route.
// Visit "https://devdocs.io/express/guide/using-middleware" or "https://www.youtube.com/watch?v=lY6icfhap2o" For Knowing More About Middleware
// It Will Parse Data Into JSON.
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// For Creating Cookie, Visit "https://www.section.io/engineering-education/what-are-cookies-nodejs/" For More Info
const cookieParser = require('cookie-parser'); // Actually It Is Used For Parsing Cookie Data
app.use(cookieParser());

// For Session Management, Visit "https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/" For More Info
const sessions = require('express-session')
const thirtyMin = 1000 * 60 * 30;
app.use(sessions({
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true,
    cookie: {
        maxAge: thirtyMin
    },
    resave: false
}));

const port = process.env.PORT || 8000;

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

require("./routes/Auth/configPassport.js")(passport) // Importing Google Auth Middleware Which Is Declared In Specified File, For More Info About Google Auth Visit "https://dev.to/atultyagi612/google-authentication-in-nodejs-1f1d".

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Visit "https://mongoosejs.com/docs/index.html" For Understanding Of Mongoose.
const databaseURL = process.env.DATABASE_URL;
mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("Done");
}).catch((err) => {
    console.log(err)
    console.log("Sorry");
})

app.use("/auth", require("./routes/Auth/googleAuth.js")); // This Route Path Is Related To Google Authentication Or It Is Used To Authenticate User.
app.use("/logout", require("./routes/logout.js")); // It Is Used For Logout, Actually This Will Just Clear Cookie. 
app.use("/getUserData", require("./routes/getUserData.js")); // It Will Tell That Whether User Already Login Or Not By Checking Cookies And Return Their Data. 
app.use("/getSearchedUserData", require("./routes/getSearchedUserData.js")); // It Will Return Specified User Data.
app.use("/setAccountVisibility", require("./routes/UpdateUserData/setAccountVisibility.js")); // It Is Used To Set Visibility Of Account.
app.use("/setFileVisibility", require("./routes/UpdateUserData/setFileVisibility.js")); // It Is Used To Set Visibility Of File.
app.use("/storeFileData", require("./routes/UpdateUserData/storeFileData.js")); // It Is Used To Store File Data
app.use("/deleteFileData", require("./routes/UpdateUserData/deleteFileData.js")); // It Is Used To Delete File Data



// app.get("/", (req, res) => {
//     let sesData = req.cookies.ses;
//     if (sesData !== undefined) {
//         res.send(`<h1> You Are Logged</h1>
//                   <a href="/logout">Logout</a>`)
//     } else {
//         res.send(`<h1> You Are Not Authenticated</h1>
//         <a href="/auth/google">Auth</a>`)
//     }
// })

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

http.listen(port, () => {
    console.log("Ok")
})

io.on('connection', (socket) => {
    console.log("Connected Done Using Sockets");
})