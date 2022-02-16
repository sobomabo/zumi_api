
class BaseService {

	sendSuccessResponse = (data) => {
		return {
			success: true,
			data
		}
	}

	sendFailedResponse = (errors) => {
		return {
			success: false,
			errors
		}
	}
}

module.exports = BaseService;