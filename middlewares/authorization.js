const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require('../connection')
const cookieParser = require("cookie-parser");
const requireToken = (req, res, next) => {
    const access_token = req.cookies["access-token"];
    if (!access_token) {
        // throwing error
        return res
            .status(401)
            .json({ msg: "Unauthorized Access! Please Login to continue" });
    }
    // verfiying for token
    jwt.verify(access_token, process.env.SECERT_KEY, function (err, decoded) {
        if (err) {
            return res
                .status(403)
                .json({ msg: "Invalid token detected! Please Login to continue" });
        } else {
            req.user_id = decoded.id;
            // req.user_role = decoded.role;
            // sending to next step
            next();
        }
    });
};

const checkToken = (req, res, next) => {
    const token = getToken(req)
    if (!token) {
        // throwing error
        return res
            .status(403)
            .json({ msg: "Invalid token detected! Please Login to continue" });
        // throw new Error("Authorization token is required");
    } else {
        // verfiying for token
        jwt.verify(token, process.env.SECERT_KEY, function (err, decoded) {
            if (err) {
                res.status(400).json({ message: "Login cannot be verified" })
                throw new Error("Error : " + err);
            } else {
                req.user_id = decoded.id
                req.user_role = decoded.role
                // sending to next step
                next()
            }
        });
    }
}

function getToken(req) {
    if (
        // checking for bearer token
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

const checkRole = (requiredRole) => {
    return function (req, res, next) {
        const getQuery = `SELECT name from roles WHERE id=${req.user_role}`;
        db.query(getQuery, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: "Something went wrong" });
            } else if (result) {
                if (result.length) {
                    if (result[0].name === "superadmin") {
                        next();
                    } else {
                        const getQuery = `SELECT p.name from role_with_permission r
          JOIN permission_lists p ON
          r.permission=p.id
          WHERE r.role=${req.user_role} AND p.name='${requiredRole}'
          `;
                        db.query(getQuery, (err, result) => {
                            if (err) {
                                console.log(err)
                                res.status(500).json({ msg: "Something went wrong" });
                            } else if (result) {
                                if (!result.length) {
                                    res.status(401).json({ msg: "Unauthorized Role" });
                                } else {
                                    next();
                                }
                            }
                        });
                    }
                } else {
                    res.status(401).json({ msg: "Unauthorized Role" });

                }
            }
        });
    };
};

module.exports = { requireToken, checkRole, checkToken };