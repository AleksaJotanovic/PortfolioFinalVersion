import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';



export const verifyToken = (req, res, next) => {
    const userToken = req.cookies.access_token;
    const customerToken = req.cookies.customer_token;

    if (customerToken && !userToken) {
        jwt.verify(customerToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(CreateError(403, "Token is not valid..."));
            } else {
                req.user = user;
            }
            next();
        });
    } else if (!customerToken && userToken) {
        jwt.verify(userToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(CreateError(403, "Token is not valid..."));
            } else {
                req.user = user;
            }
            next();
        });
    } else if (!customerToken && !userToken) {
        return next(CreateError(401, "Neither customer or user authenticated..."));
    } else if (customerToken && userToken) {
        jwt.verify(customerToken, process.env.JWT_SECRET, (err1, user1) => {
            if (err1) {
                return next(CreateError(403, "Customer token is not valid..."));
            }
            jwt.verify(userToken, process.env.JWT_SECRET, (err2, user2) => {
                if (err2) {
                    return next(CreateError(403, "User token is not valid..."));
                }
                req.user = { ...user1, ...user2 };
                next();
            });
        });
    }
};



export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.roleName === "Admin") {
            next();
        } else {
            return next(CreateError(404, "You are not authorized..."));
        }
    })
};


export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.roleName === "Admin") {
            next();
        } else {
            return next(CreateError(404, "You are not authorized..."));
        }
    })
};