import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hasuraRequest } from "../config/hasura";

export const signup = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      mutation InsertUser($email: String!, $password: String!) {
        insert_users_one(object: {
          email: $email,
          password: $password
        }) {
          id
          email
        }
      }
    `;

    const data = await hasuraRequest(query, {
      email,
      password: hashedPassword,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const query = `
      query GetUser($email: String!) {
        users(where: { email: { _eq: $email } }) {
          id
          email
          password
        }
      }
    `;

    const result = await hasuraRequest(query, { email });

    const user = result.data.users[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};