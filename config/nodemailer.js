var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : false,
    port : 25,
    auth : {
        user: "trnghondzweni@gmail.com",
        pass: "tsundzu851620"
    },
    tls : {
        rejectAuthorized : false
    }
});

var helperOptions = function helperOptions(to, subject, message)
{
	var options = {
		from: '"Matcha" <info@matcha.com>',
		to: to,
		subject: subject,
		html: message
	};
	return options;
}

module.exports = {
    transporter : transporter,
    helperOptions : helperOptions
}