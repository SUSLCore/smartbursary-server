import nodemailer from "nodemailer";

export const sendAccountCreatedEmail = async (
  email: string,
  password: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"SmartBursary" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SmartBursary Account Created",
    html: `
      <h2>Welcome to SmartBursary</h2>
      <p>Your officer account has been created.</p>

      <p><b>Username:</b> ${email}</p>
      <p><b>Temporary Password:</b> ${password}</p>

      <p>Please login and change your password immediately.</p>
    `,
  });
};