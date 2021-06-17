const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {     // next is like then, continue, it's valid
    const accessToken = req.header("accessToken")

    if (!accessToken) return res.json({ error: "User Not Logged In" })

    try {
        const validToken = verify(accessToken, "secretToProtectToken")

        req.user = validToken       // req.user can be accessed everywhere where validateToken is used

        if (validToken) {
            return next()
        }
    } catch (err) {
        res.json({ error: err })
    }
}

module.exports = { validateToken }