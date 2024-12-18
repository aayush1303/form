var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');
require('dotenv').config();

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 500;

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'page/index.html')));

app.get("/", function (req, response) {
    response.sendFile(path.join(__dirname, 'page/index.html'));
});

app.post("/send_email", function (req, response) {
    var email = req.body.email;
    var name = req.body.name;
    var to = "aayushpanwar5178@gmail.com";
    var message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    var mailOptions = {
        from: `"${name}" <${email}>`,
        to: to,
        subject: `Message from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
        replyTo: email,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            response.status(500).send("error");
        } else {
            console.log('Email sent: ' + info.response);
            response.status(200).send("success");
        }
    });
});

server.listen(port, function () {
    console.log('Starting server on port ' + port);
});
