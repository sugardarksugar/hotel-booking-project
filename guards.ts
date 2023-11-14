import { Request, Response, NextFunction } from 'express';

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.session?.['username']) {
        next();
    } else {
        res.redirect('/index.html');
    }
}