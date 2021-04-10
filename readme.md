# CS4411 Group Assignment

## Setup
Before running the application create a file in the project root called `config.json` with the following markup:
```JSON
{
	"mysql": {
		"database": DATABASE_NAME_HERE,
		"host": ADDRESS_OF_DATABASE,
		"user": USERNAME_OF_DATABASE_USER,
		"password": USERS_PASSWORD
	},
	"postgres": {
		"database": DATABASE_NAME_HERE,
		"host": ADDRESS_OF_DATABASE,
		"user": USERNAME_OF_DATABASE_USER,
		"password": USERS_PASSWORD
	}
}
```
This will be used to connect to each database.

## Running the Application
To run the application run `npm install` in the project directory, then `node index.js`