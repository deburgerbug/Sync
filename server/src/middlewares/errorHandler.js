import { ZodError } from "zod";

function errorHandler (err, req, res, next){
    console.log(err)

    // Handle invalid JSON payloads from body-parser/raw-body
    if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload',
            details: err.message
        });
    }

    if(err instanceof ZodError){
        return res.status(400).json({
            success : false,
            message : 'Validation failed',
            errors  : err.issues.map((e)=>({field: e.path[0], message: e.message}))
        })
    }
    const statusCode = err.statusCode || 500;
    const message  = err.message || 'Internal Server Error' ;

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorHandler;