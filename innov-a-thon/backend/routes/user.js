const userMiddleware = require("../middlewares/user")
const {User,News,Quiz} = require("../db/index")
const {Router} = require("express")
const router = Router()
const z = require("zod")

const createUserFormSchema = z.object({
  email: z
  .string()
  .min(1, { message: "This field has to be filled." })
  .email("This is not a valid email."),
  password: z.string().min(6),
})





//get user to signin
router.post("/signin", async (req,res) => {
   const {email,password} = req.body
   try {
        createUserFormSchema.parse({email,password})
        const createUser = await User.create({
            email : email,
            password : password
        })
        res.status(201).json(createUser)
        console.log("signin successfull")
      
       
   } catch(error) {
    res.status(500).json({error : "Internal Server Error"})
   }
  
})

//get all news from genre
router.get("/news",userMiddleware, async (req,res) => {
     try{
        const getNews = await News.find()
        if(getNews){
            res.status(201).json(getNews)
        }else{
            res.status(401).json({error : "no news related to this found"})
        }
     }catch(error){
        res.status(500).json({error : "Internal server error"})
     }
})

//show news by clicking the headline


//get quiz
router.get("/quiz",userMiddleware,async (req,res) => {
    try{
       const getAllQuiz = await Quiz.find()
       res.status(201).json(getAllQuiz)
       
    } catch(error){
        res.status(500).json({error : "Internal Server Error"})
    }
}
)





//show the points 
router.put("/quiz",userMiddleware,async(req,res) => {
    const {correctAnswer} = req.body
    try{
        const userEmail = req.user
        const points =await User({email : userEmail}).select("points")
       if(correctAnswer){
          points++;
          res.status(201).json(`new points for the user ${userEmail} is ${points}`)
       } else{
        res.status()
       }
    }catch(error){
       res.status(500).json({error : "Internal server error"})
    }
})








 module.exports = router


