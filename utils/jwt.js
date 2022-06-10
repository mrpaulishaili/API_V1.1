import jwt from "jsonwebtoken";

//HEAD: create the JWT
export const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  return token;
};

//HEAD: A helper function for checking the token value
export const isTokenValid = ({ token }) =>
  jwt.verify(token, process.env.JWT_SECRET);

//HEAD: A helper function for attaching the cookie to the response
export const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24; // *milliseconds for a day

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
