const process = require("process");
const fs = require("fs");
const os = require("os");
const cron = require("node-cron");
const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();
app.use(express.json());

// cron.schedule("*/15 * * * * *", function () {

//     console.log('1111');
//     let heap = process.memoryUsage().heapUsed / 1024 / 1024;
//     let date = new Date().toISOString();
//     const freeMemory = Math.round((os.freemem() * 100) / os.totalmem()) + "%";

//     //                 date | heap used | free memory
//     let csv = `${date}, ${heap}, ${freeMemory}\n`;

//     // storing log In .csv file
//     fs.appendFile("demo.csv", csv, function (err) {
//         if (err) throw err;
//         console.log("server details logged!");
//     });
// });


//send email after 1 minute
cron.schedule("*/1 * * * *", function () {
    // mailService();
    console.log('done');
});

function mailService() {
    console.log('process.env.emai_user', process.env.emai_user);
    let mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "gmail",
        auth: {
            user: process.env.emai_user,
            // use generated app password for gmail
            pass: process.env.password,
        },
    });


    // setting credentials
    let mailDetails = {
        from: process.env.emai_user,
        to: "<---->@mapmyindia.com",
        subject: "Test Mail using Cron Job",
        text: `Testing Scheduling  ${new Date().toLocaleTimeString()}`,
    };

    // sending email
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log("error occurred", err.message);
            let date = new Date().toLocaleDateString();
            let csv = `${date},'==', ${err} \n`;
            fs.appendFile("errorLog.csv", csv, function (err) {
                if (err) throw err;
            });
        } else {
            console.log("email sent successfully");
        }
    });
}

app.post('/test', async (req, res) => {
    try {
        // mailService();
        const body = req.body.body;
        if (body) {
            res.status(200).send("ok")
        }
        else {
            let date = new Date().toLocaleTimeString();
            let csv = `Time = ${date},'Endpoint =/test', Error  ${'body not present'} \n`;
            fs.appendFile("errorLog.csv", csv, function (err) {
                if (err) throw err;
            });
            res.json("error")
        }
    } catch (error) {
        let date = new Date().toLocaleDateString();
        let csv = `${date},'==', ${error} \n`;
        fs.appendFile("demo.csv", csv, function (err) {
            if (err) throw err;
        });
        res.status(500).send('error')
    }
})


module.exports = app;