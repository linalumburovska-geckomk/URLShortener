
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const shortUrl = require('./models/shortUrl')
app.use(bodyParser.json());
app.use(cors({optionSuccessStatus: 200})); 


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/shorturl/:url", function (req, res) {
    var urlToShorten = req.params.url;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = expression;
    if(regex.test(urlToShorten)===true){
        var short = Math.floor(Math.random()*100000).toString();
        var data = new shortUrl({
            "original_url": urlToShorten, 
            "short_url": short
        })  
        data.save(err => {
            if(err){
                return res.send('Error');
            }
        })

        return res.json(data);
    }
    else {
        return res.json({"error":"invalid URL"});
    }
});

app.get('/api/:urlToForward', function(req,res){
    var urlToForward = req.params.urlToForward;

    shortUrl.findOne({short_url: urlToForward}, (err, data) =>{
        if(err){
            return res.send('Error reading database');
        }else {
            res.redirect(301, 'http://'+data.original_url);
        }
    })

})


app.listen(3000, function () {
  console.log('Your app is listening on port 3000');
});