//jshint esversion: 6


const express = require("express");//S1
const bodyParser = require("body-parser");//S1
const request = require("request")//S1
const https = require("https")

const app = express(); //S1

app.use(express.static("public")); //S2 - Command to include CSS and Images. Place the desired files into the "public" folder.
app.use(bodyParser.urlencoded({extended: true})); //S3 BodyParser standard use command.

app.get("/", function(req,res) { //S2 - Homepage connected to the signup.html
    res.sendFile(__dirname + "/signup.html")
})

//Start of the post request
app.post("/", function(req,res) { //S3 Programming the post route using bodyparser
    //Callback below

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email= req.body.email;


    // Mailchimp input commands
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    
    const jsonData = JSON.stringify(data); //transforming the data into JSON because mailchimp's format is JSON.

    const url = "https://us14.api.mailchimp.com/3.0/lists/dab4a11468"

    const options = {
        method: "POST",
        auth: "" //Mailchimp API should be added here
    }

   const request = https.request(url, options, function(response) {
        if (response.statusCode === 200 ) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }



        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

}) //Ending of the post request 1

app.post("/failure", function(req, res) {
    res.redirect("/")  
})
//Redirected the /Failure/Try Agaim button to the homepage

app.listen(process.env.PORT || 3000, function() { //S1 ----- huroku port code added.
    console.log("Server port 3000 initiated.")
});



//24ec26bf60f86c0d20e1740b8fd91613-us14
//dab4a11468