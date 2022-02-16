const assert = require("chai").assert;
const mocha = require("mocha");
const UsersService = require("../../services/UsersService"); // Import the service we want to test

mocha.describe("Users Service", () => {
	const UsersServiceInstance = new UsersService();

	mocha.describe("Create instance of service", () => {
		it("Is not null", () => {
			assert.isNotNull(UsersServiceInstance);
		});

		it("Exposes the authenticate method", () => {
			assert.isFunction(UsersServiceInstance.authenticate);
		});
	});
});
