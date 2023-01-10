// Importing Connection from module
const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require("dotenv");
// Register Module
// module.exports.register = (req, res) => {
//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;
//     // Checking mail in db
//     emailCheckQuery = `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(email)});`
//     db.query(emailCheckQuery, async (err, result) => {
//         if (result.length) {
//             // Sending error response
//             return res.status(409).json({ msg: 'The email ID  already exist', errType: 'email' })
//         } else {
//             const usernameQuery = `SELECT * from users WHERE LOWER(username) = LOWER(${db.escape(username)})`;
//             db.query(usernameQuery, async (err, result) => {
//                 if (result.length) {
//                     return res.status(409).json({ msg: 'The username already exist', errType: 'username' })
//                 } else {
//                     // User ID is available
//                     const salt = await bcrypt.genSalt(10);  // Generating salt
//                     const hasedPassword = bcrypt.hashSync(password, salt)  //Generating hased Password
//                     // Password is hased
//                     // Adding email, hassed password to db
//                     addUserQuery = `INSERT INTO users (email,password,username,role,is_active) VALUES (${db.escape(email)},${db.escape(hasedPassword)},${db.escape(username)},${req.body.assignedRole === undefined ? null : req.body.assignedRole},'1')`
//                     db.query(addUserQuery, (err, result) => {
//                         if (err) {
//                             // sending error response
//                             res.status(400).json({ msg: err })
//                             throw err;
//                         }
//                         // sending success resposne
//                         return res.status(200).json({ msg: "You have been registered successfully", user: { id: result.insertId } })
//                     })
//                 }

//             })

//         }
//     })
// }

// Login Module
module.exports.login = (req, res) => {
  // getting data from request
  const username = req.body.username;
  const password = req.body.password;

  // Checking email in db
  const loginQuery = `SELECT * FROM users WHERE username = ${db.escape(username)}`;
  db.query(loginQuery, (err, result) => {
    if (err) {
      console.log(err);
      // sending error
      res.status(400).send({ msg: err });
    }
    if (!result.length) {
      // checking if email exists in db
      return res.status(401).json({ msg: "No account under that username" });
    } else {
      // checking password for the email
      bcrypt.compare(password, result[0]["password"], (bErr, bResult) => {

        if (bErr) {
          // sending error message
          return res
            .status(401)
            .json({ msg: "Username or Password doesnot match" });
        }
        if (bResult) {
          if (result[0].status == 1) {
            // If password match
            const token = jwt.sign(
              { id: result[0].id, 
                // role: result[0].role
            },
              process.env.SECERT_KEY
            );
            // Sending success repsonse
            return res
              .status(200)
              .cookie("access-token", token)
              .json({
                msg: "Login successful",
                user: {
                  id: result[0].id,
                  // role: result[0].role
                },
              });
          } else {
            return res
              .status(401)
              .json({ msg: "Access to user have been prevoked" });
          }
        } else {
          // sending error response
          return res
            .status(401)
            .json({ msg: "Username and password does not match" });
        }
      });
    }
  });
};



// module.exports.update_user = async (req, res) => {
//     const { id } = req.params;
//     const password = req.body.password;
//     // Checking mail in db
//     let data = {
//         role: req.body.assignedRole,
//         is_active: req.body.is_active
//     };
//     let salt;
//     let hasedPassword;
//     // User ID is available
//     if (password.length) {
//         salt = await bcrypt.genSalt(10);  // Generating salt
//         hasedPassword = bcrypt.hashSync(password, salt)  //Generating hased Password
//         data["password"] = hasedPassword;
//     }
//     // Password is hased
//     // Adding email, hassed password to db
//     const addUserQuery = `UPDATE users SET ? WHERE id=?`
//     db.query(addUserQuery, [data, id], (err, result) => {
//         if (err) {
//             // sending error response
//             res.status(400).json({ msg: err })
//             throw err;
//         }
//         // sending success resposne
//         const token = jwt.sign({ id: result.insertId }, process.env.SECERT_KEY)
//         return res.status(200).cookie('access-token', token).json({ msg: "You have been registered successfully", user: { id: result.insertId } })
//     })
// }

// module.exports.change_password = (req, res) => {
//     const user_id = req.user_id
//     const getPass = `SELECT password from users WHERE id=${user_id}`
//     db.query(getPass, async (err, result) => {
//         if (err) {
//             return res.status(401).json({ msg: "Something went wrong" })
//         } else if (result) {
//             const passwordMatch = await bcrypt.compare(req.body.old_password, result[0]['password'])
//             if (!passwordMatch) {
//                 return res.status(402).json({ msg: "Old Password doesnot match" })
//             }
//             if (passwordMatch) {
//                 const salt = await bcrypt.genSalt();
//                 const hashPassword = bcrypt.hashSync(req.body.new_password, salt)// Generating hashed Password to save in db
//                 const updatePass = `UPDATE users SET password='${hashPassword}' WHERE id=${user_id}`
//                 db.query(updatePass, (err, result) => {
//                     if (err) {
//                         // sending error response
//                         res.status(400).json({ msg: "Uable to change the password" })
//                         throw err;
//                     }
//                     if (result) {
//                         return res.status(200).json({ msg: "Password Changed Successfully" })
//                     }
//                 })
//             }
//         }
//     })
// }
