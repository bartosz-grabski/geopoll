var nodemailer = require('nodemailer');
var emailConfig = require('./emailConfig.json');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views/email');


var defaultTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.send = function (templateName, locals, fn) {
    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            return fn(err);
        }

        template(templateName, locals, function (err, html, text) {
            var transport = defaultTransport;
            transport.sendMail({
                from: emailConfig.defaultFromAddress,
                to: locals.email,
                subject: locals.subject,
                html: html,
                text: text
            }, function (responseStatus) {
                if (err) {
                    return fn(err);
                }
                return fn(null, responseStatus, html, text);
            });
        });
    });
};

