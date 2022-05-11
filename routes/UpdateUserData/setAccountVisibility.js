const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const collectionModel = require("../Auth/collectionModel")
router.post("/", async (req, res) => {
    let sesData = req.cookies.ses;
    try {
        let userId = jwt.verify(sesData.token, process.env.PRIVATE_KEY);
        // We Will Be Getting Payload Or Data Which We Has Provide At Time Of Token Creation
        if (req.body.isPrivate === true || req.body.isPrivate === false) {
            await collectionModel.findByIdAndUpdate(userId.id, {
                isPrivate: req.body.isPrivate
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
    } catch (error) {
        console.log(error)
        res.json({
            message: "Something Went Wrong",
            isDone: false
        });
    }
})
module.exports = router;