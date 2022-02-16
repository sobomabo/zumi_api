const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user_model.js")(mongoose);
db.products = require("./product_model.js")(mongoose);
db.orders = require("./order_model.js")(mongoose);
db.sessions = require("./session_model.js")(mongoose);

module.exports = db;
