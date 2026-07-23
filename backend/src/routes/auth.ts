import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../db/db"
import { OAuth2Client } from "google-auth-library"
const router = Router()


const JWT_SECRET =
process.env.JWT_SECRET || "secret"

const GOOGLE_CLIENT_ID =
process.env.GOOGLE_CLIENT_ID


const googleClient =
new OAuth2Client(GOOGLE_CLIENT_ID)


router.post("/signup", async(req,res)=>{



// ==============================
// SIGNUP
// ==============================


  try {


    const {
      username,
      name,
      email,
      password,
      phone,
      avatar
    } = req.body



    if (
      !username ||
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "All fields are required"
      })

    }



    const existing =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        OR username = $2
        `,
        [
          email,
          username
        ]
      )



    if (existing.rows.length > 0) {

      return res.status(400).json({
        message: "User already exists"
      })

    }



    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )



    const result =
      await pool.query(
        `
        INSERT INTO users
        (
          username,
          fullname,
          email,
          password,
          phone,
          avatar,
          role
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7)

        RETURNING
        id,
        username,
        fullname,
        email,
        phone,
        avatar,
        role
        `,
        [
          username,
          name,
          email,
          hashedPassword,
          phone || null,
          avatar || null,
          "user"
        ]
      )



    const user =
      result.rows[0]



    const token =
      jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },

        JWT_SECRET,

        {
          expiresIn: "7d"
        }
      )



    return res.json({

      token,

      user

    })



  }

  catch (error:any) {


    console.error(
      "Signup Error:",
      error
    )


    return res.status(500).json({

      message:
        error.message ||
        "Signup failed"

    })

  }

})
// ==============================
// LOGIN
// ==============================

router.post("/login", async (req, res) => {

  try {


    const {
      email,
      password
    } = req.body



    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        message:
          "Email and password are required"

      })

    }



    const result =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        OR username = $1
        `,
        [
          email
        ]
      )



    if (result.rows.length === 0) {

      return res.status(400).json({

        message:
          "User not found"

      })

    }



    const user =
      result.rows[0]



    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      )



    if (!passwordMatch) {

      return res.status(400).json({

        message:
          "Incorrect password"

      })

    }



    const token =
      jwt.sign(

        {
          id: user.id,

          email: user.email,

          role: user.role

        },

        JWT_SECRET,

        {
          expiresIn: "7d"
        }

      )



    return res.json({

      token,


      user: {

        id: user.id,

        username: user.username,

        fullname: user.fullname,

        email: user.email,

        avatar: user.avatar,

        phone: user.phone,

        bio: user.bio,

        role: user.role

      }

    })



  }

  catch (error:any) {


    console.error(
      "Login Error:",
      error
    )


    return res.status(500).json({

      message:
        error.message ||
        "Login failed"

    })


  }


})
// ==============================
// GOOGLE LOGIN
// ==============================

router.post("/google", async (req, res) => {

  try {


    const {
      token
    } = req.body



    if (!token) {

      return res.status(400).json({

        message:
          "Google token missing"

      })

    }



    const ticket =
      await googleClient.verifyIdToken({

        idToken: token,

        audience: GOOGLE_CLIENT_ID

      })



    const payload =
      ticket.getPayload()



    if (!payload) {

      return res.status(400).json({

        message:
          "Invalid Google token"

      })

    }



    const email =
      payload.email



    const fullname =
      payload.name ||
      "Google User"



    const avatar =
      payload.picture ||
      null



    if (!email) {

      return res.status(400).json({

        message:
          "Google email not found"

      })

    }



    // Check if user already exists

    const existing =
      await pool.query(

        `
        SELECT *
        FROM users
        WHERE email = $1
        `,

        [
          email
        ]

      )



    let user



    if (existing.rows.length > 0) {


      user =
        existing.rows[0]


    }

    else {


      const username =
        email.split("@")[0]



      const result =
        await pool.query(

          `
          INSERT INTO users
          (
            username,
            fullname,
            email,
            avatar,
            role
          )

          VALUES
          ($1,$2,$3,$4,$5)

          RETURNING *
          `,

          [
            username,
            fullname,
            email,
            avatar,
            "user"
          ]

        )



      user =
        result.rows[0]


    }



    const jwtToken =
      jwt.sign(

        {
          id: user.id,

          email: user.email,

          role: user.role

        },

        JWT_SECRET,

        {
          expiresIn: "7d"
        }

      )



    return res.json({

      token: jwtToken,


      user: {

        id: user.id,

        username: user.username,

        fullname: user.fullname,

        email: user.email,

        avatar: user.avatar,

        role: user.role

      }

    })



  }

  catch (error:any) {


    console.error(
      "GOOGLE LOGIN ERROR:",
      error
    )


    return res.status(500).json({

      message:
        "Google login failed"

    })


  }


})



// ==============================
// EXPORT ROUTER
// ==============================

export default router