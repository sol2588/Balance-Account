import crypto from "crypto-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "./database";
import { collection, addDoc } from "firebase/firestore";

export function generateSecretKey(password: string) {
  const salt = crypto.lib.WordArray.random(128 / 8);
  const iterations = 1000;
  const secretKey = crypto.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations,
  });
  return secretKey;
}

const secretKey = process.env.SECRET_KEY || "jwt-secret-key";

export function generateToken(id: string) {
  const token = jwt.sign({ userId: id }, secretKey, { expiresIn: "10m" });
  return token;
}
export function refreshToken(token: string) {
  try {
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const newToken = jwt.sign({ userId: decoded.userId }, secretKey, { expiresIn: "10m" });
    return newToken;
  } catch (err) {
    console.log("Error refreshing token:    ", err);
    return err;
  }
}
