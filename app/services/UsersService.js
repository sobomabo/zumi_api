const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MongooseService = require("./MongooseService");
const Base = require('./BaseService');
const db = require("../models");
const UserModel = db.users;
const saltRounds = 10;
const _ = require('lodash');

class UsersService extends Base {
	/**
	 * @description Create an instance of UsersService
	 */
	constructor() {
		super();

		// Instantiate mongoose service for user model
		this.userMongooseServiceInstance = new MongooseService(UserModel);
	}

	// Authenticate user login
	authenticate = async (postData) => {

		if (!postData) {
			return this.sendFailedResponse({ username: "Bad request, Login credentials not found" });
		}

		// DB authentication of user credentials
		const userFind = await this.find({ username: postData.username, status: 'Active' });
		if (userFind.success) {
			const userData = userFind.data;
			// check user password is valid
			const validPassword = await bcrypt.compare(postData.password, userData.password);
			if (validPassword) {
				// generate access token
				const accessToken = this.generateJWT(userData);
				userData.accessToken = accessToken;
				if (!_.isUndefined(userData.password)) {
					delete userData.password;
				}
				return this.sendSuccessResponse(userData);
			} else {
				// user password is incorrect
				return this.sendFailedResponse({ password: "Your password is incorrect, please confirm you have entered the correct password" });
			}
		} else {
			// user is not found
			return this.sendFailedResponse({ username: 'User with username "' + postData.username + '" was not found, please confirm you have entered the correct username.' });
		}
	}

	generateJWT = (userData) => {
		// build token data
		const payload = {
			id: userData._id
		}

		// geenrate access token
		const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			algorithm: "HS256",
			expiresIn: "24h"
		});
		return accessToken;
	}

	// Create new user
	create = async (postData) => {

		if (_.isUndefined(postData) || !_.isObject(postData)) {
			return this.sendFailedResponse({ error: "Bad request, post data not found" });
		}

		var userExists = false;

		// check if user with specified username already exists
		if (postData.username) {
			const checkUser = await this.userMongooseServiceInstance.findOne({ username: postData.username });
			if (checkUser) {
				userExists = true;
			}
		}

		if (!userExists) {
			// encrypt plain password
			const hash = await bcrypt.hash(postData.password, saltRounds);
			postData.password = hash;
			postData.status = "Active";
			// Save new user
			try {
				const result = await this.userMongooseServiceInstance.create(postData);
				if (!_.isUndefined(result.password)) {
					// remove user password from response object
					delete result.password;
				}
				return this.sendSuccessResponse(result);
			} catch (err) {
				return this.sendFailedResponse(err);
			}
		} else {
			return this.sendFailedResponse({ username: `A user with username "${postData.username}" already exists, please <a href="/login" class="font-weight-bolder red-text">login</a> instead` });
		}
	}


	// Update a User
	update = async (postData) => {

		if (!postData) {
			return this.sendFailedResponse({ error: "Bad request, post data not found" });
		}

		const id = postData.id ? postData.id : null;

		if (id) {
			const userFind = await this.find({ id, status: 'Active' }, true);
			if (userFind.success) {
				const userData = userFind.data;
				postData = { ...userData, ...postData };
				delete postData._id; // remove id value from post data to prevent curruption 
				if (!_.isEmpty(postData.oldPassword) || !_.isEmpty(postData.newPassword)) {
					// updating user password
					if (!_.isEmpty(postData.oldPassword) && !_.isEmpty(postData.newPassword)) {
						// check user old password is valid
						const validOldPassword = await bcrypt.compare(postData.oldPassword, userData.password);
						if (validOldPassword) {
							const hash = await bcrypt.hash(postData.newPassword, saltRounds);
							postData.password = hash;
							if (!_.isUndefined(postData.oldPassword)) {
								delete postData.oldPassword;
							}
							if (!_.isUndefined(postData.newPassword)) {
								delete postData.newPassword;
							}
							try {
								const result = await this.userMongooseServiceInstance.update(id, postData);
								if (!_.isUndefined(result.password)) {
									delete result.password;
								}
								return this.sendSuccessResponse(result);
							} catch (err) {
								return this.sendFailedResponse(err);
							}
						} else {
							// the old password is incorrect
							return this.sendFailedResponse({ oldPassword: 'The Old password is invalid' });
						}
					} else {
						// bad password update request
						return this.sendFailedResponse({ error: 'Bad request, invalid request payload' });
					}
				} else {
					// updating other user info
					if (postData.username) {
						delete postData.username; // remove username value from post data to reprevent corruption 
					}
					// update user
					try {
						const result = await this.userMongooseServiceInstance.update(id, postData);
						if (!_.isUndefined(result.password)) {
							delete result.password;
						}
						return this.sendSuccessResponse(result);
					} catch (err) {
						return this.sendFailedResponse(err);
					}
				}
			} else {
				return this.sendFailedResponse({ error: 'User not found' });
			}
		} else {
			return this.sendFailedResponse({ error: 'Bad request' });
		}
	}

	// Find user
	find = async (postData, includePWD = false) => {

		if (!postData) {
			return this.sendFailedResponse({ error: "Bad request, post data not found" });
		}

		// get ruery options form postDats
		const {sort, limit, page} = postData.options ? postData.options : { sort: {createdAt: -1}, limit: 0, page: 1 };

		if (postData.id) {
			// Find user by id
			try {
				const result = await this.userMongooseServiceInstance.findById(postData.id);
				if (!_.isUndefined(result.password) && !includePWD) {
					delete result.password;
				}
				return this.sendSuccessResponse(result);
			} catch (err) {
				return this.sendFailedResponse({ error: 'User not found' });
			}
		} else if(postData.search){
			// to text search
		}else {
			// Find user by postData
			try {
				let result = await this.userMongooseServiceInstance.find(postData);
				if (result.length) {
					// if result contains only one record, return the result as an object
					if (_.size(result) < 2){
						result = result[0];
					}
					return this.sendSuccessResponse(result);
				} else {
					return this.sendFailedResponse({ error: 'User not found' });
				}
			} catch (err) {
				return this.sendFailedResponse({ error: 'User not found' });
			}
		}
	}

}

module.exports = UsersService;