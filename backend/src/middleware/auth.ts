import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"


export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {


    const header =
      req.headers.authorization



    if (!header) {

      return res.status(401).json({

        error:"No token provided"

      })

    }



    const token =
      header.split(" ")[1]



    if(!token){

      return res.status(401).json({

        error:"Invalid token format"

      })

    }




    const decoded:any =

      jwt.verify(

        token,

        process.env.JWT_SECRET!

      )




    req.user = decoded



    next()



  }

  catch(err){


    return res.status(401).json({

      error:"Invalid token"

    })


  }


}






// ADMIN CHECK

export const adminMiddleware = (

req:any,

res:Response,

next:NextFunction

)=>{


  if(

    req.user?.role?.trim()

    !==

    "admin"

  ){

    return res.status(403).json({

      error:"Admin access required"

    })

  }



  next()


}