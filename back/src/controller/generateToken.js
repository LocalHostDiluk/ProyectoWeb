import jwt from "jsonwebtoken";

const ACCESS_SECRET = "secreto";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};
