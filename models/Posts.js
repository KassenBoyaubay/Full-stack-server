// Sequelize 
module.exports = (sequelize, DataTypes) => {

    // Create table Posts
    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    // Association w/ Comments. 1 post may have multiple comments
    // select comments table and click on drop table, then it will be created again but w/ PostId
    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade",                // on Delete post -> delete associated comments
        })

        Posts.hasMany(models.Likes, {
            onDelete: "cascade",
        })
    }

    return Posts
}