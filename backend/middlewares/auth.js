const admin = require("../firebase");
const User = require("../models/user");


exports.authCheck = async (req, res, next) => {
   console.log('TOKEN: ' + req.headers.authtoken); // token
 
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    console.log("AUTH CHECK entrato", req.user)
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  console.log("AUTH CHECK ADMIN", email);

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};




