from dotenv import load_dotenv
import os
import resend

load_dotenv(".env") # load environment variables from .env file
resend.api_key = os.getenv("RESEND_API_KEY")   #set the Resend API key 

#send an email to the user with a code that they can use to log in
def send_mfa_email(to_email: str, code: str):
    params = {
    "from": "onboarding@resend.dev",
    "to": ["elandlosydriss@gmail.com"],    #recipient email address, I put my personal email for testingsince we don t have a verified domain yet.
    "subject": "Your MFA Code",             #once we have a verified domain we will change it to [to_email]
    "html": f"<h1>{code}</h1>",
    }
    resend.Emails.send(params)