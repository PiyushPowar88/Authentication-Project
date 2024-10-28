import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// Create a Mailtrap client instance
export const mailtrapClient = new MailtrapClient({
  endpoint: process.env.MAILTRAP_ENDPOINT, // Ensure this is set correctly
  token: process.env.MAILTRAP_TOKEN,
});

// Define the sender details
export const sender = {
  email: "hello@demomailtrap.com", // You can keep this or change it to the other sender
  name: "Piyush",
};



