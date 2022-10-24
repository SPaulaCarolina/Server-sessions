const { createTransport } = require('nodemailer')

const mail = process.env.ADMIN_EMAIL
const sendEmail = (newUser) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: mail,
            pass: 'Huz5Re3NyuXTc46CZA'
        }
    })

    const mailOpt = {
        from: 'Server Node JS',
        to: mail,
        subject: 'Nuevo usuario registrado',
        html: `<h1>Nuevo usuario registrado:<h1>
                <ul>
                    <li>Email: ${newUser.email}</li>
                    <li>Usuario: ${newUser.username}</li>
                    <li>Edad: ${newUser.age}</li>
                    <li>Dirección: ${newUser.adress}</li>
                    <li>Teléfono: ${newUser.phone}</li>`
    }

    transporter.sendMail(mailOpt)
    .then( r => console.log(r) )
    .catch( e => console.log(e) )
}

module.exports = sendEmail;
