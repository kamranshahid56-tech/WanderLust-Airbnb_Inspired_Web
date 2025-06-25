module.exports.signup = async (req, res, next) => {
    try{
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to the app!");
      res.redirect("/listings");
    });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  }

module.exports.renderSignupForm = (req,res,next)=>{
    res.render("users/signup.ejs")
}

module.exports.renderLoginForm = (req, res, next) => {
    res.render("users/login.ejs");
  }

module.exports.login =  async(req, res, next) => {
    // Successful authentication, redirect to the original URL or default
    const redirectTo = res.locals.redirectTo || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(redirectTo);
  }

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      } 
      req.flash("success", "Goodbye!");
      res.redirect("/listings");
    });
  }