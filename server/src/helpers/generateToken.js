import jwt from "jsonwebtoken";

// Use user id to generate token
const generateToken = (id) => {
  // Token must return as a string
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
