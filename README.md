# Stefie

---

Superlight schema-based Node.js object validator. Useful for Express req.body, req.params, req.query.

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

### A More Complex Example
```
var stefie = require('stefie');

// This is the schema that your value/object will be validated against
// Nesting is supported
var schema = {
	name: { _type: 'string', _required: true },
	female: { _type: 'boolean', _required: true },
	age: { _type: 'number' },
	friends: { _type: 'array', _elementType: 'string', _required: true },
	profile: {
		_type: 'object',
		beautiful: { _type: 'boolean', _required: true },
		siblings: { _type: 'number', _required: false },
		religion: { _type: 'string', _required: true },
		hobbies: { _type: 'array', _elementType: 'string' }
	}
};
// This is an example object that we want to validate
var obj = {
	name: 'Stefie',
	female: true,
	age: 'twenty-five', // <- should be a number
	friends: ['may', 'katrina'],
	profile: {
		beautiful: true,
		siblings: 1,
		religion: 'buddhism',
		hobbies: ['eat', 'sleep', false] // <- should be array of strings only
	}
};
var error = stefie(val,  schema);

if (error != null) {
	console.log(error);
	/*
	Outputs:
	{
	  age: 'Invalid type',
	  profile: {
        hobbies: 'Invalid element type'
	  }
    }
	*/
}
```

## Schema Attributes

Schema Attributes begin with an underscore so that they don't namespace clash with the property names of your object in the schema.

| Attribute      | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| `_required`    | <code>true&#124;false</code>                                          |
| `_type`        | <code>'string&#124;boolean&#124;number&#124;array&#124;object'</code> |
| `_min`         | *number*                                                              |
| `_max`         | *number*                                                              |
| `_elementType` | <code>'string&#124;boolean&#124;number&#124;array&#124;object'</code> |

## Test

```
npm test
```

