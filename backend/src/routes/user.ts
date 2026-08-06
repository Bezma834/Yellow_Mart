import { Router, Request, Response } from "express"
import bcrypt from "bcrypt"
import pool from "../db/db"
import { authMiddleware } from "../middleware/auth"


const router = Router()



router.get("/test",(
req:Request,
res:Response
)=>{

res.json({

message:"User route working"

})

})



router.post(
"/change-password",
(
req:Request,
res:Response
)=>{


res.json({

message:"Change password route working"

})


}

)



// DELETE ACCOUNT
// JWT required; password confirms the deletion is deliberate.
// Google-only users (no stored password) skip the password check.
router.post(
"/delete-account",
authMiddleware,
async (
req:any,
res:Response
)=>{

const client = await pool.connect()

try {

const userId =
  req.user?.id

const {
  password
} = req.body


if (!userId) {

  return res.status(401).json({

    message:"Unauthorized"

  })

}


const userResult =
  await client.query(
    `
    SELECT *
    FROM users
    WHERE id = $1
    `,
    [userId]
  )


const user =
  userResult.rows[0]


if (!user) {

  return res.status(404).json({

    message:"User not found"

  })

}


if (user.password) {

  if (!password) {

    return res.status(400).json({

      message:"Password is required to delete your account"

    })

  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    )

  if (!passwordMatch) {

    return res.status(400).json({

      message:"Incorrect password"

    })

  }

}


// Remove dependent rows first, then the account itself.
await client.query(
  "BEGIN"
)


await client.query(
  `
  DELETE FROM favorites
  WHERE user_id = $1
  `,
  [userId]
)


await client.query(
  `
  DELETE FROM businesses
  WHERE owner_id = $1
  `,
  [userId]
)


await client.query(
  `
  DELETE FROM users
  WHERE id = $1
  `,
  [userId]
)


await client.query(
  "COMMIT"
)


res.json({

  message:"Account deleted successfully"

})

}
catch (err:any) {

  await client.query(
    "ROLLBACK"
  )

  console.error(
    "DELETE ACCOUNT ERROR:",
    err
  )

  res.status(500).json({

    message:"Failed to delete account. Please try again."

  })

}
finally {

  client.release()

}

}

)



export default router
