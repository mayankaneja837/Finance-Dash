import { Request,Response,NextFunction } from "express";

export class AppError extends Error {
    constructor(
        public statusCode:number,
        message:string,
        public errors?: string[]
    ){
        super(message)
    }
}

export const notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    })
}

export const errorHandler = (
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message,
            ...(err.errors ? { errors: err.errors } : {})
        })
    }

    console.error(err)

    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}
