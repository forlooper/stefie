var should = require('should'),
	assert = require('assert'),
	stefie = require('../index.js');

describe('Optional check', function(done) {
	it('should detect value exists', function (done) {
		var schema = { name: { _type: 'string' } };
		var val = { name: 'Stefie' };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect missing value but ok', function (done) {
		var schema = { name: { _type: 'string' } };
		var val = {};
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
});



describe('Required check', function(done) {
	it('should detect value exists', function (done) {
		var schema = { name: { _type: 'string', _required: true } };
		var val = { name: 'Stefie' };
		var error = stefie(val,  schema);
		
		assert(error == null);
		done();
	});
	it('should detect missing value', function (done) {
		var schema = { name: { _type: 'string', _required: true } };
		var val = {};
		var error = stefie(val,  schema);
		
		error.name.should.equal('Required');
		done();
	});
	it('should detect undefined value', function (done) {
		var schema = { name: { _type: 'string', _required: true } };
		var undefinedVar;
		var val = { name: undefinedVar };
		var error = stefie(val,  schema);

		error.name.should.equal('Required');
		done();
	});
	it('should detect null value', function (done) {
		var schema = { name: { _type: 'string', _required: true } };
		var val = { name: null };
		var error = stefie(val,  schema);

		error.name.should.equal('Required');
		done();
	});
});



describe('String check', function(done) {
	it('should detect value is a string', function (done) {
		var schema = { name: { _type: 'string' } };
		var val = { name: 'Stefie' };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is an invalid type', function (done) {
		var schema = { name: { _type: 'string' } };
		var val = { name: 100 };
		var error = stefie(val,  schema);
		
		error.name.should.equal('Invalid type');
		done();
	});
});



describe('Boolean check', function(done) {
	it('should detect value is a boolean', function (done) {
		var schema = { female: { _type: 'boolean' } };
		var val = { female: true };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is an invalid type', function (done) {
		var schema = { female: { _type: 'boolean' } };
		var val = { female: 'true' };
		var error = stefie(val,  schema);

		error.female.should.equal('Invalid type');
		done();
	});
});



describe('Number check', function(done) {
	it('should detect value is a number', function (done) {
		var schema = { age: { _type: 'number' } };
		var val = { age: 25 };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is a number >= min', function (done) {
		var schema = { age: { _type: 'number', _min: 21 } };
		var val = { age: 25 };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is a number <= max', function (done) {
		var schema = { age: { _type: 'number', _max: 30 } };
		var val = { age: 30 };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is a number >= min and <= max', function (done) {
		var schema = { age: { _type: 'number', _min: 21, _max: 30 } };
		var val = { age: 26 };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is an invalid type', function (done) {
		var schema = { age: { _type: 'number' } };
		var val = { age: false };
		var error = stefie(val,  schema);

		error.age.should.equal('Invalid type');
		done();
	});
	it('should detect value is below min', function (done) {
		var schema = { age: { _type: 'number', _min: 21 } };
		var val = { age: 20 };
		var error = stefie(val,  schema);

		error.age.should.equal('Below minimum amount');
		done();
	});
	it('should detect value is below min (2)', function (done) {
		var schema = { age: { _type: 'number', _min: 21, _max: 30 } };
		var val = { age: 20 };
		var error = stefie(val,  schema);

		error.age.should.equal('Below minimum amount');
		done();
	});
	it('should detect value is above max', function (done) {
		var schema = { age: { _type: 'number', _max: 30 } };
		var val = { age: 31 };
		var error = stefie(val,  schema);

		error.age.should.equal('Above maximum amount');
		done();
	});
	it('should detect value is above max (2)', function (done) {
		var schema = { age: { _type: 'number', _min: 21, _max: 30 } };
		var val = { age: 31 };
		var error = stefie(val,  schema);

		error.age.should.equal('Above maximum amount');
		done();
	});
});



describe('Array check', function(done) {
	it('should detect value is an array', function (done) {
		var schema = { friends: { _type: 'array' } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is an array although empty', function (done) {
		var schema = { friends: { _type: 'array' } };
		var val = { friends: [] };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect length >= min', function (done) {
		var schema = { friends: { _type: 'array', _minLength: 2 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect length <= max', function (done) {
		var schema = { friends: { _type: 'array', _maxLength: 2 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect length >= min and <= max', function (done) {
		var schema = { friends: { _type: 'array', _minLength: 1, _maxLength: 3 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is an invalid type', function (done) {
		var schema = { friends: { _type: 'array' } };
		var val = { friends: 100 };
		var error = stefie(val,  schema);

		error.friends.should.equal('Invalid type');
		done();
	});
	it('should detect value is an invalid element type', function (done) {
		var schema = { friends: { _type: 'array', _elementType: 'string' } };
		var val = { friends: ['may', 200] };
		var error = stefie(val,  schema);

		error.friends.should.equal('Invalid element type');
		done();
	});
	it('should detect value is below min', function (done) {
		var schema = { friends: { _type: 'array', _minLength: 3 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		error.friends.should.equal('Below minimum length');
		done();
	});
	it('should detect value is below min (2)', function (done) {
		var schema = { friends: { _type: 'array', _minLength: 3, _maxLength: 3 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		error.friends.should.equal('Below minimum length');
		done();
	});
	it('should detect value is above max', function (done) {
		var schema = { friends: { _type: 'array', _maxLength: 1 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		error.friends.should.equal('Above maximum length');
		done();
	});
	it('should detect value is above max (2)', function (done) {
		var schema = { friends: { _type: 'array', _minLength: 1, _maxLength: 1 } };
		var val = { friends: ['may', 'katrina'] };
		var error = stefie(val,  schema);

		error.friends.should.equal('Above maximum length');
		done();
	});
});



describe('Object check', function(done) {
	it('should detect value is an object', function (done) {
		var schema = { attributes: { _type: 'object' } };
		var val = { attributes: {} };
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect value is not an object', function (done) {
		var schema = { attributes: { _type: 'object' } };
		var val = { attributes: 100 };
		var error = stefie(val,  schema);

		error.attributes.should.equal('Invalid type');
		done();
	});
});



describe('Nested object check', function(done) {
	it('should detect nested values are valid', function (done) {
		var schema = {
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			attributes: {
				beautiful: true,
				siblings: 1,
				religion: 'buddhism',
				hobbies: ['eat', 'sleep', 'yoga']
			}
		};
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should allow optional nested values to be missing', function (done) {
		var schema = {
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			attributes: {
				beautiful: true,
				religion: 'buddhism'
			}
		};
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect invalid nested values', function (done) {
		var schema = {
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			attributes: {
				beautiful: 100,
				siblings: 1,
				religion: 'buddhism',
				hobbies: ['eat', 'sleep', false]
			}
		};
		var error = stefie(val,  schema);

		error.attributes.beautiful.should.equal('Invalid type');
		error.attributes.hobbies.should.equal('Invalid element type');
		done();
	});
});



describe('Full schema check', function(done) {
	it('should detect value is an object', function (done) {
		var schema = {
			name: { _type: 'string', _required: true },
			female: { _type: 'boolean', _required: true },
			age: { _type: 'number' },
			friends: { _type: 'array', _elementType: 'string', _required: true },
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			name: 'Stefie',
			female: true,
			age: 25,
			friends: ['may', 'katrina'],
			attributes: {
				beautiful: true,
				siblings: 1,
				religion: 'buddhism',
				hobbies: ['eat', 'sleep', 'yoga']
			}
		};
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect and allow optional value missing', function (done) {
		var schema = {
			name: { _type: 'string', _required: true },
			female: { _type: 'boolean', _required: true },
			age: { _type: 'number' },
			friends: { _type: 'array', _elementType: 'string', _required: true },
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			name: 'Stefie',
			female: true,
			friends: ['may', 'katrina'],
			attributes: {
				beautiful: true,
				religion: 'buddhism'
			}
		};
		var error = stefie(val,  schema);

		assert(error == null);
		done();
	});
	it('should detect all as invalid types', function (done) {
		var schema = {
			name: { _type: 'string', _required: true },
			female: { _type: 'boolean', _required: true },
			age: { _type: 'number' },
			friends: { _type: 'array', _elementType: 'string', _required: true },
			attributes: {
				_type: 'object',
				beautiful: { _type: 'boolean', _required: true },
				siblings: { _type: 'number', _required: false },
				religion: { _type: 'string', _required: true },
				hobbies: { _type: 'array', _elementType: 'string' }
			}
		};
		var val = {
			name: 100,
			female: 200,
			age: '300',
			friends: 400,
			attributes: {
				beautiful: 100,
				siblings: 1,
				religion: 'buddhism',
				hobbies: ['eat', 'sleep', false]
			}
		};
		var error = stefie(val,  schema);

		error.name.should.equal('Invalid type');
		error.female.should.equal('Invalid type');
		error.age.should.equal('Invalid type');
		error.friends.should.equal('Invalid type');
		error.attributes.beautiful.should.equal('Invalid type');
		error.attributes.hobbies.should.equal('Invalid element type');
		done();
	});
});