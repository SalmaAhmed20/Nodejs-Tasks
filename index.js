const express = require('express');
require('express-async-errors');
const validator = require('./middleware/validator')
const verify = require('./middleware/verify')
const app = express();
app.use(express.json());
const conn = require('./Database/dbConnection');
const { User } = require("./model/user");
const { Task } = require("./model/todo");
const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const CustomError = require('./helpers/customerr');
const { jwtSecret } = require('./helpers/config');
const { port } = require('./helpers/config');
const cors = require('cors')
const signJwt = promisify(JWT.sign);
//high order function to check required parameters
if (!jwtSecret) throw new CustomError("Something missing")
const checkRequiredField = (params) => (req, res, next) => {
  const receivedParams = Object.keys(req.body);
  console.log(receivedParams)
  const missedParams = params.filter((param) => !receivedParams.includes(param))
  if (missedParams.length) {
    const err = new Error("missing Paramters " + missedParams.join(","));
    err.statusCode = ("400");
    return next(err);
  }
  next();
}
//creat user 
app.post("/", checkRequiredField(['username', 'age', 'password']), async (req, res, next) => {
  const { username, age, password } = req.body;
  try {
    let createUser = new User({
      username,
      age,
      password
    })
    await createUser.save();
    res.send(createUser);
  } catch (err) {
    next(err)
  }
  next()
})

app.post("/login", validator.vaildateSignin, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new CustomError("invalid Cradentials", 400)
    }
    const isMatched = await user.comparedPassword(password);
    if (!isMatched) {
      throw new CustomError("invalid Cradentials", 400)
    }
    const payload = { id: user._id };
    const token = await signJwt(payload, jwtSecret, { expiresIn: '1h' });
    res.json({
      message: "logged in",
      token,
      user
    })
  } catch (err) {
    next(err)
  }
})
app.get('/profile', verify,
  async (req, res, next) => {
    res.json({
      user: req.user,
      message: "profile page"
    })
  })

app.post("/todoList", verify, validator.vaildateCreataTask, async (req, res) => {
  const newTask = new Task(req.body);
  newTask.username = req.user.username;
  newTask.uid = req.user._id;
  if (newTask.title.length >= 3 && newTask.title.length < 20) {
    if (newTask.status === "done" || newTask.status === "in-progress" || newTask.status == "todo") {
      console.log(newTask);
      const result = await newTask.save()
      res.json(result)
    } else {
      throw new CustomError("status must be in todo - in-prograss- done ", 400)
    }
  } else {
    throw new CustomError("Title must be in rang 3 to 20 character ", 400)
  }
});

app.get("/todoList", verify, async (req, res) => {
  const lists = await Task.find()
  res.json(lists)
})

app.get("/todoList/:category", verify, async (req, res) => {
  let keyval = req.params.category;
  let keyvald = keyval.toString().split("=");
  let list = [];
  if (keyvald[0] == "id") {
    list = await Task.findOne({ id: Number(keyvald[1]) });
  } else if (keyvald[0] == "status") {
    list = await Task.findOne({ status: keyvald[1] });
  }
  res.json(list)
})
app.put("/todoList/:id", verify, async (req, res) => {
  const updTask = await Task.findOne({ id: req.params.id });
  if (req.body.title) {
    if (req.body.title.length >= 3 && req.body.title.length < 20) {
      updTask.title = req.body.title
    }
    else {
      throw new CustomError("Title must be in rang 3 to 20 character ", 400)
    }
  }
  if (req.body.status) {
    if (req.body.status === "done" || req.body.status === "in-progress" || req.body.status == "todo") {
      updTask.status = req.body.status;
    }
    else {
      throw new CustomError("status must be in todo - in-prograss- done ", 400)
    }
  }
  await updTask.save();
  res.json(updTask)

})
app.delete("/todoList/:id", verify, async (req, res) => {
  const result = await Task.findOneAndDelete({ id: req.params.id });
  res.json(result)
})

//global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  console.log('from error handler');
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message || 'something went wrong',
    err
  })
});
app.listen(port);