//Assignment 4: Rest API - Fetch
const fetch = require('node-fetch'); 

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

// the main page with visitorId cookie (asignment-3)

// app.get('/', (req, res) => {
//   let lastVisit = req.cookies.visited;
//   let visitorId = req.cookies.visitorId;
//   let nextVisitorId = 1;

//   if (lastVisit) {
//     lastVisit = (parseInt((Date.now() - req.cookies.visited)/1000));
//   }
//   else {
//     lastVisit = -1;
//   }
//   if (lastVisit >= 0) {
//     msg = "It has been " + lastVisit+" seconds since your last visit!";
//   }
//   else {
//     msg = "You have never visited before, Welcome to this site!";
//   }
//   if (visitorId === undefined) {
//     visitorId =  nextVisitorId++;
//   }
//   else {
//     visitorId =  req.cookies.visitorId;
//   }

//   res.cookie('visitorId', visitorId);
//   res.cookie('visited', Date.now().toString());
//   res.render('welcome', {
//         name: req.query.name || "World",
//         date: new Date().toLocaleString(),
//         lastVisit : lastVisit ,
//         visitorId : visitorId,
//         msg: msg
//       });
// }); 

//Assignment-4 Trivia API get
//ASYNC
// app.get("/trivia", async (req, res) => {
//   // fetch the data
//   const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

//   // interpret the body as json
//   const content = await response.json();

//   // TODO: make proper html
//   const format = JSON.stringify(content, 2);

//   // respond to the browser
//   // TODO: make proper html
//   res.send(JSON.stringify(content, 2));
// });

//Error Handeling
app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // response structurte: "results":[{"category":"Entertainment: Television","type":"multiple","difficulty":"medium","question":"What actor portrays Hogan "Wash" Washburne in the TV Show Firefly?","correct_answer":"Alan Tudyk","incorrect_answers":["Adam Baldwin","Nathan Fillion","Sean Maher"]}]
 
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const incorrectAnswers = content['results'][0]['incorrect_answers'];
  const correctAnswer = content['results'][0]['correct_answer'];
  const answers = incorrectAnswers;
  answers.splice(getRandomInt(answers.length+1), 0, correctAnswer);
  // console.log(answers)
  

  const answerLinks = answers.map(answer => {
    return `<a href="javascript:alert('${
      answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
      }')">${answer}</a>`
  })
  
  
  data = {
          'response_code' : content['response_code'],
          'category' : content['results'][0]['category'],
          'difficulty' : content['results'][0]['difficulty'],
          'question' :  content['results'][0]['question'],
          'answers' : answerLinks
          
          
  }

  // fail if db failed
  if (data.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }


  // respond to the browser
  // TODO: make proper html
  // res.send(JSON.stringify(content, 2));
  res.render('trivia', data);
});

