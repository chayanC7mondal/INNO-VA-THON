const jwt = require("jsonwebtoken")
const jwtPassword= "user"
const {User} = require("../db/index")



// Middleware for handling auth
async function userMiddleware (req, res, next) {
    const {email,password} = req.headers
    const token = signJwt(email,password)

    try{
        const finduser = await User.findOne({ password})
    const verified = verifyJwt(token,jwtPassword)

        if(!finduser){
            req.status(401).json({error : "couldn't find the user"})
        }
            if(!token) {
                return res.satus(401).json({error : "invalid email or password"})
            }
            if(!verified){
                return res.satus(401).json({error : "invalid token"})
            }

         else {
            req.user = finduser
            console.log(req.user)


            next()
        }
    }catch(error){
        res.status(500).json({error : "Internal Server Error"})
    }
    

    



  

    
}

function signJwt(email , password) {
    
   

    if(password < 6){
        return null
    }

    const payload = { email,password }

    const token = jwt.sign(payload ,jwtPassword)
        
        
    return token
}

function verifyJwt(token,jwtPassword) {
    try {
        jwt.verify(token,jwtPassword)
    console.log("password is verified")
    return true

    } catch (error) {
        console.log("some error in your credentials")
        return false
    }
}


module.exports = userMiddleware;