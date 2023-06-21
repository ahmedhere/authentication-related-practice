const express = require("express");
const userDAL = require("../controller/userDAL");
const router = express.Router();
const handler = new userDAL("mongodb://127.0.0.1:27017/authDB");

router.post("/register", (req, res) => {
  const { register } = req.body;
  if (register) {
    const { name, username, password } = register;
    if (name && username && password) {
      handler
        .addUser({ name, username, password })
        .then((data) => {
          if (data.success) {
            res.json(data);
          } else {
            res.send("User already exists");
          }
        })
        .catch((err) => {
          res.send(Error);
        });
    } else {
      res.send("Fill out complete required details");
    }
  } else {
    res.send("Name, Username, Pasword is required");
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    handler
      .verify({ username, password })
      .then((data) => {
        if (data.success) {
          if (data.result === false) {
            return res.send("Invalid username and password");
          }
          req.session.user_id = data.result._id;
          res.json("Successfully logged in");
        }
        if (data.error) {
          res.send(data.error);
        }
      })
      .catch((e) => res.send(e));
  } else {
    res.send("Username and Password is required to get logged in");
  }
});

router.put("/profile/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (id.length === 24) {
    if (name) {
      handler.updateProfile(id, { name }).then((data) => {
        if (data.success) {
          if (data.result) {
            res.json(data.result);
          } else {
            res.send("Id is not correct");
          }
        } else {
          res.send(data.error);
        }
      });
    } else {
      res.send("Name is not available in the request");
    }
  } else {
    res.send("User ID is not correct");
  }
});

router.put("/changePassword/:id", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (id.length === 24) {
    if (password) {
      handler.updatePassword(id, { password }).then((data) => {
        if (data.success) {
          if (data.result) {
            res.json(data.result);
          } else {
            res.send("Id is not correct");
          }
        } else {
          res.send(data.error);
        }
      });
    } else {
      res.send("Password is not available in the request");
    }
  } else {
    res.send("User ID is not correct");
  }
});

module.exports = router;
