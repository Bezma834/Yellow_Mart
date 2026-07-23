import { Router, Request, Response } from "express"


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



export default router
