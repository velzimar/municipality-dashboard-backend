const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
    /*try
    {*/
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token,'adminsecret',function(err,decoded){
        if(err){
            jwt.verify(token,'superadminsecret',function(err,decoded){
                if(err){
                    res.status(401).json({
            
                        message: 'auth failed'
                    });
                }
                else{
                    req.userData = decoded ;
                    next(); 
                }
            })
        }
        else {
            req.userData = decoded ;
            next();  
        }
    });
    /*console.log(decoded)
    req.userData = decoded ;
    next();
    //}
    /*catch (error)
    {*/
        /*res.status(401).json({
            
            message: 'admin auth failed'
        });*/
    //}*/


}