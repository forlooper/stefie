# Stefie

Superlight schema-based Node.js object validator. Useful for Express req.body/params/query, or MongoDB document before inserting into collection if don't want to use Mongoose.

---

## What's New

- Added hexString type to check for valid MongoDB ObjectId hex string
- Renamed ObjectId type to ObjectID to be consistent with [node-mongodb-native's ObjectID](http://mongodb.github.io/node-mongodb-native/2.0/api/ObjectID.html) 

## Installation

```
$ npm install stefie
```

## Usage

First, model the schema by defining each property of the object you are validating. Then, call `stefie`. Last, check if error is null. 

```
var stefie = require('stefie');
var schema = {
	age: { _type: 'number' }
};
var obj = { age: 'twenty-five' };
var error = stefie(obj, schema);

if (error != null) {
	console.log(error); // prints { age: 'Invalid type' }
}
```

### A More Full-Fledged Example
```
var stefie = require('stefie');

// This is the schema that your value/object will be validated against
// Nesting is supported
var schema = {
	name: { _type: 'string', _required: true },
	female: { _type: 'boolean', _required: true },
	age: { _type: 'number' },
	friends: { _type: 'array', _elementType: 'string', _required: true },
	mood: { _regex: /^[a-z]+$/ },
	profile: {
		_type: 'object',
		beautiful: { _type: 'boolean', _required: true },
		siblings: { _type: 'number', _required: false },
		religion: { _type: 'string', _required: true },
		hobbies: { _type: 'array', _elementType: 'string' },
		devices: { _type: 'array', _enum: ['desktop', 'laptop', 'phone', 'tablet'] },
		phone: { _type: 'string', _enum: ['ios', 'android', 'windows', 'blackberry'] }
	}
};
// This is an example object that we want to validate
var obj = {
	name: 'Stefie',
	female: true,
	age: 'twenty-five', // <- should be a number
	friends: ['may', 'katrina'],
	mood: -1, // <- will not match the regex
	profile: {
		beautiful: true,
		siblings: 1,
		religion: 'buddhism',
		hobbies: ['eat', 'sleep', false], // <- should be array of strings only
		devices: ['laptop', 'phone', 'tablet'],
		phone: 'android'
	}
};
var error = stefie(val,  schema);

if (error != null) {
	console.log(error);
	/*
	Outputs:
	{
	  age: 'Invalid type',
	  mood: 'Regex failed',
	  profile: {
        hobbies: 'Invalid element type'
	  }
    }
	*/
}
```

## Schema Attributes

Schema Attributes begin with an underscore so that they don't namespace clash with the property names of your object in the schema.

| Attribute      | Value                                                                                                        | Note
| -------------- | ------------------------------------------------------------------------------------------------------------ | ----
| `_required`    | <code>true&#124;false</code>                                                                                 | For any type
| `_type`        | <code>'date&#124;string&#124;boolean&#124;number&#124;array&#124;object&#124;hexString&#124;ObjectID'</code> | .
| `_min`         | *number*                                                                                                     | For number type
| `_max`         | *number*                                                                                                     | For number type
| `_elementType` | <code>'date&#124;string&#124;boolean&#124;number&#124;array&#124;object'</code>                              | For array type
| `_minLength`   | *number*                                                                                                     | For array type
| `_maxLength`   | *number*                                                                                                     | For array type
| `_enum`        | *array*                                                                                                      | For any type
| `_regex`       | *regular expression*                                                                                         | .

## Test

```
npm test
```

