const passport = require('passport');
const {
    Strategy
} = require('passport-shraga');
import { config } from './app/shared/config';

const users = [];

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    // tslint:disable-next-line:no-shadowed-variable
    const user = users.filter(user => user.id === id).length > 0 ? users.filter(user => user.id === id)[0] : {};
    cb(null, user);
});

export const configurePassport = () => {
    passport.use(new Strategy({
        // callbackURL: '',
        shragaURL: config.SHRAGA_URL
    }, (profile, done) => {
  //      let length = users.filter(user => user.id === id).length;
  //      if (length === 0)
        users.push(profile);
        done(null, profile);
    }));
};
