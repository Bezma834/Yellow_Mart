import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import dns from "dns"
import pool from "../db/db"
import { sendEmail, FRONTEND_URL } from "../config/mailer"
import { OAuth2Client } from "google-auth-library"
const router = Router()


const JWT_SECRET =
process.env.JWT_SECRET || "secret"

const GOOGLE_CLIENT_IDS = [
"353855053860-khcclj6auvae5enurefp0b4g6nd1fcf2.apps.googleusercontent.com",
"353855053860-8po57mngnlgrd7m0moniht4bor8jdo37.apps.googleusercontent.com"
]

const GOOGLE_CLIENT_ID =
process.env.GOOGLE_CLIENT_ID ||
GOOGLE_CLIENT_IDS[0]


const googleClient =
new OAuth2Client(GOOGLE_CLIENT_ID)


// ==============================
// EMAIL HELPERS
// ==============================

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const hashValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex")

const generateToken = () =>
  crypto.randomBytes(32).toString("hex")

const isValidEmailFormat = (email: string) =>
  EMAIL_FORMAT.test(email)

// Real existence check: the domain must have MX records
// (or at least an A record) so mail can actually be delivered.
const emailHasMailServer = async (email: string) => {
  const domain = email.split("@")[1]
  try {
    const mx = await dns.promises.resolveMx(domain)
    if (mx.length > 0) return true
    const a = await dns.promises.resolve4(domain)
    return a.length > 0
  } catch {
    return false
  }
}


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



    if (!isValidEmailFormat(email)) {

      return res.status(400).json({
        message: "Please enter a valid email address"
      })

    }



    const mailServerExists =
      await emailHasMailServer(email)

    if (!mailServerExists) {

      return res.status(400).json({
        message: "This email address does not exist. Please use a real, working email."
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
          role,
          email_verified
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)

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
          "user",
          true
        ]
      )



    const user =
      result.rows[0]



    return res.json({

      user,

      emailVerified: true,

      message: "Account created successfully. You can now log in."

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

        audience: GOOGLE_CLIENT_IDS

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
// CHECK EMAIL
// ==============================

router.post("/check-email", async (req, res) => {

  try {

    const { email } = req.body

    if (!email || !isValidEmailFormat(email)) {

      return res.status(400).json({
        valid: false,
        message: "Please enter a valid email address"
      })

    }

    const mailServerExists = await emailHasMailServer(email)

    return res.json({
      valid: mailServerExists,
      message: mailServerExists
        ? "Email looks good"
        : "This email address does not exist. Please use a real, working email."
    })

  } catch (error:any) {

    console.error("Check Email Error:", error)

    return res.status(500).json({
      valid: false,
      message: "Could not verify email. Please try again."
    })

  }

})

// ==============================
// FORGOT PASSWORD
// ==============================

router.post("/forgot-password", async (req, res) => {

  try {

    const { username, email } = req.body

    if (!username || !email || !isValidEmailFormat(email)) {

      return res.status(400).json({
        message: "Please enter your username and a valid email address"
      })

    }

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      AND username = $2
      `,
      [email, username]
    )

    const user = result.rows[0]

    const resetToken = generateToken()
    const resetTokenHash = hashValue(resetToken)
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000)

    if (user) {

      await pool.query(
        `
        UPDATE users
        SET
          reset_token_hash = $1,
          reset_token_expires_at = $2
        WHERE id = $3
        `,
        [resetTokenHash, resetExpiry, user.id]
      )

      const resetLink =
        `${FRONTEND_URL}/reset-password?token=${resetToken}`

      await sendEmail({
        to: user.email,
        subject: "Reset your Yellow Mart password",
        text:
          `Hi ${user.fullname || user.username},\n\n` +
          `We received a request to reset your password.\n\n` +
          `Click the link below to choose a new password (valid for 1 hour):\n\n` +
          `${resetLink}\n\n` +
          `If you did not request this, you can safely ignore this email.`,
        html:
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">` +
          `<h2 style="color:#111827;margin:0 0 12px">Reset your password</h2>` +
          `<p style="color:#4b5563;font-size:15px;line-height:1.6">We received a request to reset your Yellow Mart password. Click the button below to choose a new one. The link is valid for 1 hour.</p>` +
          `<a href="${resetLink}" style="display:inline-block;background:#f59e0b;color:#111827;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;margin:16px 0">Reset Password</a>` +
          `<p style="color:#9ca3af;font-size:13px">If you did not request this, you can safely ignore this email.</p>` +
          `</div>`
      })

    }

    return res.json({
      message: "If an account exists with these details, a reset link has been sent to the account's email."
    })

  } catch (error:any) {

    console.error("Forgot Password Error:", error)

    return res.status(500).json({
      message: "Could not send reset link. Please try again."
    })

  }

})

// ==============================
// RESET PASSWORD
// ==============================

router.post("/reset-password", async (req, res) => {

  try {

    const { token, password } = req.body

    if (!token || !password) {

      return res.status(400).json({
        message: "Token and new password are required"
      })

    }

    if (password.length < 6) {

      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })

    }

    const tokenHash = hashValue(String(token).trim())

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE reset_token_hash = $1
      `,
      [tokenHash]
    )

    const user = result.rows[0]

    if (!user) {

      return res.status(400).json({
        message: "Invalid or expired reset link"
      })

    }

    if (
      !user.reset_token_expires_at ||
      new Date(user.reset_token_expires_at) < new Date()
    ) {

      return res.status(400).json({
        message: "This reset link has expired. Please request a new one."
      })

    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        reset_token_hash = NULL,
        reset_token_expires_at = NULL
      WHERE id = $2
      `,
      [hashedPassword, user.id]
    )

    await sendEmail({
      to: user.email,
      subject: "Your Yellow Mart password was changed",
      text:
        `Hi ${user.fullname || user.username},\n\n` +
        `Your Yellow Mart password was successfully changed.\n\n` +
        `If you did not make this change, please contact support immediately.`,
      html:
        `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">` +
        `<h2 style="color:#111827;margin:0 0 12px">Password Changed</h2>` +
        `<p style="color:#4b5563;font-size:15px;line-height:1.6">Your Yellow Mart password was successfully changed.</p>` +
        `<p style="color:#4b5563;font-size:15px;line-height:1.6">If you did not make this change, please contact support immediately.</p>` +
        `</div>`
    })

    return res.json({
      message: "Password reset successfully. You can now log in."
    })

  } catch (error:any) {

    console.error("Reset Password Error:", error)

    return res.status(500).json({
      message: "Could not reset password. Please try again."
    })

  }

})



// ==============================
// EXPORT ROUTER
// ==============================

export default router