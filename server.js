/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: _____Rajesh Sah_________________ Student ID: ___175281211___________ Date: __2024 june 25th____________

*Published URL: _______https://github.com/hunteras666/WEB322__
********************************************************************************/

// server.js
const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Set EJS as the view engine

legoData.initialize()
  .then(() => {
    app.get('/', async (req, res) => {
      try {
        res.render('home');
      } catch (error) {
        console.error('Error serving home.ejs:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
      }
    });

    app.get('/about', (req, res) => {
      res.render('about');
    });

    app.get('/lego/sets', (req, res) => {
      const theme = req.query.theme;
      if (theme) {
        legoData.getSetsByTheme(theme)
          .then(sets => {
            res.render('sets', { sets });
          })
          .catch(error => {
            res.status(404).send('Error: Failed to get sets by theme.');
          });
      } else {
        legoData.getAllSets()
          .then(sets => {
            res.render('sets', { sets });
          })
          .catch(error => {
            res.status(404).send('Error: Failed to get all sets.');
          });
      }
    });

    app.get('/lego/sets/:id-demo', (req, res) => {
      const setNum = req.params['id-demo'];
      legoData.getSetByNum(setNum)
        .then(set => {
          if (set) {
            res.render('set', { set });
          } else {
            res.status(404).send('Error: Set not found.');
          }
        })
        .catch(error => {
          res.status(404).send('Error: Failed to get set by number.');
        });
    });

    // Handle 404 errors
    app.use((req, res, next) => {
      res.status(404).render('404');
    });

    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error('Error initializing Lego data:', error);
  });
