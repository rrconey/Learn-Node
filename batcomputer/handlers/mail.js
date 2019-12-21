const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

transport.sendMail({
    from: 'Roscoe <rrconey@gmail.com',
    to: 'pizza@SpeechGrammarList.com',
    subject: 'payment is owed',
    html: 'Hey where is my <strong>money</strong>!',
    text: '????'
});

const generateHTML = (filename, options={}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options)
    const inlined = juice(html)
    return inlined
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options)
    const text = html.ToText.fromString(html)
    const mailOptions = {
        from: 'Roscoe <rrconey@gmail.com>',
        subject: options.subject,
        to: options.user.email,
        html,
        text
    }
    const sendMail = promisify(transport.sendMail, transport)
    return sendMail(mailOptions)

}