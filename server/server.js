import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt.toLowerCase();
    let response;
    const phrases = {
      // 'who are you': 'I am Hashem',
      // '9': '9',
      // 'من قام بصنعك': 'الشخص الذي قام بصنعي هو هاشم شكرا جزيلا لة',
      // 'اسمك اية': 'هاشم محمد محمود رمضان',
      // 'اسمك ايه': 'هاشم محمد محمود رمضان',
      // 'hi':'hi hashim',
      // 'السلام عليكم' :'وعليكم السلام ورحمة اللة وبركاتة',
      //  'اهلا':' اهلا بيك منور',
      //  'من انت':'انا هاشم ',
      // 'انا هنام':'تصبح علي خير وانا كمان هنام 😂' ,
      // 'هل تعرف فارس':'نعم اسمة فارس رجب فوزي ابراهيم',
      // 'هل تعرف السكشن':'نعم 44',
      // 'هل تعرف عمره':'نعم عمرة 20 كان عيد ميلادة قريب كل سنة وهوا طيب سلملي علية ',
      // 'هل تعرف اين يدرس':'نعم يدرس في معهد الدلتا العالي ',

      
      
       
    }
    

    for (const [phrase, reply] of Object.entries(phrases)) {
      if (prompt.match(new RegExp(phrase))) {
        response = reply;
        break;
      }
    }

    if (!response) {
      response = (await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      })).data.choices[0].text;
    }

    res.status(200).send({
      bot: response
    });
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
});


app.listen(5000, () => console.log('AI server started on http://localhost:5000'))