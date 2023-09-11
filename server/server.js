import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';

dotenv.config();
const app = express();

// Middleware
// Direct express to serve static files
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(helmet.dnsPrefetchControl({ allow: true }));
// app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors());

app.use(routes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port 127.0.0.1:${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port 127.0.0.1:${PORT}`);
    })
  })
  .catch((error) => { console.log(error.message) });

const middlewareNote = `

## 3.2. Express Middleware

Express middleware are functions that execute during the lifecycle of a request to the Express server. Each middleware has access to the request and response objects and can perform tasks such as:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

### 3.2.1. Built-in Middleware

Express has a set of built-in middleware functions that can be used for common tasks. These functions are exposed by the express module.

####
- express.static(root, [options])
- express.json([options])
- express.urlencoded([options])
- express.text([options])
- express.raw([options])
- express.Router([options])

### 3.2.2. Custom Middleware

Custom middleware are functions that you write to handle tasks that are not provided by the built-in middleware functions. These functions can be added to the application to:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

`;
