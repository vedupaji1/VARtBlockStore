const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const collectionModel = require("../Auth/collectionModel")


const validateInfo = (req, res, next) => {
    if ((req.body.isPrivate !== true && req.body.isPrivate !== false) || req.body.index === undefined || req.body.index < 0) {
        req.isValid = false;
        next();
    } else {
        req.isValid = true;
        next();
    }
}

router.post("/", (validateInfo), async (req, res) => {
    if (req.isValid == true) {
        let sesData = req.cookies.ses;
        try {
            // let userId = {
            //     id: "627747e57729e5ce9bf9f7d5"
            // }
            let userId = jwt.verify(sesData.token, process.env.PRIVATE_KEY);
            let userData = await collectionModel.findById(userId.id)
            if (req.body.isPrivate === true) {
                let storedFiles = userData.privateFiles;
                if (req.body.index < storedFiles.length) {
                    storedFiles.splice(req.body.index, 1);
                    await collectionModel.findByIdAndUpdate(userId.id, {
                        privateFiles: storedFiles
                    });
                    res.json({
                        isDone: true
                    });
                } else {
                    res.json({
                        message: "Something Went Wrong",
                        isDone: false
                    });
                }
            } else {
                let storedFiles = userData.publicFiles;
                if (req.body.index < storedFiles.length) {
                    storedFiles.splice(req.body.index, 1);
                    await collectionModel.findByIdAndUpdate(userId.id, {
                        publicFiles: storedFiles
                    });
                    res.json({
                        isDone: true
                    });
                } else {
                    res.json({
                        message: "Something Went Wrong",
                        isDone: false
                    });
                }
            }
        } catch (error) {
            console.log(error)
            res.json({
                message: "Something Went Wrong",
                isDone: false
            });
        }
    } else {
        res.json({
            message: "Something Went Wrong",
            isDone: false
        });
    }
})
module.exports = router;