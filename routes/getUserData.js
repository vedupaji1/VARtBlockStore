const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const collectionModel = require("./Auth/collectionModel")
router.get("/", async (req, res) => {
    let sesData = req.cookies.ses;
    try {
        let userId = jwt.verify(sesData.token, process.env.PRIVATE_KEY);
        console.log(userId); // We Will Be Getting Payload Or Data Which We Has Provide At Time Of Token Creation
        let userData = await collectionModel.findById(userId.id)
        res.json({
            data: userData,
            isDone: true
        });
    } catch (error) {
        res.json({
            isDone: false
        });
    }
})
module.exports = router;