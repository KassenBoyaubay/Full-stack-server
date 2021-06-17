const express = require('express')
const router = express.Router()
const { Comments } = require('../models')  // Sequelize 
const { validateToken } = require("../middlewares/AuthMiddleware")      // to validate token

router.get("/:postId", async (req, res) => {
    // req.params.postId is same as :postId in url
    const postId = req.params.postId

    // find by postId 
    // return every row where PostId in table is postId
    const comments = await Comments.findAll({ where: { PostId: postId } })
    res.json(comments)
})

router.post("/", validateToken, async (req, res) => {
    const comment = req.body
    const username = req.user.username    // from validateToken
    comment.username = username
    await Comments.create(comment)
    res.json(comment)
})

router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId

    // delete from MySQL w/ Sequelize Comments model
    await Comments.destroy({
        where: {
            id: commentId
        }
    })

    res.json('Deleted comment')
})

module.exports = router