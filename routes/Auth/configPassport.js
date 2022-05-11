const GoogleStrategy = require('passport-google-oauth20').Strategy;
const collectionModel = require("./collectionModel.js");
const jwt = require("jsonwebtoken");
module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                let token;
                try {
                    let resData = await collectionModel.findOne({
                        email: profile.emails[0].value
                    });
                    if (resData === null) {
                        resData = await collectionModel.create({
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            profileImage: profile.photos[0].value,
                            isPrivate: false,
                            publicFiles: [],
                            privateFIles: []
                        })
                    }
                    token = jwt.sign({ // Creating JWT Token 
                        id: resData._id
                    }, process.env.PRIVATE_KEY)
                } catch (error) {
                    console.log(error);
                }
                return done(null, token); // Here We Are Passing JWT Token To Passport Serialize User Method Or Middleware Which Will Store Data In Session We Can Also Pass Profile Data Of Use, Visit "https://medium.com/@prashantramnyc/how-to-implement-google-authentication-in-node-js-using-passport-js-9873f244b55e" For More Info.
            }
        )
    )
}