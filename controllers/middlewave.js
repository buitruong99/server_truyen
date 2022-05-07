const jwt = require('jsonwebtoken')

const middleware = {
    //verify token
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN,(err, user) => {
                if(err) return res.status(403).json("token is not valid");
                req.user = user;
                next();
            })
        }else{
            res.status(401).json('xin lỗi tài khoảm chưa được xác thực');
        }
    },
    // verify and admin
    verifyTokenAndAdminAuth: (req, res, next) => {
        middleware.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }else{
                res.status(403).json('you are not allowed to delete other')
            }
        })
    } 
}

module.exports = middleware;