# Northcoders News API

**A Northcoders branded reddit clone**

## Prerequisites

To run the news api, you will need **express, pg and knex.**

To install all the dependencies:

```bash
npm i
```

_OR_

```bash
npm i express pg knex
```

## Creating a knex file

Linux/Non-Apple Users will need to make their own config file for knex to run correctly

This should be made in _root/private/config.js_

Your config file should include your user name and password on the export object

# Example

exports.username = 'username';
exports.password = 'password';

## Installing Dev Dependencies

To run the dev server, you will need **chai, mocha, supertest, and chai-sorted**

These should have been installed when running the previous install but just in case:

```bash

npm i chai mocha supertest chai-sorted -D

# This will install all relevant dev dependencies.
```

## Running the tests

The program comes with many different scripts to make designing and testing easier.

**setup-dbs** - Creates the database for the information to go into.
**seed** - Seeds the database with tables and appropriate column titles for storing the information.
**migrate-latest** - Fills the tables with information from the data folder, defaulting to dev data
**migrate-rollback** - Takes the tables back to their previous form before the last migration.
**dev** - Sets up the database, tables, and fills tables with dev data and starts the server listening on port 9090.
**test-utils** - Runs the spec file for the test utilities used to manipulate the data to be able to be parsed into the tables.
**test** - Runs the spec file for testing the server, responses and methods using supertest

## Test Utils

There are a number of test utilities included to manipulate the data to fit the design of the tables.

**formatDates** - changes the data from a unix timestamp to standard timestamp.

_1542284514171 converted to 2018-11-15T12:21:54.171Z_

**makeRefObj** - makes a reference object for _formatComments_ using the title and object id from each article.

_Example_

{
article_id: 1,
title: 'Living in the shadow of a great man',
body: 'I find this existence challenging',
votes: 100,
topic: 'mitch',
author: 'butter_bridge',
created_at: '2018-11-15T12:21:54.171Z',
comment_count: '13'
}

_converted to_

{Living in the shadow of a great man: 1}

**formatComments** - uses the reference object to manipulate comment data from the data folder to format correctly for the comments table, namely changeing the _*created_by*_ key into an _author_ key and changes the _belongs_to_ key to an _article_id_ key using the reference object.

_Example_

{
body:
'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
belongs_to: 'Living in the shadow of a great man',
created_by: 'butter_bridge',
votes: 14,
created_at: 1479818163389
}

_converted to_

{
body:
'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
article_id: 1,
author: 'butter_bridge',
votes: 14,
created_at: 1479818163389
}

### Spec Test Files

There are two spec files for testing

_Utility Testing Spec_

```bash
npm run test-utils
```

_App Testing Spec_

```bash
npm test
```

### Utility Spec File

**formatDates** - Tests to make sure that the function returns a new array, and converts the timestamp from a unix code to a js date obj and that it converts the time for every object in the array of objects.

**makeRefObj** - Tests to make sure that the original array is not mutated, and that each object in the original array is converted into the reference object with a key of the original title and the a value of the article id.

**formatComments** - Tests to make sure the original array is not mutated, the created_by key is changed to be called author and the belongs to key is replaced with the article id key.

### App Testing Spec

Checks all expected and unexpected endpoints to make sure that expected values are returned and that only the desired data can be inputted. Also tests to make sure that if erronius data is inputted, an error is thrown back to the user to explaining the error.

### Hosted

Hosted Using Heroku - https://dashboard.heroku.com/apps/northcoders-backend-project

### Built With

- pg
- express
- chai
- mocha
- supertest
- chai-sorted
- knex

### Acknowledgments

Built under guidance and with help from the whole Northcoders Team
