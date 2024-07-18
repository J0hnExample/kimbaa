# **Express Debugging Server and Endpoints**

- ### Quick Guide:
- 9229 Debugging Port
- 3000 Http Port

- ### Server start:
- npm start
- ### server close:
- Terminal "strg" + "C"


## **Table of Contents**

- [supertests](#supertests)
- [dotenv](#dotenv)
- [Debugging Express Node.js with VS Code](#debugging-express-nodejs-server-with-visual-studio-code)
- [Ports](#port-and-connection)
- [Endpoints Routing](#endpoints-routing)


## supertest @types/supertest:
Supertest is an assertion library specifically designed for testing HTTP servers in Node.js. It provides a high-level abstraction for testing HTTP, making it easy to write assertions against server responses and ensuring that endpoints behave as expected.

```typescript
import supertest from 'supertest';
import app from '../app'; // assuming your Express app is exported from 'app.ts'

describe('Testing Express debugging server', () => {
  it('should return 200 OK for GET request to /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  // Add more test cases as needed
});
```

## dotenv
Using dotenv for Environment Variables
The dotenv package is essential for loading environment variables from a .env file into Node.js applications. It's crucial to bind and call the dotenv.config() function as early as possible during the application startup process. This ensures that environment variables stored in the .env file are available throughout the application.

In your index.ts (or the main entry point of your application), import dotenv and call dotenv.config() as the first operation:

```typescript
import dotenv from "dotenv";
dotenv.config();
```

By loading dotenv and calling dotenv.config() early in your application's startup process, you ensure that environment variables are properly loaded before any other modules or components are initialized. This allows you to access these variables throughout your application, enabling secure and flexible configuration management.

```
#at serverstart
DB_CONNECTION_STRING=memory
HTTP_PORT=3000
```

## Debugging Express Node.js Server with Visual Studio Code
Introduction
Debugging Node.js servers is crucial for identifying and resolving issues efficiently during development. In our project setup, Node.js is started in a debug mode, allowing us to connect a debugger to it and inspect its behavior. This wiki provides a brief overview of how to debug the Node.js server using Visual Studio Code (VSCode).

### Starting the Server in Debug Mode
Node.js is configured to listen for debugger requests on port 9229. This allows us to attach a debugger to an already running Node.js instance. In the .vscode/launch.json file, a launch configuration named "Debug server" is prepared. This configuration connects to the running Node.js server on port 9229 without starting a new instance. Additionally, the configuration is set up to automatically reconnect the debugger upon server restart.

### Using the VSCode Debugger
To start debugging the Node.js server, follow these steps:

- Open the **"Run and Debug"** view in VSCode.  
- Select the **"Debug server"** launch configuration.  
- Click on **"Start Debugging"** (or use the shortcut key **F5**).  
- VSCode will connect the debugger to the Node.js server.  
- Set breakpoints in your code where you want the debugger to pause execution.  
- Perform actions in your application that trigger the code paths with breakpoints.  
- The debugger will pause at the breakpoints, allowing you to inspect variables and step through the code.  
- Stopping Debugging  

### To stop debugging, use one of the following methods:  

- Click the stop button in the VSCode toolbar.  
- Use the **"Run** **>** **Stop Debugging"** menu option.  
- Press the shortcut key **F5** again.  


When starting the debugger, you may encounter a strange breakpoint initially. You can safely ignore this breakpoint and allow the program to continue running. It's   recommended to avoid displaying code coverage information during debugging to minimize distractions.  


## Port and Connection

### Port 3000: Frontend Development Server
Port 3000 is commonly used as the default port for serving frontend assets during development. In our project, this port is utilized by the React development server (react-scripts start) to host the frontend application. When you run npm start or yarn start to start the development server, it listens for incoming HTTP requests on port 3000. This allows you to view and interact with the frontend interface in your web browser.

### Port 9229: Debugging Server
Port 9229 is used for debugging purposes within the Node.js environment. When you run the Node.js application with the --inspect flag, it enables the built-in V8 inspector debugger, which listens for incoming connections on port 9229 by default. As frontend developers, you may not directly interact with this port, but it's essential to understand its role, especially when troubleshooting backend-related issues.


## Endpoints Routing

##User

|Route | Methode | Request-Body / JSON Instance | Response-Body, JSON Instanc|
|:-----|:--------|:----------------------------:|:---------------------------|
|/api/user/alle|Get|-|UserResource|
| /api/user/getOnestudentId/:studentId| GET     | -                                                                          | UserResource                  |
| /api/user/getOneEmail/:email        | GET     | -                                                                          | UserResource                  |
| /api/user/create                    | POST    | { "name": "string", "password": "string", "studentId": "string", "email": "string" } | UserResource                  |
|:-----|:--------|:----------------------------:|:---------------------------|
|:-----|:--------|:----------------------------:|:---------------------------|

##Login

|Route | Methode | Request-Body / JSON Instance | Response-Body, JSON Instanc|
|:-----|:--------|:----------------------------:|:---------------------------|
|/api/login/|post|-|-|
|:-----|:--------|:----------------------------:|:---------------------------|
|:-----|:--------|:----------------------------:|:---------------------------|
|:-----|:--------|:----------------------------:|:---------------------------|
|:-----|:--------|:----------------------------:|:---------------------------|
|:-----|:--------|:----------------------------:|:---------------------------|

