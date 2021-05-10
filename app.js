const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const { url } = require("inspector");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(request, respond){

    respond.sendFile(__dirname+"/signup.html")

});


app.post("/", function(request, respond){

    const firstName=request.body.firstName;
    const lastName=request.body.lastName;
    const email=request.body.email;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    const url="https://us1.api.mailchimp.com/3.0/lists/95b306e86b";


    const options={
        method: "POST",
        auth: "harsh1:e9a8d31d0fc55fad030d4f80ec7a9732-us1"
    }

    const req=https.request(url, options, function(response) {


        if(response.statusCode===200){
            respond.sendFile(__dirname+"/success.html");
        }else{
            respond.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

      

    });

    req.write(jsonData);
    req.end();


});




app.post("/failure", function(request, respond){
   respond.redirect("/");
});





app.listen(process.env.PORT  || 3000, function(){
    console.log("Server started at port 3000");
});




//API key:  e9a8d31d0fc55fad030d4f80ec7a9732-us1
//List ID:  95b306e86b