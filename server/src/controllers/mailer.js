import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import 'dotenv/config';


let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  };

  let transporter = nodemailer.createTransport(nodeConfig);

  let MailGenerator = new Mailgen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:'https://mailgen.js/'
    }
  })

  export const registerMail = async(req,res)=>{
   try{   
     const {username,userEmail,text,subject} = req.body;

    //body of email
    var email = {
        body:{
            name:username,
            intro:text||' hy buddy! this is kuldeep here!',
            outro:'This is a mern login project we will love to get the reply of mail.'
        }
    }
    var emailBody = MailGenerator.generate(email);
    let message = {
        from :process.env.EMAIL,
        to:userEmail,
        subject:subject ||"signed up successfully",
        html:emailBody
    }

    await transporter.sendMail(message);
    res.status(200).json({"msg":"you should have received email from us."});
    }
    catch(error){
        console.log(error);
        res.status(501).json({error});
    }

  }
  
