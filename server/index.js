//dynamic server backend

const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit')


const app = express();
//if env variable is setted the connect to that, else localhost
const db = monk(process.env.MONGO_URI || 'localhost/meower');

const mews = db.get('mews'); //collection in db

const filter = new Filter();

app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.json({
        message: 'Meowerrr! 😹'
    });
});

app.get('/mews', (req, res) =>{
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

function isValidMew(mew){
    return mew.name && mew.name.toString().trim() != '' && mew.content && mew.content.toString().trim() != '';
}

//limit here to limit only the posts
app.use(rateLimit({
    windowMs: 15 * 1000, //15 secs
    max: 1 // 1 post every window
}));

app.post('/mews', (req, res) => {

    //if the mew is valid, insert it in the db, else send error
    if(isValidMew(req.body)){
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        console.log(req.body)
        
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });

    }else{
        res.status(422);
        res.json({
            message:'Hey! Name and content are required!'
        });
    }
    
});

app.listen(5000, () =>{
    console.log('listening on http://localhost:5000');
});