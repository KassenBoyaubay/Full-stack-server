const express = require('express')
const router = express.Router()
const { Users } = require('../models')  // Sequelize 
const bcrypt = require('bcryptjs')        // Change password for security
const { sign } = require('jsonwebtoken')  // Store in session storage login/password
const { validateToken } = require('../middlewares/AuthMiddleware')

// REGISTRATION
router.post("/", async (req, res) => {
    const { username, password } = req.body

    bcrypt.hash(password, 10).then(async (hash) => {               // 10 is just some value, doesn't matter
        await Users.create({
            username: username,
            password: hash
        })

        const user = await Users.findOne({ where: { username: username } })

        const accessToken = sign({ username: user.username, id: user.id }, "secretToProtectToken")

        res.json({ token: accessToken, username: user.username, id: user.id })
    })
})

// LOGIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body

    const user = await Users.findOne({ where: { username: username } })

    if (!user) res.json({ error: "User Doesn't Exist" })

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) res.json({ error: "Wrong Username And Password Combination" })

        const accessToken = sign({ username: user.username, id: user.id }, "secretToProtectToken")

        res.json({ token: accessToken, username: user.username, id: user.id })
    })
})

router.get("/validate", validateToken, (req, res) => {
    res.json(req.user)
})

router.get('/basicinfo/:id', async (req, res) => {
    const id = req.params.id

    const basicInfo = await Users.findByPk(id, { attributes: { exclude: ['password'] } })

    res.json(basicInfo)
})

router.put('/changepassword', validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await Users.findOne({ where: { username: req.user.username } })

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({ error: "Wrong Password Entered!" })

        bcrypt.hash(newPassword, 10).then(async (hash) => {               // 10 is just some value, doesn't matter
            Users.update({ password: hash }, { where: { username: req.user.username } })
            res.json('Password Changed')
        })
    })
})

module.exports = router