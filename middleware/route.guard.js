// middleware/route-guard.js
// checks if the user is logged in when trying to access a specific page
const isClientLoggedIn = (req, res, next) => {
    if (!req.session.currentClient) {
      return res.redirect('/clientLogin');
    }
    next();
  };
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isClientLoggedOut = (req, res, next) => {
    console.log("Monkey");
    
    if (req.session.currentClient) {
      console.log("Donkey");
      
      return res.redirect('/main');
    }
    next();
  }; 

  module.exports = {
    isClientLoggedIn,
    isClientLoggedOut,
  
  };
  