# API validator

> A module for validating DADI API documents

[![npm (scoped)](https://img.shields.io/npm/v/@dadi/api-validator.svg?maxAge=10800&style=flat-square)](https://www.npmjs.com/package/@dadi/api-validator)
[![Coverage Status](https://coveralls.io/repos/github/dadi/api-validator/badge.svg?branch=master)](https://coveralls.io/github/dadi/api-validator?branch=master)
[![Build Status](https://travis-ci.org/dadi/api-validator.svg?branch=master)](https://travis-ci.org/dadi/api-validator)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

## Overview

[DADI API](https://dadi.cloud/api) is a high-performance RESTful layer designed in support of API-first development and COPE. With this module, you can perform validation of API documents within your project using the same logic as used by the DADI API core application.

## Installation

Install the module via npm:

```bash
npm install @dadi/api-validator
```

## Usage

The module exports a constructor method that expects the following named parameters relating to the instance of DADI API you're working with:

- `i18nFieldCharacter`: the character used to represent the language variation of a field, as defined by the `i18n.fieldCharacter` configuration property (default: `:`)
- `internalFieldPrefix`: the character used to prefix internal API fields, as defined by the `internalFieldPrefix` configuration property (default: `_`)

```js
const Validator = require('@dadi/api-validator')
const myValidator = new Validator({
  i18nFieldCharacter: ':',
  internalFieldPrefix: '_'
})
```

The `Validator` class contains the following methods.

### `validateDocument({document, schema})`

Validates a document against a collection schema. It returns a Promise that is resolved with `undefined` if no validation errors occur, or rejected with an array of errors if validation fails.

```js
const mySchema = {
  title: {
    type: 'string',
    validation: {
      minLength: 10
    }
  }
}

// Rejected Promise:
// > [{"field": "title", "code": "ERROR_MIN_LENGTH", "message": "is too short"}]
myValidator.validateDocument({
  document: {
    title: 'great'
  },
  schema: mySchema
}).catch(console.log)

// Resolved Promise:
// > undefined
myValidator.validateDocument({
  document: {
    title: 'super amazing!'
  },
  schema: mySchema
})
```

### `validateDocuments({documents, schema})`

Same as `validateDocument` but expects an array of documents (as the `documents` property) and performs validation on each one of them, aborting the process once one of the documents fails validation.

### `validateValue({schema, value})`

Validates a candidate value against a field schema. It returns a Promise that is resolved with `undefined` if no validation errors occur, or rejected with an error object if validation fails.

```js
const mySchema = {
  title: {
    type: 'string',
    validation: {
      minLength: 10
    }
  }
}

// Rejected Promise:
// > {"field": "title", "code": "ERROR_MIN_LENGTH", "message": "is too short"}
myValidator.validateField({
  schema: mySchema,
  value: 'great'
}).catch(console.log)

// Resolved Promise:
// > undefined
myValidator.validateDocument({
  schema: mySchema,
  value: 'super amazing!'
})
```

## License

DADI is a data centric development and delivery stack, built specifically in support of the principles of API first and COPE.

Copyright notice<br />
(C) 2018 DADI+ Limited <support@dadi.cloud><br />
All rights reserved

This product is part of DADI.<br />
DADI is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version ("the GPL").

**If you wish to use DADI outside the scope of the GPL, please
contact us at info@dadi.co for details of alternative licence
arrangements.**

**This product may be distributed alongside other components
available under different licences (which may not be GPL). See
those components themselves, or the documentation accompanying
them, to determine what licences are applicable.**

DADI is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

The GNU General Public License (GPL) is available at
http://www.gnu.org/licenses/gpl-3.0.en.html.<br />
A copy can be found in the file GPL.md distributed with
these files.

This copyright notice MUST APPEAR in all copies of the product!
