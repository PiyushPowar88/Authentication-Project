import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";  

// Function to send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification"
    });

    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

// Function to send welcome email
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "997bd5d3-0d7d-4eda-974f-f4e8fb1d7d2c",
      template_variables: {
        "name": name,
        "company_info_name": "Vasundhara Company"
      },
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset"
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset"
    });
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.log(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
