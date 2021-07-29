const db = require('../models');
const jwt = require('jsonwebtoken');
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator =require("../utils/jwtGenerator")

// for development only
exports.getUsers = async (req, res, next) => {
  try {
    const users = await pool.query("SELECT * FROM Candidates");

    return res.status(200).json(users.rows);
  } catch (err) {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { _id, username,role,password } =req.body

    console.log(req.body);
    
    // const user = await db.User.create(req.body);
    const sqluser = await pool.query("SELECT * FROM Candidates WHERE user_name = $1", [
      username
    ]);

    if (sqluser.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO Candidates (user_name,user_password,user_roles) VALUES ($1, $2,$3) RETURNING *",
      [username, bcryptPassword,role]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    // const token = jwt.sign({ _id, username}, process.env.SECRET);

    return res.status(201).json({
      _id,
      role,
      username,
      jwtToken,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Sorry, that username is already taken';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // const user = await db.User.findOne({
    //   username: req.body.username,
    // });

   

    const user = await pool.query("SELECT * FROM Candidates WHERE user_name = $1", [
      username
    ]);

    console.log(user.rows);


   
    // const valid = await user.comparePassword(req.body.password);

    // if (valid) {
    //   const token = jwt.sign({ id, username }, process.env.SECRET);
    //   return res.status(200).json({
    //     id,
    //     username,
    //     token,
    //   });


    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }


    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

  

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    console.log(jwtToken);
    return res.json({
      jwtToken });
  } catch (err) {
    return next({ status: 400, message: 'Invalid Username/Password' });
  }
};
