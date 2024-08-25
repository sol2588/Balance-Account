import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "./database";
import { collection, addDoc } from "firebase/firestore";
