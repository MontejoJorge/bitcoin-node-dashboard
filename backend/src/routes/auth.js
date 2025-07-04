import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async function (req, res, next) {

   const { password } = req.body;

   if (password !== process.env.LOGIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid password' });
   }

   const token = jwt.sign(
      { authenticated: true }, 
      process.env.JWT_SECRET
   );

   res.json({ jwt: token });
});

export default router;
