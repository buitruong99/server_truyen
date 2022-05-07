const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
  //register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // create user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      // save to db
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //generate accsessToken
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "360h",
      }
    );
  },
  //generate refreshToken
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
  },
  // Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).json("wrong email");
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) return res.status(404).json("wrong password");
      if (user && validPassword) {
        const accsessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        res.cookie("refreshToken", refreshToken,{
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        })
        refreshTokens.push(refreshToken);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accsessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    // lấy refresh token từ user
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json(' you are not authenticated')
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json('refresh token is not valid')
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if(err){
        console.log(err);
      }
      refreshTokens = refreshTokens.filter(token => token !== refreshToken) 
      const newAccessToken =  authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken)
      res.cookie("refreshToken", newRefreshToken,{
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({accsessToken: newAccessToken});
      
    })
  },
  userLogout: async (req,res) => {
    res.clearCookie("refreshToken")
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(200).json('logout successfully');
  }
};

module.exports = authController;
