import nodemailer from 'nodemailer';



export const contact = async (req, res, next) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });
        const mailDetails = {
            from: req.body.email,
            to: process.env.APP_EMAIL,
            subject: `${req.body.name} sent us a portfolio!`,
            html: `
            <div>
            <p>${req.body.message}</p>
            <br/><br/>
            <a href="${req.body.portfolio}">${req.body.portfolio}</a>
            </div>
            `,
        };

        mailTransporter.sendMail(mailDetails, async (err) => {
            if (err) {
                console.log('Contact message error: ', err);
            }
        });
    } catch (error) {
        console.log("Error catched while sending status mail", error);
    }
};