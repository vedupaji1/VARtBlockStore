const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const collectionModel = require("../Auth/collectionModel")


const validateInfo = (req, res, next) => {
    if (req.body.fileData === undefined || req.body.fileData.length < 1) {
        req.isValid = false;
        next();
    } else {
        req.isValid = true;
        next();
    }
}

const validateData = (storedData, fileData) => {
    return new Promise((res, rej) => {
        for (let i = 0; i < fileData.length; i++) {
            let tempFileData = fileData[i];
            if (tempFileData.filePath !== undefined && tempFileData.link !== undefined && tempFileData.time !== undefined && (tempFileData.isPrivate === true || tempFileData.isPrivate === false)) {
                let iterLength = storedData.publicFiles.length > storedData.privateFiles.length ? storedData.publicFiles.length : storedData.privateFiles.length
                for (let j = 0; j < iterLength; j++) {
                    if (j < storedData.publicFiles.length) {
                        if (storedData.publicFiles[j].link === tempFileData.link) {
                            res({
                                isValid: false,
                                message: "File Already Exists"
                            });
                        }
                    }
                    if (j < storedData.privateFiles.length) {
                        if (storedData.privateFiles[j].link === tempFileData.link) {
                            res({
                                isValid: false,
                                message: "File Already Exists"
                            });
                        }
                    }
                }
            } else {
                res({
                    isValid: false,
                    message: "Something Went Wrong"
                });
            }
        }
        res({
            isValid: true,
            message: "Done"
        });
    })
}

router.post("/", (validateInfo), async (req, res) => {
    if (req.isValid == true) {
        let sesData = req.cookies.ses;
        try {
            // let userId = {
            //     id: "627747e57729e5ce9bf9f7d5"
            // }
            let userId = jwt.verify(sesData.token, process.env.PRIVATE_KEY);
            let userData = await collectionModel.findById(userId.id);
            let isValidData = await validateData(userData, req.body.fileData);
            if (isValidData.isValid === true) {
                if (req.body.fileData[0].isPrivate === true) {
                    let storedFiles = userData.privateFiles;
                    for (let i = 0; i < req.body.fileData.length; i++) {
                        storedFiles.push({
                            filePath: req.body.fileData[i].filePath,
                            link: req.body.fileData[i].link,
                            time: req.body.fileData[i].time
                        });
                    }
                    await collectionModel.findByIdAndUpdate(userId.id, {
                        privateFiles: storedFiles
                    });
                    res.json({
                        isDone: true
                    });
                } else {
                    let storedFiles = userData.publicFiles;
                    for (let i = 0; i < req.body.fileData.length; i++) {
                        storedFiles.push({
                            filePath: req.body.fileData[i].filePath,
                            link: req.body.fileData[i].link,
                            time: req.body.fileData[i].time
                        });
                    }
                    await collectionModel.findByIdAndUpdate(userId.id, {
                        publicFiles: storedFiles
                    });
                    res.json({
                        isDone: true
                    });
                }
            } else {
                res.json({
                    message: isValidData.message,
                    isDone: false
                });
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