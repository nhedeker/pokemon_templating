'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const path = require('path');

const publicPath = path.join(__dirname, 'public');

const pokemonList = require('./utils/pokemon_list');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// INSERT STATIC MIDDLEWARE FUNCTION HERE
app.use(express.static(publicPath));

app.get('/pokemon', (_req, res) => {
  res.render('pages/index', {
    data: pokemonList
  });
});

app.get('/pokemon/:id', (req, res, next) => {
  let id = Number.parseInt(req.params.id);

  if (Number.isNaN(id) || id < 0) {
    next();
  }

  let pokemonToRender = 0;
  for (const pokemon of pokemonList) {
    if (id === pokemon.id) {
      pokemonToRender = pokemon;
      break;
    }
  }

  if (!pokemonToRender) {
    next();
  }

  res.render('pages/profile', {
    data: pokemonToRender
  });
});

app.use(function(_req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, _req, res, _next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err.status
    });
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}, yo!`);
});
