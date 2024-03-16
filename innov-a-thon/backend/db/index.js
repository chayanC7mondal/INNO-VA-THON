const mongoose = require("mongoose")
const axios = require("axios")
const cheerio = require("cheerio")




async function realTimeNews(apiKey){
try{
    const response = await axios.get("https://newsapi.org/v2/top-headlines?country=in",{
        params:{
            country : "in",
            apiKey : apiKey,
        }
    })

    const newsData = response.data
    return newsData
}catch(error){
    console.error("Errror fetching news : ",error)
    throw error
}
}

const apiKey = "fb861f847d2b477591c8df1c5e48f554";
realTimeNews(apiKey)
.then(async newsData => {
    console.log('Fetched News Data:',newsData)
    await saveNewsToDatabase(newsData)
    console.log("News data saved to the database")
})
.catch((error) => {
   console.log("error in fetching or saving news data : ",error)
})







mongoose.connect("mongodb+srv://dharadarsh0:Ad23adarsh@cluster0.hilwbtv.mongodb.net/")
.then(() => {
    console.log("mongodb is connected")
})
.catch(() => {
    console.log("error connecting to mongodb",error)
})



const userSchema = new mongoose.Schema({
    email : {
      type : String,
      required : true
    },
    password : {
        type : String,
        required : true
      },
    points : {
        type : Number,
        default : 0
    }
    
})

const newsSchema = new mongoose.Schema({
    source: {
        id: String,
        name: String
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    
    url: {
        type: String,
        required: true
    },
    publishedAt: Date
});

const quizSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    description: String,
    answers: {
        answer_a: String,
        answer_b: String,
        answer_c: String,
        answer_d: String,
        answer_e: String,
        answer_f: String
    },
    multiple_correct_answers: {
        type: Boolean,
        default: false
    },
    correct_answers: {
        answer_a_correct: Boolean,
        answer_b_correct: Boolean,
        answer_c_correct: Boolean,
        answer_d_correct: Boolean,
        answer_e_correct: Boolean,
        answer_f_correct: Boolean
    },
    correct_answer: String,
    explanation: String,
    tip: String,
    tags: [{
        name: String
    }],
    category: String,
    difficulty: String
});

async function saveNewsToDatabase(newsData) {
    try {
        for (const newsItem of newsData.articles) {
            const { title, description, url, publishedAt, source } = newsItem;
            const news = new News({
                source,
                title,
                description,
                url,
                publishedAt
            });
            await news.save();
            console.log(`Saved news article: ${title}`);
        }
    } catch (error) {
        console.error("Error saving news to database:", error);
        throw error;
    }
}






const User = mongoose.model("User",userSchema)
const News = mongoose.model("News",newsSchema)

const Quiz = mongoose.model("Quiz",quizSchema)


module.exports = {
    User,News,Quiz
}