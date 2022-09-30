import jwt from 'jsonwebtoken';

const generateToken = (sub: string) => {
  // new Date().setDate(new Date().getDate() + 1)
  // new Date().setHours(new Date().getHours() + 168)
  const durationTime = new Date().setDate(new Date().getDate() + 1);

  return jwt.sign(
    {
      iss: process.env.ISSUER,
      sub: sub,
      iat: new Date().getTime(),
      exp: durationTime,
    },
    process.env.TOKEN_SECRET,
  );
};

export default generateToken;
