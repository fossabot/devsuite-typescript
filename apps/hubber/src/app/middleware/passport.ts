import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import type { RequestHandler } from 'express';
import db from '../../utils/db';
import logger from '../../utils/logger';

passport.serializeUser((user, cb) => {
    logger.debug(`serializeUser ${typeof user} >> ${JSON.stringify(user)}`);
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.login
        });
    });
});

passport.deserializeUser((user: Express.User, cb) => {
    logger.debug(`deserializeUser ${typeof user} >> ${JSON.stringify(user)}`);
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, cb) => {
    const { web } = req;
    try {
        if (!username || !password)
            return cb(null, false, { message: 'User was not confirmed by remote device.' });
        const existingUser = await db.user.findFirst({
            where: { id: web.userId ?? undefined }
        });
        if (!existingUser)
            return cb(null, false, { message: 'User was not confirmed by remote device.' });
        cb(null, existingUser);
    } catch (error) {
        cb(error);
    }
}));

// export const passportMiddleware = passport.authenticate('session');
export const passportLoginCheckMiddleware: RequestHandler = (req, res, next) => {
    const user = req.user ? req.user.id : null;
    if (user !== null) {
        next();
    } else if (
        req.path === '/users/login' ||
        req.path === '/login/print' ||
        req.path === '/get_repos' ||
        req.path.match(/^\/trpc/) ||
        req.path === '/whoami') {
        next();
    } else {
        res.status(400).json({ status: 'error', message: 'Please login first' });
    }
};