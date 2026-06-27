import { ZodError } from "zod";

function errorHandler (err, req, res, next){
    console.log(err)

    if(err instanceof ZodError){
        return res.status(400).json({
            success : false,
            message : 'Validation failed',
            errors  : err.erros.map((e)=>({field: e.path[0], message: e.message}))
        })
    }
    const statusCode = err.statusCode || 500;
    const message  = err.message || 'Internal Server Error' ;

    res.status(statusCode).json({
        message,
    });
};

export default errorHandler;