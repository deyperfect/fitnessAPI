const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth.js');

module.exports.registerUser = (req, res) => {
    if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
        return res.status(400).send("Invalid email or password should be a string");
    }

    if (!req.body.email.includes('@')) {
        return res.status(400).send("Invalid email format");
    }

    if (req.body.password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters long");
    }
    
    let newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12)
    });

    return newUser.save()
        .then(result => res.status(201).send({ message: "Registered Successfully" }))
        .catch(error => res.status(500).send({ error: "Error registering user" }));
};


module.exports.getUserDetails = (req, res) => {

    return User.findById(req.user.id)
        .then((user) => {
            if(!user) {
                return res.status(404).send("User not found");
            }

            return res.status(200).send({user: user});
        })
    .catch(error => res.status(500).send({ error: "Error geting user details" }));

};

module.exports.userLogin = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email }).select("+password")
      .then((result) => {
        if (!result) {
          return res.status(404).send({error: "No Email Found"});
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password,
          );
          if (isPasswordCorrect) {
            return res.status(200).send({
              access: auth.createAccessToken(result)
            });
          } else {
            return res
              .status(401)
              .send({ error: "Email and password do not match" });
          }
        }
      })
      .catch(error => res.status(500).send({ error: "Error logging in" }));
  } else {
    return res.status(400).send({ error: "Invalid Email" });
  }
};