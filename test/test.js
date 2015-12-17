var should = require('should'),
	ObjectID = require('mongodb').ObjectID,
	stefie = require('../index.js');

describe('Schema test', function() {
	it('should throw an error if rule does not exist', function (done) {
		try {
			var person = {
				name: 'Stranger'
			};
			
			var error = stefie(person,  {
				name: { _rules: { disallow: 'Stranger' } }
			});
		}
		catch(err) {
			err.message.should.equal('validator for rule "disallow" does not exist');
		}
		finally {
			done();
		}
	});
	
	it('should throw an error for non-objects in schema', function (done) {
		var movie = {
			title: '300',
			duration: 117,
			rating: 5
		};
		
		try {
			var error = stefie(movie,  {
				title: { _rules: { type: 'string' } },
				duration: 0,
				rating: function() { return 0; }
			});
		}
		catch(err) {
			err.message.should.equal('non-object for property in schema');
		}
		finally {
			done();
		}
	});
	
	it('should be able to traverse nested schemas', function (done) {
		var movie = {
			title: '300',
			crew: {
				director: 'Zack Snyder',
				writers: ['Frank Miller', 'Zack Snyder']
			}
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			crew: {
				director: { _rules: { type: 'string' } },
				writers: { _rules: { type: 'array', arrayType: 'string' } }
			}
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should be able to an error in a nested schema', function (done) {
		var movie = {
			title: 300,
			crew: {
				director: 'Zack Snyder',
				writers: 'Frank Miller, Zack Snyder'
			}
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			crew: {
				director: { _rules: { type: 'string' } },
				writers: { _rules: { type: 'array', arrayType: 'string' } }
			}
		});
		
		error.title.should.equal('Invalid type');
		error.crew.writers.should.equal('Invalid type');
		done();
	});
});

describe('Type validation', function() {
	it('should detect unsupported type', function (done) {
		var movie = {
			title: '300'
		};
		
		try {
			var error = stefie(movie,  {
				title: { _rules: { type: 'unsupported' } }
			});
		}
		catch(err) {
			err.message.should.equal('unsupported type');
		}
		finally {
			done();
		}
	});
	
	it('should detect array', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', arrayType: 'string' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-array', function (done) {
		var movie = {
			title: '300',
			cast: 'Gerard Butler, Lena Headey, Michael Fassbender'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', arrayType: 'string' } }
		});
		
		error.cast.should.equal('Invalid type');
		done();
	});
	
	it('should detect boolean', function (done) {
		var movie = {
			title: '300',
			released: true
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			released: { _rules: { type: 'boolean' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-boolean', function (done) {
		var movie = {
			title: '300',
			released: 'true'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			released: { _rules: { type: 'boolean' } }
		});
		
		error.released.should.equal('Invalid type');
		done();
	});
	
	it('should detect date', function (done) {
		var movie = {
			title: '300',
			releaseDate: new Date(2007, 2, 9)
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			releaseDate: { _rules: { type: 'date' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-date', function (done) {
		var movie = {
			title: '300',
			releaseDate: '9 Mar 2007'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			releaseDate: { _rules: { type: 'date' } }
		});
		
		error.releaseDate.should.equal('Invalid type');
		done();
	});
	
	it('should detect Object ID string', function (done) {
		var actor = {
			id: ObjectID().toString(),
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			id: { _rules: { type: 'objectIdString' } },
			name: { _rules: { type: 'string' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-Object ID string', function (done) {
		var actor = {
			id: '123',
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			id: { _rules: { type: 'objectIdString' } },
			actor: { _rules: { type: 'string' } }
		});
		
		error.id.should.equal('Invalid type');
		done();
	});
	
	it('should detect ISO date string', function (done) {
		var day = {
			date: (new Date()).toISOString()
		};
		
		var error = stefie(day,  {
			date: { _rules: { type: 'dateString' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-ISO date string', function (done) {
		var day = {
			date: 'abc'
		};
		
		var error = stefie(day,  {
			date: { _rules: { type: 'dateString' } }
		});
		
		error.date.should.equal('Invalid type');
		done();
	});
	
	it('should detect number (integer)', function (done) {
		var day = {
			temp: 25
		};
		
		var error = stefie(day,  {
			temp: { _rules: { type: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect number (decimal)', function (done) {
		var day = {
			temp: 25.0
		};
		
		var error = stefie(day,  {
			temp: { _rules: { type: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect number (negative)', function (done) {
		var day = {
			temp: -5
		};
		
		var error = stefie(day,  {
			temp: { _rules: { type: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-number', function (done) {
		var day = {
			temp: 'five'
		};
		
		var error = stefie(day,  {
			temp: { _rules: { type: 'number' } }
		});
		
		error.temp.should.equal('Invalid type');
		done();
	});
	
	it('should detect object', function (done) {
		var computer = {
			model: 'MacBook Air',
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string' } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-object', function (done) {
		var computer = {
			model: 'MacBook Air',
			processor: 'Intel Core i5'
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string' } },
			processor: { _rules: { type: 'object' } }
		});
		
		error.processor.should.equal('Invalid type');
		done();
	});
	
	it('should detect Object ID', function (done) {
		var actor = {
			id: ObjectID(),
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			id: { _rules: { type: 'objectId' } },
			name: { _rules: { type: 'string' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-Object ID', function (done) {
		var actor = {
			id: 'abc',
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			id: { _rules: { type: 'objectId' } },
			name: { _rules: { type: 'string' } }
		});
		
		error.id.should.equal('Invalid type');
		done();
	});
	
	it('should detect string', function (done) {
		var movie = {
			title: '300'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-string', function (done) {
		var movie = {
			title: 300
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } }
		});
		
		error.title.should.equal('Invalid type');
		done();
	});
});

describe('Array type validation', function() {
	it('should detect empty array', function (done) {
		var poll = {
			votes: []
		};
		
		var error = stefie(poll,  {
			votes: { _rules: { type: 'array', arrayType: 'boolean' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect boolean elements', function (done) {
		var poll = {
			votes: [true, false, true]
		};
		
		var error = stefie(poll,  {
			votes: { _rules: { type: 'array', arrayType: 'boolean' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-boolean elements', function (done) {
		var poll = {
			votes: ['yes', 'no', 'yes']
		};
		
		var error = stefie(poll,  {
			votes: { _rules: { type: 'array', arrayType: 'boolean' } }
		});
		
		error.votes.should.equal('Invalid element type');
		done();
	});
	
	it('should detect date elements', function (done) {
		var poll = {
			dates: [(new Date()), (new Date()), (new Date())]
		};
		
		var error = stefie(poll,  {
			dates: { _rules: { type: 'array', arrayType: 'date' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-date elements', function (done) {
		var poll = {
			dates: ['6 Mar 2007']
		};
		
		var error = stefie(poll,  {
			dates: { _rules: { type: 'array', arrayType: 'date' } }
		});
		
		error.dates.should.equal('Invalid element type');
		done();
	});
	
	it('should detect Object ID string elements', function (done) {
		var table = {
			entries: [ObjectID().toString(), ObjectID().toString(), ObjectID().toString()]
		};
		
		var error = stefie(table,  {
			entries: { _rules: { type: 'array', arrayType: 'objectIdString' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-Object ID string elements', function (done) {
		var table = {
			entries: ['123', '456', '789']
		};
		
		var error = stefie(table,  {
			entries: { _rules: { type: 'array', arrayType: 'objectIdString' } }
		});
		
		error.entries.should.equal('Invalid element type');
		done();
	});
	
	it('should detect ISO date string elements', function (done) {
		var poll = {
			dates: [(new Date()).toISOString(), (new Date()).toISOString(), (new Date()).toISOString()]
		};
		
		var error = stefie(poll,  {
			dates: { _rules: { type: 'array', arrayType: 'dateString' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-ISO date string elements', function (done) {
		var poll = {
			dates: ['abc', 'abc', 'abc']
		};
		
		var error = stefie(poll,  {
			dates: { _rules: { type: 'array', arrayType: 'dateString' } }
		});
		
		error.dates.should.equal('Invalid element type');
		done();
	});
	
	it('should detect number (integer) elements', function (done) {
		var poll = {
			voterAges: [20, 30, 40]
		};
		
		var error = stefie(poll,  {
			voterAges: { _rules: { type: 'array', arrayType: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect number (decimal) elements', function (done) {
		var spring = {
			temperatures: [15.0, 20.0, 25.0]
		};
		
		var error = stefie(spring,  {
			temperatures: { _rules: { type: 'array', arrayType: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect number (negative) elements', function (done) {
		var winter = {
			temperatures: [-1.0, -5, -10.0]
		};
		
		var error = stefie(winter,  {
			temperatures: { _rules: { type: 'array', arrayType: 'number' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-number elements', function (done) {
		var summer = {
			temperatures: ['one', true]
		};
		
		var error = stefie(summer,  {
			temperatures: { _rules: { type: 'array', arrayType: 'number' } }
		});
		
		error.temperatures.should.equal('Invalid element type');
		done();
	});
	
	it('should detect object elements', function (done) {
		var movie = {
			cast: [{ name: 'Gerald Butler' },  { name: 'Lena Headey' }]
		};
		
		var error = stefie(movie,  {
			cast: { _rules: { type: 'array', arrayType: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-object elements', function (done) {
		var movie = {
			cast: ['Gerald Butler', 'Lena Headey']
		};
		
		var error = stefie(movie,  {
			cast: { _rules: { type: 'array', arrayType: 'object' } }
		});
		
		error.cast.should.equal('Invalid element type');
		done();
	});
	
	it('should detect Object ID elements', function (done) {
		var database = {
			entries: [ObjectID(), ObjectID()]
		};
		
		var error = stefie(database,  {
			entries: { _rules: { type: 'array', arrayType: 'objectId' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-Object ID elements', function (done) {
		var database = {
			entries: ['123', '456']
		};
		
		var error = stefie(database,  {
			entries: { _rules: { type: 'array', arrayType: 'objectId' } }
		});
		
		error.entries.should.equal('Invalid element type');
		done();
	});
	
	it('should detect string elements', function (done) {
		var poll = {
			votes: ['yes', 'no', 'yes']
		};
		
		var error = stefie(poll,  {
			votes: { _rules: { type: 'array', arrayType: 'string' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-string elements', function (done) {
		var poll = {
			votes: [true, false, true]
		};
		
		var error = stefie(poll,  {
			votes: { _rules: { type: 'array', arrayType: 'string' } }
		});
		
		error.votes.should.equal('Invalid element type');
		done();
	});
});

describe('Required validation', function() {
	it('should not validate undefined property if required is absent', function (done) {
		var computer = {
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string' } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should not validate undefined property if required is false', function (done) {
		var computer = {
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', required: false } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should not validate defined property if required is false', function (done) {
		var computer = {
			model: 'MacBook Air',
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', required: false } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should validate undefined property if required is true', function (done) {
		var computer = {
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', required: true } },
			processor: { _rules: { type: 'object' } }
		});
		
		error.model.should.equal('Required');
		done();
	});
	
	it('should validate defined property if required is true', function (done) {
		var computer = {
			model: 'MacBook Air',
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', required: true } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
});

describe('Null validation', function() {
	it('should detect value can be null and is null', function (done) {
		var computer = {
			model: null,
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', null: true } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value cannot be null and is null', function (done) {
		var computer = {
			model: null,
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', null: false } },
			processor: { _rules: { type: 'object' } }
		});
		
		error.model.should.equal('Null');
		done();
	});
	
	it('should detect value can be null but can be undefined', function (done) {
		var computer = {
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', null: true, required: false } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value can be null but cannot be undefined', function (done) {
		var computer = {
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', null: true, required: true } },
			processor: { _rules: { type: 'object' } }
		});
		
		error.model.should.equal('Required');
		done();
	});
	
	it('should detect value can be null and is of correct type', function (done) {
		var computer = {
			model: 'MacBook Air',
			processor: {
				name: 'Intel Core i5',
				speed: '1.8 GHz'
			}
		};
		
		var error = stefie(computer,  {
			model: { _rules: { type: 'string', null: true } },
			processor: { _rules: { type: 'object' } }
		});
		
		should.not.exist(error);
		done();
	});
});

describe('Min validation', function() {
	it('should detect value equals minimum', function (done) {
		var movie = {
			title: '300',
			starRating: 1 
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', min: 1 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value above minimum', function (done) {
		var movie = {
			title: '300',
			starRating: 2
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', min: 1 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value below minimum', function (done) {
		var movie = {
			title: '300',
			starRating: 0
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', min: 1 } }
		});
		
		error.starRating.should.equal('Below minimum');
		done();
	});
});

describe('Max validation', function() {
	it('should detect value equals maximum', function (done) {
		var movie = {
			title: '300',
			starRating: 5
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', max: 5 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value above maximum', function (done) {
		var movie = {
			title: '300',
			starRating: 6
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', max: 5 } }
		});
		
		error.starRating.should.equal('Above maximum');
		done();
	});
	
	it('should detect value below maximum', function (done) {
		var movie = {
			title: '300',
			starRating: 4
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			starRating: { _rules: { type: 'number', max: 5 } }
		});
		
		should.not.exist(error);
		done();
	});
});

describe('Min length validation', function() {
	it('should detect string length equals minimum length', function (done) {
		var actor = {
			name: 'G'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', minLength: 1 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect string length above minimum length', function (done) {
		var actor = {
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', minLength: 1 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect string length below minimum length', function (done) {
		var actor = {
			name: ''
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', minLength: 1 } }
		});
		
		error.name.should.equal('Below minimum length');
		done();
	});
	
	it('should detect array length equals minimum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', minLength: 2 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array length above minimum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', minLength: 2 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array length below minimum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', minLength: 2 } }
		});
		
		error.cast.should.equal('Below minimum length');
		done();
	});
});

describe('Max length validation', function() {
	it('should detect string length equals maximum length', function (done) {
		var actor = {
			name: 'Gerald'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', maxLength: 6 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect string length above maximum length', function (done) {
		var actor = {
			name: 'Gerald Butler'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', maxLength: 6 } }
		});
		
		error.name.should.equal('Above maximum length');
		done();
	});
	
	it('should detect string length below maximum length', function (done) {
		var actor = {
			name: 'Geral'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string', maxLength: 6 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array length equals maximum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', maxLength: 2 } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array length above maximum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', maxLength: 2 } }
		});
		
		error.cast.should.equal('Above maximum length');
		done();
	});
	
	it('should detect array length below maximum length', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { type: 'array', maxLength: 2 } }
		});
		
		should.not.exist(error);
		done();
	});
});

describe('enum validation', function() {
	it('should detect value is in enum', function (done) {
		var movie = {
			title: '300',
			rating: 'R'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			rating: { _rules: { enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'] } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect value is not in enum', function (done) {
		var movie = {
			title: '300',
			rating: 'No Rating'
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			rating: { _rules: { enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'] } }
		});
		
		error.rating.should.equal('Not in enumeration');
		done();
	});
	
	it('should detect array is equal to enum (same order)', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { enum: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham'] } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array is equal to enum (different order)', function (done) {
		var movie = {
			title: '300',
			cast: ['Lena Headey', 'David Wenham', 'Michael Fassbender', 'Gerard Butler']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { enum: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham'] } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array is subset of enum', function (done) {
		var movie = {
			title: '300',
			cast: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { enum: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham'] } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect array is superset of enum', function (done) {
		var movie = {
			title: '300',
			cast: ['Nicholas Cage', 'Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { enum: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham'] } }
		});
		
		error.cast.should.equal('Not in enumeration');
		done();
	});
	
	it('should detect array has nothing from enum', function (done) {
		var movie = {
			title: '300',
			cast: ['Nicholas Cage', 'Christian Bale']
		};
		
		var error = stefie(movie,  {
			title: { _rules: { type: 'string' } },
			cast: { _rules: { enum: ['Gerard Butler', 'Lena Headey', 'Michael Fassbender', 'David Wenham'] } }
		});
		
		error.cast.should.equal('Not in enumeration');
		done();
	});
});

describe('Regex validation', function() {
	it('should detect matching regex', function (done) {
		var actor = {
			name: 'Gerald Butler',
			email: 'gerald@hollywood.com'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string' } },
			email: { _rules: { regex: /.+@.+/ } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should detect non-matching regex', function (done) {
		var actor = {
			name: 'Gerald Butler',
			email: '@hollywood.com'
		};
		
		var error = stefie(actor,  {
			name: { _rules: { type: 'string' } },
			email: { _rules: { regex: /.+@.+/ } }
		});
		
		error.email.should.equal('Regex mismatch');
		done();
	});
});

describe('Extensibility', function() {
	it('should add custom validator', function (done) {
		var fn = function(val, ruleVal) {
			return (val !== ruleVal ? null : 'Value is disallowed');
		};
		
		stefie.add('disallow', fn);
		done();
	});
	
	it('should detect disallowed value', function (done) {
		var person = {
			name: 'Stranger'
		};
		
		var error = stefie(person,  {
			name: { _rules: { type: 'string', disallow: 'Stranger' } }
		});
		
		error.name.should.equal('Value is disallowed');
		done();
	});
	
	it('should detect non-disallowed value', function (done) {
		var person = {
			name: 'Gerald Butler'
		};
		
		var error = stefie(person,  {
			name: { _rules: { type: 'string', disallow: 'Stranger' } }
		});
		
		should.not.exist(error);
		done();
	});
	
	it('should not add custom validator if rule is "required"', function (done) {
		var fn = function(val, ruleVal) {
			return null;
		};
		
		try {
			stefie.add('required', fn);
		}
		catch(err) {
			err.message.should.equal('argument rule must not be required or null');
		}
		finally {
			done();
		}
	});
	
	it('should not add custom validator if rule is "null"', function (done) {
		var fn = function(val, ruleVal) {
			return null;
		};
		
		try {
			stefie.add('null', fn);
		}
		catch(err) {
			err.message.should.equal('argument rule must not be required or null');
		}
		finally {
			done();
		}
	});
	
	it('should not add custom validator if fn is not a function', function (done) {
		try {
			stefie.add('custom', 'not a function');
		}
		catch(err) {
			err.message.should.equal('argument fn must be a function');
		}
		finally {
			done();
		}
	});
	
	it('should remove a validator', function (done) {
		stefie.remove('disallow');
		
		try {
			var person = {
				name: 'Stranger'
			};
			
			var error = stefie(person,  {
				name: { _rules: { type: 'string', disallow: 'Stranger' } }
			});
		}
		catch(err) {
			err.message.should.equal('validator for rule "disallow" does not exist');
		}
		finally {
			done();
		}
	});
});