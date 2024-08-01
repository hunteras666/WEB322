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
const legoData = require('./modules/legoSets');
const app = express();

const HTTP_PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/lego/addSet', async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render('addSet', { themes });
  } catch (err) {
    res.status(500).render('500', { message: `Error fetching themes: ${err.message}` });
  }
});

app.post('/lego/addSet', async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect('/lego/sets');
  } catch (err) {
    res.status(500).render('500', { message: `Error adding set: ${err.message}` });
  }
});

app.get('/lego/editSet/:num', async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.num);
    const themes = await legoData.getAllThemes();
    res.render('editSet', { set, themes });
  } catch (err) {
    res.status(404).render('404', { message: `Set not found: ${err.message}` });
  }
});

app.post('/lego/editSet', async (req, res) => {
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect('/lego/sets');
  } catch (err) {
    res.status(500).render('500', { message: `Error updating set: ${err.message}` });
  }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
  try {
    await legoData.deleteSet(req.params.num);
    res.redirect('/lego/sets');
  } catch (err) {
    res.status(500).render('500', { message: `Error deleting set: ${err.message}` });
  }
});

app.get('/lego/sets', async (req, res) => {
  try {
    const sets = req.query.theme ? 
      await legoData.getSetsByTheme(req.query.theme) : 
      await legoData.getAllSets();
    res.render('sets', { sets });
  } catch (err) {
    res.status(404).render('404', { message: `Error fetching sets: ${err.message}` });
  }
});

app.get('/lego/sets/:num', async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.num);
    res.render('set', { set });
  } catch (err) {
    res.status(404).render('404', { message: `Set not found: ${err.message}` });
  }
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).render('404', { message: "Page not found." });
});

// Initialize data and start server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.error(`Failed to initialize data: ${err.message}`);
  });

