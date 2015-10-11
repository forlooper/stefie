var ObjectID = require('mongodb').ObjectID;

module.exports = function(val, schema) {
	var error = null;
	
	for (var key in schema) {
		var def = schema[key];
		
		if (typeof def !== 'object')
			continue;
		
		var subVal = val[key];
		var err = check(subVal, def);
		
		if (err != null) {
			if (error == null)
				error = {};
			
			error[key] = err;
		}
	}
	
	return error;
};

// http://stackoverflow.com/questions/7065120/calling-a-javascript-function-recursively
var check = function chk(val, def) {
	if (def._required === true) {
		if (typeof val == 'undefined' || val == null) {
			return 'Required';
		}
	}
	else if (typeof val == 'undefined' || val == null) {
		return null;
	}
	
	if (def._enum) {
		if (!Array.isArray(def._enum))
			return 'Invalid enum';

		if (Array.isArray(val)) {
			for (var i=0; i < val.length; i++) {
				if (def._enum.indexOf(val[i]) < 0)
					return 'Invalid value';
			}
		}
		else {
			if (def._enum.indexOf(val) < 0)
				return 'Invalid value';
		}
	}
	
	if (def._type) {
		switch (def._type) {
			case 'date':
				// http://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
				if (Object.prototype.toString.call(val) !== '[object Date]')
					return 'Invalid type';
				break;
			case 'string':
				if (typeof val != 'string')
					return 'Invalid type';
				
				if (def._minLength) {
					if (val.length < def._minLength)
						return 'Below minimum length';
				}
				
				if (def._maxLength) {
					if (val.length > def._maxLength)
						return 'Above maximum length';
				}
				break;
			case 'boolean':
				if (typeof val != 'boolean')
					return 'Invalid type';
				break;
			case 'number':
				if (typeof val != 'number')
					return 'Invalid type';

				if (typeof def._min == 'number' && val < def._min)
					return 'Below minimum amount';

				if (typeof def._max == 'number' && val > def._max)
					return 'Above maximum amount';
				break;
			case 'array':
				if (!Array.isArray(val))
					return 'Invalid type';

				if (def._elementType) {
					for (var i=0; i < val.length; i++) {
						if (typeof val[i] != def._elementType)
							return 'Invalid element type';
					}
				}

				if (def._minLength) {
					if (val.length < def._minLength)
						return 'Below minimum length';
				}

				if (def._maxLength) {
					if (val.length > def._maxLength)
						return 'Above maximum length';
				}
				break;
			case 'object':
				if (typeof val != 'object')
					return 'Invalid type';

				var error = null;
				for (var key in val) {
					var subDef = def[key];
					var subVal = val[key];
					var err = chk(subVal, subDef);

					if (err != null) {
						if (error == null)
							error = {};

						error[key] = err;
					}
				}

				return error;
				break;
			case 'ObjectID':
				if (typeof val.toHexString !== 'function')
					return 'Invalid type';
				break;
			case 'hexString':
				if (!ObjectID.isValid(val))
					return 'Invalid type';
				break;
			default:
				return 'Invalid definition type';
				break;
		}
	}
	
	if (def._regex) {
		if (!def._regex.test(val)) {
			return 'Regex failed'
		}
	}
	
	return null;
};