require('dotenv').config();
import { bootstrapMicroframework } from 'microframework-w3tec';
import { expressLoader } from './loaders/expressLoader';

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
console.log('<<<<<<<<');

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    expressLoader,
  ],
})
  .then(() => console.log(`Application is running`))
  .catch(error => console.log('Application is crashed: ' + error));


