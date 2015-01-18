module.exports = function(val, schema) {
	var error = null;
	
	for (var key in schema) {
		var def = schema[key];
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
	
	switch (def._type) {
		case 'string':
			if (typeof val != 'string')
				return 'Invalid type';
			break;
		case 'boolean':
			if (typeof val != 'boolean')
				return 'Invalid type';
			break;
		case 'number':
			if (typeof val != 'number')
				return 'Invalid type';
			
			if (typeof def._min == 'number' && val < def._min)
				return 'Invalid value';

			if (typeof def._max == 'number' && val > def._max)
				return 'Invalid value';
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
		default:
			return 'Invalid definition type';
			break;
	}
	
	return null;
};