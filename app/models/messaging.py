"""
Models to handle SMS and Email messaging functionalities.

sms:
Uses the sinch API for sms messaging.
https://sinch.redocly.app/docs/sms/getting-started/python/python-send-sms


"""
from abc import ABC, abstractmethod
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from databaseStuff.config import db
from typing import List
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend.env')

class Message(ABC):

    @abstractmethod
    def send_message_to_subscribers(self, sender_id: str, content: str) -> None:
        pass

    @abstractmethod
    def add_subscriber(self, store_id: str, user_id: str) -> None:
        pass
    
    @abstractmethod
    def remove_subscriber(self, store_id: str, user_id: str) -> None:
        pass
    
    @abstractmethod
    def get_all_subscribers(self, store_id: str) -> List[tuple]:
        pass

    @abstractmethod
    def check_subscriber(self, store_id: str, user_id: str) -> bool:
        pass

class Sms_message(Message):

    def send_message_to_subscribers(self, sender_id: str, content: str) -> None:

        service_plan_id = os.getenv("service_plan_id")
        api_token = os.getenv("api_token")
        sinch_number = os.getenv("sinch_number")

        if not service_plan_id or not api_token or not sinch_number:
            raise ValueError("Sinch API credentials do not exist in environment variables.")
        
        url = "https://us.sms.api.sinch.com/xms/v1/" + service_plan_id + "/batches"


        subscribers = db.get_all_subscribers(sender_id)
        for subscriber in subscribers:
            user_id = subscriber[1]
            phone_number = db.get_contact_info(user_id)[2]
            payload = {
                "from": sinch_number,
                "to": [phone_number],
                "body": content
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + api_token
            }

            response = requests.post(url, json=payload, headers=headers)

            # Print response for debugging
            if response.status_code == 200:
                data = response.json()
                print(data)
            else:
                print(f"Error: Failed to send SMS. HTTP Response: {response.status_code} - {response.text}")
        
    def add_subscriber(self, store_id: str, user_id: str) -> None:
        db.add_sms_subscriber(store_id, user_id)
    
    def remove_subscriber(self, store_id: str, user_id: str) -> None:
        db.remove_sms_subscriber(store_id, user_id)

    def get_all_subscribers(self, store_id: str) -> List[tuple]:
        return db.get_all_sms_subscribers(store_id)
    
    def check_subscriber(self, store_id: str, user_id: str) -> bool:
        return db.check_sms_subscriber(store_id, user_id)
    
class Email_message(Message):
    
    def send_message_to_subscribers(self, sender_id: str, content: str) -> None:
        subject = "Update from your subscribed Coffee Shop!"
        sender_email = os.getenv("email_address")
        sender_password = os.getenv("email_password")
        
        if not sender_email or not sender_password:
            raise ValueError("Email credentials do not exist in environment variables.")
        
        subscribers = db.get_all_email_subscribers(sender_id)

        for subscriber in subscribers:
            user_id = subscriber[1]
            email_address = db.get_contact_info(user_id)[1]
            try:
                message = MIMEMultipart()
                message['From'] = sender_email
                message['To'] = email_address
                message['Subject'] = subject

                # Note: Change plain to HTML if you want to send HTML stylized emails.
                message.attach(MIMEText(content, 'plain'))

                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                    server.login(sender_email, sender_password)
                    server.sendmail(sender_email, email_address, message.as_string())
            except Exception as e:
                print(f"Error: Failed sending email to {email_address}: {e}")

    def add_subscriber(self, store_id: str, user_id: str) -> None:
        db.add_email_subscriber(store_id, user_id)
    
    def remove_subscriber(self, store_id: str, user_id: str) -> None:
        db.remove_email_subscriber(store_id, user_id)

    def get_all_subscribers(self, store_id: str) -> List[tuple]:
        return db.get_all_email_subscribers(store_id)
    
    def check_subscriber(self, store_id: str, user_id: str) -> bool:
        return db.check_email_subscriber(store_id, user_id)