const passport = require("passport");
const {
    Strategy
} = require("passport-shraga");

let users = [];

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    const user = users.filter(user => user.id === id).length > 0 ? users.filter(user => user.id === id)[0] : {};
    cb(null, user);
});


export const configurePassport = () => {
    passport.use(new Strategy({}, (profile, done) => {
  //      let length = users.filter(user => user.id === id).length;
  //      if (length === 0)
        users.push(profile);
        done(null, profile);
    }))
}