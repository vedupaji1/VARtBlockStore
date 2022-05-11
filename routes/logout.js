const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        req.logout();
        req.session.destroy(); // Clearing Data That Is Stored In Session, Basically It Is Stored By Google During Authentication Process To Remember User.

        // Clearing Cookie, Visit "https://www.geeksforgeeks.org/express-js-res-clearcookie-function/" For More Info.
        // You Can Also Clear Cookie In Another Method, Visit "https://stackoverflow.com/questions/27978868/destroy-cookie-nodejs" For Knowing Them.
        res.clearCookie('ses');
        res.json({
            isDone: true
        });
    } catch (error) {
        res.json({
            isDone: false
        });
    }
})
module.exports = router;