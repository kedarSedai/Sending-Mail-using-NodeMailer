const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const expresshbs = require('express-handlebars');

const port = process.env.PORT || 3000;

const app = express();

//View Engine setup
app.engine('handlebars',expresshbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//BodyParser and Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req,res) =>{
    res.render('contact',{layout:false});
});

app.post('/send', async (req, res) =>{
    const output = `
    <h2> Contact Details</h2>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>${req.body.message}</h3>
    `

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "kedar.sedai05@gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'test@traversymedia.com', // generated ethereal user
      pass: '1234567890' // generated ethereal password
    },
    tls:{
        rejectedUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <kedar.sedai05@gmail.com>', // sender address
    to: 'kedar.sedai05@gmail.com', // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render('contact', {msg:'Email has been sent'});

});

app.listen(port, () => console.log(`Server is running at ${port}`));