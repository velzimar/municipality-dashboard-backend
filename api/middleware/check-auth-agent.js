const jwt = require('jsonwebtoken');
module.exports = (req,res,next) =>
{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,'agentsecret',function(err,decoded){
        if (err)
        {
            jwt.verify(token,'adminsecret',function(err,decoded){
                if (err)
                {jwt.verify(token,'superadminsecret',function(err, decoded){
                    if (err)
                    {res.status(401).json({message: 'Auth failed'})}
                    else
                    {
                    req.userData = decoded ;
                    next();
                    }

                })}
                else
                {
                    req.userData = decoded;
                    next();
                }
            })
        }
        else
        {
            req.userData = decoded;
            next();
        }
    })
}