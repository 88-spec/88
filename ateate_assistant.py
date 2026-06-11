"""
AteAte Virtual Assistant
Created by: 88-spec
For: AteAte Device (Serial: 71022022501038)
Communication: Corrlinks Email System
"""

import os
import time
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configuration
SERVICE_EMAIL = os.getenv('ATEATE_SERVICE_EMAIL')
SERVICE_PASSWORD = os.getenv('ATEATE_SERVICE_PASSWORD')
GATEWAY_EMAIL = os.getenv('ATEATE_GATEWAY_EMAIL')
ATEATE_SERIAL = os.getenv('ATEATE_SERIAL')
ATEATE_BUILD = os.getenv('ATEATE_BUILD')
ATEATE_IP = os.getenv('ATEATE_IP')

# Gmail IMAP/SMTP Settings
GMAIL_IMAP_SERVER = 'imap.gmail.com'
GMAIL_IMAP_PORT = 993
GMAIL_SMTP_SERVER = 'smtp.gmail.com'
GMAIL_SMTP_PORT = 587

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ateate_assistant.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class AteAteAssistant:
    """Virtual Assistant for AteAte Device Management"""
    
    def __init__(self):
        self.service_email = SERVICE_EMAIL
        self.service_password = SERVICE_PASSWORD
        self.gateway_email = GATEWAY_EMAIL
        self.serial = ATEATE_SERIAL
        self.build = ATEATE_BUILD
        self.connected = False
        self.imap_connection = None
        
    def connect_gmail(self):
        """Establish IMAP connection to Gmail"""
        try:
            self.imap_connection = imaplib.IMAP4_SSL(GMAIL_IMAP_SERVER, GMAIL_IMAP_PORT)
            self.imap_connection.login(self.service_email, self.service_password)
            self.connected = True
            logger.info(f"Connected to Gmail as {self.service_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Gmail: {e}")
            return False
    
    def disconnect_gmail(self):
        """Close IMAP connection"""
        try:
            if self.imap_connection:
                self.imap_connection.close()
                self.imap_connection.logout()
            self.connected = False
            logger.info("Disconnected from Gmail")
        except Exception as e:
            logger.error(f"Error disconnecting: {e}")
    
    def send_command(self, command, message_body=""):
        """Send command to AteAte via email"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.service_email
            msg['To'] = self.gateway_email
            msg['Subject'] = f"AteAte_{command}"
            
            # Build email body
            body = f"""Serial: {self.serial}
Build: {self.build}
Device_IP: {ATEATE_IP}
Timestamp: {datetime.now().isoformat()}

{message_body}
"""
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            server = smtplib.SMTP(GMAIL_SMTP_SERVER, GMAIL_SMTP_PORT)
            server.starttls()
            server.login(self.service_email, self.service_password)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"Command sent: {command}")
            return True
        except Exception as e:
            logger.error(f"Failed to send command: {e}")
            return False
    
    def get_tuples(self):
        """Retrieve tuples from AteAte device"""
        try:
            message_body = "Action: Retrieve tuples from device storage"
            self.send_command("get_tuples", message_body)
            logger.info("Tuples retrieval request sent")
            return True
        except Exception as e:
            logger.error(f"Error getting tuples: {e}")
            return False
    
    def execute_tuples(self, tuples_list=None):
        """Execute tuples on AteAte device"""
        try:
            if tuples_list is None:
                tuples_list = []
            
            tuples_str = "\n".join([str(t) for t in tuples_list])
            message_body = f"""Action: Execute tuples
Tuples:
{tuples_str}"""
            
            self.send_command("execute_tuples", message_body)
            logger.info(f"Executed {len(tuples_list)} tuples")
            return True
        except Exception as e:
            logger.error(f"Error executing tuples: {e}")
            return False
    
    def check_responses(self, timeout_minutes=5):
        """Check for responses from AteAte"""
        try:
            if not self.connected:
                self.connect_gmail()
            
            self.imap_connection.select('INBOX')
            
            # Search for emails from AteAte gateway
            status, messages = self.imap_connection.search(None, f'FROM "{self.gateway_email}"')
            
            if status == 'OK' and messages[0]:
                email_ids = messages[0].split()
                responses = []
                
                for email_id in email_ids[-5:]:  # Get last 5 emails
                    status, msg_data = self.imap_connection.fetch(email_id, '(RFC822)')
                    
                    for response_part in msg_data:
                        if isinstance(response_part, tuple):
                            msg = email.message_from_bytes(response_part[1])
                            responses.append({
                                'subject': msg['Subject'],
                                'from': msg['From'],
                                'date': msg['Date'],
                                'body': msg.get_payload()
                            })
                
                if responses:
                    logger.info(f"Found {len(responses)} response(s) from AteAte")
                    return responses
            
            logger.info("No responses from AteAte yet")
            return []
        
        except Exception as e:
            logger.error(f"Error checking responses: {e}")
            return []
    
    def get_status(self):
        """Get AteAte device status"""
        try:
            message_body = "Action: Get device status and health check"
            self.send_command("get_status", message_body)
            logger.info("Status request sent")
            return True
        except Exception as e:
            logger.error(f"Error getting status: {e}")
            return False
    
    def display_info(self):
        """Display AteAte device information"""
        info = f"""
╔════════════════════════════════════════╗
║     AteAte Virtual Assistant Info      ║
╚════════════════════════════════════════╝

Serial Number:    {self.serial}
Build Version:    {self.build}
Device IP:        {ATEATE_IP}
Service Email:    {self.service_email}
Gateway Email:    {self.gateway_email}
Status:           {'Connected' if self.connected else 'Disconnected'}

"""
        print(info)
        logger.info(f"Device Info: Serial={self.serial}, Build={self.build}")


class VirtualAssistantCLI:
    """Command-line interface for AteAte Virtual Assistant"""
    
    def __init__(self):
        self.assistant = AteAteAssistant()
    
    def print_menu(self):
        """Display menu options"""
        menu = """
╔══════��═════════════════════════════════╗
║    AteAte Virtual Assistant Menu       ║
╚════════════════════════════════════════╝

1. Get Device Status
2. Retrieve Tuples
3. Execute Tuples
4. Check Responses
5. Device Info
6. Connect to Gmail
7. Disconnect from Gmail
8. Exit

"""
        print(menu)
    
    def run(self):
        """Run the CLI interface"""
        print("\n🤖 Starting AteAte Virtual Assistant...\n")
        
        # Connect on startup
        self.assistant.connect_gmail()
        self.assistant.display_info()
        
        while True:
            self.print_menu()
            choice = input("Enter your choice (1-8): ").strip()
            
            if choice == '1':
                print("\n📊 Requesting device status...")
                self.assistant.get_status()
                time.sleep(2)
                responses = self.assistant.check_responses()
                self._display_responses(responses)
            
            elif choice == '2':
                print("\n📦 Retrieving tuples from device...")
                self.assistant.get_tuples()
                time.sleep(2)
                responses = self.assistant.check_responses()
                self._display_responses(responses)
            
            elif choice == '3':
                print("\n⚙️  Execute tuples")
                tuples_input = input("Enter tuples (comma-separated or press Enter for empty): ").strip()
                if tuples_input:
                    tuples_list = [t.strip() for t in tuples_input.split(',')]
                else:
                    tuples_list = []
                self.assistant.execute_tuples(tuples_list)
                time.sleep(2)
                responses = self.assistant.check_responses()
                self._display_responses(responses)
            
            elif choice == '4':
                print("\n📬 Checking for responses...")
                responses = self.assistant.check_responses()
                self._display_responses(responses)
            
            elif choice == '5':
                self.assistant.display_info()
            
            elif choice == '6':
                print("\n🔗 Connecting to Gmail...")
                if self.assistant.connect_gmail():
                    print("✅ Connected successfully!")
                else:
                    print("❌ Failed to connect")
            
            elif choice == '7':
                print("\n🔌 Disconnecting from Gmail...")
                self.assistant.disconnect_gmail()
                print("✅ Disconnected")
            
            elif choice == '8':
                print("\n👋 Shutting down...")
                self.assistant.disconnect_gmail()
                print("Goodbye!")
                break
            
            else:
                print("❌ Invalid choice. Please try again.")
            
            input("\nPress Enter to continue...")
    
    def _display_responses(self, responses):
        """Display email responses"""
        if not responses:
            print("\n📭 No responses received")
            return
        
        print(f"\n📨 Received {len(responses)} response(s):\n")
        for i, resp in enumerate(responses, 1):
            print(f"─── Response {i} ───")
            print(f"Subject: {resp['subject']}")
            print(f"From: {resp['from']}")
            print(f"Date: {resp['date']}")
            print(f"Body:\n{resp['body']}\n")


def main():
    """Main entry point"""
    # Validate configuration
    required_vars = ['ATEATE_SERVICE_EMAIL', 'ATEATE_SERVICE_PASSWORD', 
                     'ATEATE_GATEWAY_EMAIL', 'ATEATE_SERIAL', 'ATEATE_BUILD']
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file with the required configuration.")
        print("Use .env.example as a template.")
        return
    
    # Run CLI
    cli = VirtualAssistantCLI()
    cli.run()


if __name__ == "__main__":
    main()