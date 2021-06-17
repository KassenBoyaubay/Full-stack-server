// Sequelize 
module.exports = (sequelize, DataTypes) => {

    // Create table Comments
    const Comments = sequelize.define("Comments", {
        commentBody: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Comments
}