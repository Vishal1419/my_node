/**
 * Created by ravimodha on 20/08/16.
 */

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(appRoot,"app_config.js")).ENV_CONFIG.db;
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.Restaurants.hasOne(db.RestaurantImages,
    {
        as: "restaurant_images",
        foreignKey: "restaurant_id"
    }
);

db.RestaurantImages.belongsTo(db.Restaurants,
    {
        as: "restaurant",
        foreignKey: "restaurant_id"
    }
);

db.Restaurants.hasMany(db.CustomerCheckIn,
    {
        as: "check_ins",
        foreignKeys: "restaurant_id"
    }
);

db.CustomerCheckIn.belongsTo(db.Restaurants,
    {
        as: "restaurant",
        foreignKey: "restaurant_id"
    }
);

db.Restaurants.hasMany(db.UserPlaces,
    {
        as: "my_places",
        foreignKey: "restaurant_id"
    }
);

db.UserPlaces.belongsTo(db.Restaurants,
    {
        as:"restaurant",
        foreignKey: "restaurant_id"
    }
);

db.Customers.hasMany(db.CustomerCheckIn,
    {
        as: "check_ins",
        foreignKey: "customer_id"
    }
);

db.CustomerCheckIn.belongsTo(db.Customers,
    {
        as: "customer",
        foreignKey: "customer_id"
    }
);

db.Customers.hasMany(db.MyPlaces,
    {
        as: "my_places",
        foreignKey: "customer_id"
    }
);

db.MyPlaces.belongsTo(db.Customers,
    {
        as: "customer",
        foreignKey: "customer_id"
    }
);

db.FoodCategory.hasMany(db.FoodTags,
    {
        as:"food_tags",
        foreignKey:"food_category"
    }
);

db.FoodTags.belongsTo(db.FoodCategory,
    {
        as:"food_cat",
        foreignKey:"food_category"
    }
);

db.WinesDescription.hasOne(db.Wines,
    {
        as:"wine",
        foreignKey:"wine_description_id"
    }
);

db.Wines.belongsTo(db.WinesDescription,
    {
        as:"wine_description",
        foreignKey:"wine_description_id"
    }
);

db.WineColors.hasMany(db.WinesDescription,
    {
        as:"wine_description",
        foreignKey:"color_id"
    }
);

db.WinesDescription.belongsTo(db.WineColors,
    {
        as:"wine_color",
        foreignKey:"color_id"
    }
);

db.Wines.hasMany(db.Menu,
    {
        as:"menu",
        foreignKey:"wine_id"
    }
);

db.Menu.belongsTo(db.Wines,
    {
        as:"wine",
        foreignKey:"wine_id"
    }
);

db.Restaurants.hasMany(db.Menu,
    {
        as:"menu",
        foreignKey:"restaurant_id"
    }
);

db.Menu.belongsTo(db.Restaurants,
    {
        as:"restaurant",
        foreignKey:"restaurant_id"
    }
);

db.WinesDescription.hasMany(db.Menu,
    {
        as:"menu",
        foreignKey:"wine_description_id"
    }
);

db.Menu.belongsTo(db.WinesDescription,
    {
        as:"wine_description",
        foreignKey:"wine_description_id"
    }
);

db.Questions.hasMany(db.Answers,
    {
        as:"answers",
        foreignKey:"q_id"
    }
);

db.Answers.belongsTo(db.Questions,
    {
        as:"questions",
        foreignKey:"q_id"
    }
);

db.Questions.hasMany(db.CustomerAnswers,
    {
        as:"customer_answers",
        foreignKey:"question_id"
    }
);

db.CustomerAnswers.belongsTo(db.Questions,
    {
        as:"question",
        foreignKey:"question_id"
    }
);

db.Answers.hasMany(db.CustomerAnswers,
    {
        as:"customer_answers",
        foreignKey:"answer_id"
    }
);

db.CustomerAnswers.belongsTo(db.Answers,
    {
        as:"answers",
        foreignKey:"answer_id"
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;