### Todo list project
This is a project for creating a todo application from start to finish (full stack). We will create a Rest API and a front-end UI to interact with it. The project is divided into 5 parts:

- Part 1: Creating a Rest API with Node.js and Express
- Part 2: Creating a front-end UI with React and connecting to the API
- Part 3: Adding a database to the API so that the todo Items will persist
- Part 4: Adding authentication to the API and users making every user have their own todo list 
- Part 5: Extending the front-end UI to support authentication and users

## Part 1: Creating a Rest API with Node.js and Express
In this part we will create a Rest API with Node.js and Express. We will focus solely on the "todoItem" entity. We will create a simple todo application that will have the following features:

- Get all todoItems 
- Get a single todoItem (by id)
- Create a todoItem
- Update a todoItem (by id)
- Delete a todoItem (by id)

Setup a new Node.js project and install express, read how you can create endpoints (routes) and how to support the above functionality. For starters we will have a fake "dummy" todoItems array in our code and we will use that to add, update or delete our todoItems. (We will add a database in part 3)
Use the following structure for your todoItem:

```javascript
{
  id: "1", // unique id (random number)
  text: "Buy milk", // text of the todoItem
  isCompleted: false // boolean indicating if the todoItem is completed or not
}
```

Make sure your API has a good structure and good practices.
- Use correct HTTP verbs depending on functionality (GET, POST, PUT, DELETE)
- Structure your endpoint paths (e.g. /api/todoItems) using the RESTful convention (https://restfulapi.net/resource-naming/)
- Validate the request body (if needed) the library Joi is your friend
- Include a default 404 handler (if a route is not found)
- Include a default error handler (if an error occurs)


## Part 2: Creating a front-end UI with React and connecting to the API
In this part we will create a front-end UI with React. We will connect to the API we created in part 1. We will create a simple todo application that will have the following features:

- Display all todoItems
- A form to create a new todoItem
- A form to update a todoItem (for every todoItem)
- A button to delete a todoItem (for every todoItem)
- A button to mark the todoItem as done (for every todoItem)
- If a todoItem is done it should be displayed with a line-through

Make sure your UI has a good structure and good practices.
More importantly try to bundle your HTTP requests in one file. Since you will be connecting to one API (your own from part 1) it is a good idea to create a helper file that will contain all your HTTP requests. This will make it easier to maintain and change your API in the future. (e.g. if you change the API path from /api/todoItems to /api/todoItems2 you will only have to change it in one place).

if you are using axios you could take a look at `axios.create()` functionality to add baseURL and headers to your requests.

This means that instead of using HTTP requests like this: 
```
axios.get("http://localhost/api/todoItems").then(res => res.data)
```
you will use your helper file like this:
```
import todoAPI from "./todoAPI";
todoAPI.getTodoItems()
```

## Part 3: Adding a database to the API so that the todo Items will persist
In this part we will add a database to the API so that the todo Items will persist. We will use MongoDB as our database. We will use Mongoose as our ODM (Object Document Mapper). The difference is that MongoDB is the actual database where as Mongoose is just a library we use to connect and interact with MongoDB.

To simplify things we will use MongoDB Atlas. This is a cloud service that will host our database for us. It is free to use for small projects. You can read more about it here: https://www.mongodb.com/cloud/atlas

Connect to your MongoDB with mongoose and start creating your models. You need to create a TodoItemSchema with the help of mongoose and then export it as a model. You can read more about it here:

- Schemas: https://mongoosejs.com/docs/guide.html
- Models: https://mongoosejs.com/docs/models.html

Now change all the functionality that you had with the endpoints you already create and replace it with the database. This means that you will have to change your endpoints to use the database instead of the dummy array.
Your front-end should not be affected at all the final results should be the same but the only difference is now any changes you make will be stored in the DB.

## Part 4: Adding authentication to the API and users making every user have their own todo list
Now we will continue into more advanced topics. We will add authentication to the API and users making every user have their own todo list. We will a simple token for authentication. We will use bcrypt for hashing passwords. 

We will use the following structure for our user:

```javascript
{
  id: "1", // unique id (random number)
  username: "user1", // username of the user
  password: "password", // hashed password of the user
}
```

You now need to add the following functionality to your API:
- User registration
- User login
- User logout

When a user logsIn he should get a token in return. Token is nothing more than just some random Numbers. when you create a token you need to save that token together with the user id that it is related to. This token must be unique! (you can use uuid for that). When a user logsOut you need to delete that token from the database. 

When accessing the todoItems you need to check if the user is logged in. To do that the front-end needs to send the token in the "authorization" header. You then check if that token exists in the database. If it does then the user is logged in and you can return the todoItems. If it doesn't then the user is not logged in and you should return an error.

When a user is logged in he should be able to access his todoItems. This means that when a user is logged in and he tries to access the todoItems he should only get the todoItems that are related to him. This means that you need to add a userId field to your todoItem and when you create a todoItem you need to add the userId of the user that created it.

## Part 5: Extending the front-end UI to support authentication and users
In this part we will extend the front-end UI to support authentication and users. We will add the following functionality to the front-end:

- Login form
- Register form
- Logout button

Make sure to now send the token you get when a user logsIn with every request so that your server knows that you are logged in!