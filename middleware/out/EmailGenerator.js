"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
/* eslint-disable require-jsdoc */
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendMail(serverName, date) {
    const transport = nodemailer_1.default.createTransport({
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
        }
        else {
            console.log('Email sent:' + info.response);
        }
    });
}
exports.sendMail = sendMail;
