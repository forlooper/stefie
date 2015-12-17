# Stefie

Superlight, schema-based, extensible Node.js object validator. Useful for Express req.body/params/query, or MongoDB document before inserting into collection if don't want to use Mongoose.

---

## What's New in 2.0

- Extensiblity - Add your own custom validators with the `add()` method
- Cleaner namespace management - put all your rules in the `_rules` object for each property in the schema
- Code rewritten to be simpler and more elegant
- Added `dateString` type to check for valid date strings
- Renamed `ObjectID` type to `objectId` to be consistent with other type names
- Renamed `hexString` type to `objectIdString` to be more intuitive

## Installation

```
$ npm install stefie
```

## Usage

Firstly, model a schema of the object you want to validate. Then, call `stefie` and see if she returns an error or null.

```
var stefie = require('stefie');

var movie = {
	title: '300',
	crew: {
		director: 'Zack Snyder',
		writers: ['Frank Miller', 'Zack Snyder']
	}
};

var movieSchema = {
	title: { _rules: { type: 'string' } },
	crew: {
		director: { _rules: { type: 'string' } },
		writers: { _rules: { type: 'array', arrayType: 'string' } }
	}
};

var error = stefie(movie, movieSchema);

if (error != null) {
	console.log(error);
}
```

### The \_rules Object

Add all the rules that apply to a property in the `_rules` object in the schema.

```
var schema = {
	title: { _rules: { type: 'string' } },
	rating: { _rules: { type: 'number', required: true, null: false, min: 1, max: 10 } }
};
```

### The Return Object

If there are no errors, `stefie()` returns **null**.

If there are errors, she returns an object with each property that failed validation and the reason why.

```
var movie2 = {
	title: 300,
	crew: {
		director: 'Zack Snyder',
		writers: 'Frank Miller, Zack Snyder'
	}
};

var error = stefie(movie2, movieSchema);

if (error != null) {
	console.log(error);
}
```

Output:

```
{
	title: 'Invalid type',
	crew: {
		writers: 'Invalid type'
	}
}
```

## Rules

The following are keys you can use in the `_rules` object in your schema.

**Rule precedence**: If you have `required` and/or `null` rules, required will be evaluated first, then null, then any other rule.

**Rule skip**: Rules will not be evaluated if the property value is undefined. The exception is the `required` rule.

### required

Data type: *boolean*

If `true`, property must be defined. If `false`, property can be undefined.

```
var schema = {
	title: { _rules: { required: true } }
};
```

Note: Setting this rule to `false` is logically the same as not using it at all.

### null

Data type: *boolean*

If `true`, property can be `null`. If `false`, property cannot be `null`.

```
var schema = {
	rating: { _rules: { null: true } }
};
```

Note: `required` and `null` rules can coexist together.

### type

Data type: *string*

Checks if property is of the specified type.

Possible types | Notes
--- | ---
array | &nbsp;
boolean | &nbsp;
date | Checks if property is a JavaScript Date object
dateString | Checks if property can be parsed with `Date.parse()`
number | &nbsp;
object | &nbsp;
objectId | Checks if property is a MongoDB ObjectID object
objectIdString | Checks if property is a valid MongoDB ObjectID string
string | &nbsp;

```
var schema = {
	rating: { _rules: { type: 'number' } }
};
```

### arrayType

Data type: *string*

Checks if an array's elements are of the specified type.

Possible types | Notes
--- | ---
array | &nbsp;
boolean | &nbsp;
date | Checks if property is a JavaScript Date object
dateString | Checks if property can be parsed with `Date.parse()`
number | &nbsp;
object | &nbsp;
objectId | Checks if property is a MongoDB ObjectID object
objectIdString | Checks if property is a valid MongoDB ObjectID string
string | &nbsp;

```
var schema = {
	writers: { _rules: { type: 'array', arrayType: 'string' } }
};
```

### min

Data type: *number*

Checks if property is equal to or greater than the specified number.

```
var schema = {
	rating: { _rules: { type: 'number', min: 1 } }
};
```

### max

Data type: *number*

Checks if property is equal to or less than the specified number.

```
var schema = {
	rating: { _rules: { type: 'number', max: 10 } }
};
```

### minLength

Data type: *number*

Checks if array/string has a length equal to or greater than the specified number.

```
var schema = {
	name: { _rules: { type: 'string', minLength: 1 } },
	writers: { _rules: { type: 'array', arrayType: 'string', minLength: 1 } }
};
```

### maxLength

Data type: *number*

Checks if array/string has a length equal to or less than the specified number.

```
var schema = {
	name: { _rules: { type: 'string', maxLength: 100 } },
	writers: { _rules: { type: 'array', arrayType: 'string', maxLength: 10 } }
};
```

### enum

Data type: *array*

If property is a **single-value**, checks if it is one of the enumerated values. If property is an **array**, checks if each of its elements is one of the enumerated values.

```
var schema = {
	director: { _rules: { type: 'string', enum: ['Zack Snyder', 'JJ Abrams'] } },
	cast: { _rules: { type: 'array', enum: ['Gerald Butler', 'Lena Headey', 'Michael Fassbender'] } }
};
```

### regex

Data type: *regular expression*

Checks if property matches the specified regular expression.

```
var schema = {
	email: { _rules: { regex: /.+@.+/ } }
};
```

## Custom Validators

You can add your own custom validator functions to stefie, and use it in the `_rules` object in your schema.

### stefie.add(rule, fn)

Arguments:

1. `rule` *(string)*: Name of the rule
2. `fn` *(function)*: Validator function

The validator function must have a signature of `function(val, ruleVal)` where `val` is the value of the property of the object we are validating and `ruleVal` is the value of the rule.

```
var fn = function(val, ruleVal) {
	return (val !== ruleVal ? null : 'Value is disallowed');
};

stefie.add('disallow', fn);

var person = {
	name: 'Stranger'
};

var error = stefie(person,  {
	name: { _rules: { type: 'string', disallow: 'Stranger' } }
});

console.log(error);
```

Output:

```
{
	name: 'Value is disallowed'
}
```

### stefie.remove(rule)

Removes a validator. Cannot remove *required* and *null*.

Arguments:

1. `rule` *(string)*: Name of the rule

```
stefie.remove('disallow');
```

## Test

To run the test cases, `cd` into the stefie directory then do:

```
npm test
```

#### Author: [Harry Lee](mailto:harry@forlooper.com)
