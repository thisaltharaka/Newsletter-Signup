const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//mailchimp configuration
mailchimp.setConfig({
  apiKey: 'c16221e10c00713a17d1b7b166869b51-us9',
  server: 'us9',
});
// List ID
const listId = "eb5151b52b";


app.get("/", function(req, res){

  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req,res){

  var firstName =req.body.firstName;
  var lastName =req.body.lastName;
  var email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });

  // console.log(
  //   `Successfully added contact as an audience member. The contact's id is ${
  //     response.status
  //   }.`
  if(response.status=="subscribed"){
    return res.sendFile(__dirname + "/success.html");

  }
  if(response.status==400){
    //send({ error: [{ msg: "bad credentials" }] });
    res.sendFile(__dirname + "/failure.html");
  }
}


  run();



});

app.post("/failure", function(req,res){

  res.redirect("/");
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
if(port==3000){
  console.log("Server started on port 3000");
}
});



//API Key
//c16221e10c00713a17d1b7b166869b51-us9

//Audiance ID
//eb5151b52b



//Testing mailchimp
//async function callPing() {
//  const response = await mailchimp.ping.get();
//  console.log(response);
///}

//callPing();
