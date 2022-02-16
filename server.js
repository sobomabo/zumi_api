require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require("cors");

// create express application
const app = express();

// allow only request from frontend client at http://localhost:3000
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse request to set cookie propery in req.cookie
app.use(cookieParser());

// db connection
const db = require("./app/models");
db.mongoose.connect(db.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to the database!");
}).catch(err => {
	console.log("Cannot connect to the database!", err);
	process.exit();
});

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie("user_sid");
	}
	next();
});

// simple route
app.get("/", (req, res) => {
	res.json({ message: "API is healthy" });
});
// routes file
require("./app/routes/index")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
