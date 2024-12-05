import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@cashkr.com",
    pass: "NoReply@1212@CK",
  },
});


export async function EmailVerification(
  email: string,
  verificationCode: number
) {
  const logo =
    "https://cashkr.blr1.cdn.digitaloceanspaces.com/Cashkr-Logo/logo.png";

  const htmlTemplate = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rental Service OTP Verfication</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 20px;
        color: #1c1e21;
        line-height: 1.34;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        margin-bottom: 24px;
      }
      .header img {
        width: 40px;
        height: 40px;
      }
      .content {
        margin-bottom: 24px;
        font-size: 17px;
      }
      h1 {
        font-size: 17px;
        margin: 0;
        padding: 0;
        font-weight: normal;
      }
      .code-container {
        background-color: #f0f2f5;
        border-radius: 6px;
        padding: 12px 24px;
        margin: 16px 0;
        display: inline-block;
        border: 1px solid #e4e6eb;
      }
      .code {
        font-size: 24px;
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
          monospace;
        letter-spacing: 1px;
        color: #050505;
      }
      .footer {
        color: #65676b;
        font-size: 13px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #ced0d4;
      }
      .footer a {
        color: #1877f2;
        text-decoration: none;
      }
      .footer p {
        margin: 8px 0;
      }
      .footer strong {
        color: #050505;
      }
      .meta-logo {
        width: 60%;
        margin-top: 8px;
        color: #65676b;
      }
      .address {
        color: #8a8d91;
        font-size: 11px;
        margin-top: 12px;
      }
      .security-notice {
        color: #65676b;
        font-size: 13px;
        margin-top: 8px;
      }
      .header2 {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logo}" alt="Rental Logo" />
      </div>
      <hr style="opacity: 30%; margin-top: 8px; margin-bottom: 8px" />
      <div class="content">
        <h1>Hi ${email},</h1>
        <p>We received a request to verify your email address.</p>
        <p>Enter the following code to verify your email :</p>
        <div class="code-container">
          <span class="code">${verificationCode}</span>
        </div>

        <hr style="opacity: 30%; margin-top: 8px; margin-bottom: 20px" />
        <div class="meta-logo">
          <div class="header2">
            <img height="25px" width="25px" src="${logo}" alt="Rental Logo" />
            <strong style="margin-left:4px;">Rental Service</strong>
          </div>
        </div>
        <p class="address">© Rental Inc., Attention: Community Support</p>
        <p class="security-notice">This message was sent to ${email}</p>
      </div>
    </div>
  </body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: '"Rental Service" <noreply@cashkr.com>',
      to: email,
      subject: "Otp Verification Code",
      text: `${verificationCode} is your Rental Service Otp Verification Code.`,
      html: htmlTemplate,
      
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
