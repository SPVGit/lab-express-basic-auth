// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();
const Client = require('../models/Client.model');
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {
  isClientLoggedIn,
  isClientLoggedOut,
} = require('../middleware/route.guard');

router.get('/clientSignup',isClientLoggedOut,(req, res) => res.render('auth/client-signup'));

router.post('/clientSignup',isClientLoggedOut, (req, res, next) => {
    const { clientname, email, password } = req.body;
       const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/client-signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        if (!clientname || !email || !password) {
          res.render('auth/client-signup', { errorMessage: 'All fields are mandatory. Please provide your clientname, email and password.' });
          return;
        }
        else{
          return Client.create({
            clientname,
            email,
            passwordHash: hashedPassword
          })
          .then(clientFromDB => {
            console.log('Newly created client is: ', clientFromDB);
            res.redirect('/private')
          })
          .catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/client-signup', { errorMessage: error.message });
            } 
            else if (error.code === 11000) {
              res.status(500).render('auth/client-signup', {
                 errorMessage: 'clientname and email need to be unique. Either clientname or email is already used.'
              })
            }
            else {
                next(error);
            }
          })
        }
      })
  });

router.get('/private',isClientLoggedIn, (req, res) => {
  res.render('clients/client-profile', { clientInSession: req.session.currentClient });
})

router.get('/clientLogin', isClientLoggedOut,(req, res) => res.render('auth/client-login'));

router.post('/clientLogin', isClientLoggedOut,(req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/client-login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  Client.findOne({ email })
    .then(client => {
      if (!client) {
        res.render('auth/client-login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, client.passwordHash)) {
        req.session.currentClient = client;
      
        res.redirect('/private');
      } else {
        res.render('auth/client-login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/clientLogout',isClientLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/main');
  })
});




module.exports = router;