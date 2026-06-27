function errorHandler (err, req, res, next){
    console.log(err)

    const statusCode = 500;
    const message  = err.message || 'Internal Server Error' ;

    res.status(statusCode).json({
        message: "Internal server error"
    });

};

export default errorHandler;