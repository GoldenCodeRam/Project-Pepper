/* eslint-disable require-jsdoc */
import nodemailer from 'nodemailer';

function sendMail(serverName: string, date: number) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lowenherz.test@gmail.com',
      pass: 'test.lowenherz',
    },
  });

  const mailOptions = {
    from: 'lowenherz.test@gmail.com',
    to: 'luis.quiroga01@uptc.edu.co',
    subject: 'Laboratory 2: Load Balancing - Server down!',
    text: `The server: ${serverName} is down at ${new Date(date).toUTCString()}! Do something!`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent:' + info.response);
    }
  });
}

export {
  sendMail,
};
