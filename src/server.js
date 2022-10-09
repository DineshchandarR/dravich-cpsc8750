// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

//To allow sever to use public folder
app.use(express.static('public'));

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");

// set the view engine to ejs
app.set('view engine', 'ejs');

//Cookie Parser
app.use(cookieParser());




let nextVisitorId = 1;


// The main page of our website
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// True HTML
// app.get('/', (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <title>An Example Title</title>
//       </head>
//       <body>
//         <h1>Hello, World!</h1>
//         <p>HTML is so much better than a plain string!</p>
//       </body>
//     </html>
//   `);
// });


// The main page of our website with  dynamic html

// //Direct injection

// app.get('/', (req, res) => {
//   // reads the url parameter
//   // http://domain/?name=text
//   const name = req.query.name || "World";

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <title>An Example Title</title>
//         <link rel="stylesheet" href="app.css">
//       </head>
//       <body>
//         <h1>Hello, ${name}!</h1>
//         <p>HTML is so much better than a plain string!</p>
//       </body>
//     </html>
//   `);
// });

// //unsafe way
// const {encode} = require('html-entities');


// app.get('/', (req, res) => {
//   // reads the url parameter
//   // http://domain/?name=text
//   const name = req.query.name || "World";

//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <title>An Example Title</title>
//         <link rel="stylesheet" href="app.css">
//       </head>
//       <body>
//         <h1>Hello, ${encode(name)}!</h1>
//         <p>HTML is so much better than a plain string!</p>
//       </body>
//     </html>
//   `);
// });

// //safer way
// app.get('/', (req, res) => {
//   res.render('welcome', {
//     name: req.query.name || "World",
//   });
// }); 

// //safer way
// app.get('/', (req, res) => {
//   res.render('welcome', {
//     name: req.query.name || "World",
//   });
//   res.cookie('visited', Date.now().toString());
// }); 

// the main page with visitorId cookie

app.get('/', (req, res) => {
  let lastVisit = req.cookies.visited ? (parseInt((Date.now() - req.cookies.visited)/1000)) : -1;
  let visitorId = !req.cookies.visitorId ? nextVisitorId++ : req.cookies.visitorId;
  if (lastVisit >= 0) {
    msg = "It has been " + lastVisit+" seconds since your last visit!";
  }
  else {
    msg = "You have never visited before, Welcome to this site!";
  }


  res.cookie('visitorId', visitorId);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
        name: req.query.name || "World",
        date: new Date().toLocaleString(),
        lastVisit : lastVisit ,
        visitorId : visitorId,
        msg: msg
      });
}); 
