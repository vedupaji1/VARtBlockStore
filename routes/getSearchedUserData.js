const express = require("express");
const router = express.Router();
const collectionModel = require("./Auth/collectionModel")


const validateInfo = (req, res, next) => {
    if (req.body.email === undefined) {
        req.isValid = false;
        next();
    } else {
        var mailFormat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
        if (req.body.email.match(mailFormat)) {
            req.isValid = true;
            next();
        } else {
            req.isValid = true;
            next();
        }
    }
}

router.post("/", (validateInfo), async (req, res) => {
    try {
        let userData = await collectionModel.findOne({
            email: req.body.email
        })
        if (userData !== null) {
            let resData;
            if (userData.isPrivate === true) {
                resData = {
                    username: userData.username,
                    email: userData.email,
                    profileImage: userData.profileImage,
                    isPrivate: true
                }
            } else {
                resData = {
                    username: userData.username,
                    email: userData.email,
                    profileImage: userData.profileImage,
                    isPrivate: false,
                    publicFiles: userData.publicFiles
                }
            }
            res.json({
                data: resData,
                isDone: true
            });
        } else {
            res.json({
                message: "User Not Exist's",
                isDone: false
            });
        }

    } catch (error) {
        res.json({
            message: "Something Went Wrong",
            isDone: false
        });
    }
})
module.exports = router;