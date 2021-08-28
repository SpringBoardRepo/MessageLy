const express = require("express");
const router = new express.Router();
const { SECRET_KEY, DB_URI } = require("../config");
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user")



/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async (req, res, next) => {

    try {
        const users = await User.all();
        return res.json({ users: users });
    } catch (error) {
        throw new ExpressError("Something Went Wrong");
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.get(username);
        return res.json({ user: user });
    } catch (error) {
        return next(error);
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async (req, res, next) => {
    try {
        const { username } = req.params;
        const message = await User.messagesTo(username);
        return res.json({ message });
    } catch (error) {
        return next(error);
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async (req, res, next) => {

    try {
        const { username } = req.params;
        const messages = await User.messagesFrom(username);
        return res.json({ messages });

    } catch (error) {

    }
})

module.exports = router;