// generate random string
const randomString = (length) => {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
const containsObject = (obj, list) => {
    var i;
	if(typeof list !== null && typeof list !== 'undefined' 
		&& typeof obj !== null && typeof obj !== 'undefined'
	)
		if(Array.isArray(list)){
			for (i = 0; i < list.length; i++) {
				if (list[i] === obj) {
					return true;
				}
			}
		}else if(typeof list === 'object' && !Array.isArray(list)){
			for (i in list) {
				if (list.hasOwnProperty(i) && list[i] === obj) {
					return true;
				}
			}
		}
		
    return false;
}

module.exports = {randomString, containsObject};