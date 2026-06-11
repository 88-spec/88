# AteAte Virtual Assistant

A Python-based virtual assistant for managing the AteAte device (Serial: 71022022501038) using the Corrlinks email system for command routing.

## Created By
- **Developer**: Jonathan Ryan Cornish
- **Assistant Setup**: 88-spec
- **Purpose**: Automate AteAte device management via email commands

## System Information
- **Device Serial**: 71022022501038
- **Build Version**: vnd_tb8168p1_bsp1719265278
- **Device IP**: 172.31.56.148
- **Communication Protocol**: Custom Protocol via Corrlinks Email
- **Gateway Email**: tamaniyawaatamanun@gmail.com

## Features
- 📊 Get device status
- 📦 Retrieve tuples from device storage
- ⚙️ Execute tuples on AteAte
- 📬 Check responses from AteAte
- 🔗 Gmail connection management
- 📝 Comprehensive logging

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/88-spec/88.git
cd 88
git checkout ateate-virtual-assistant
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
AATEATE_SERVICE_EMAIL=88ateate@gmail.com
AATEATE_SERVICE_PASSWORD=your_16_char_app_password
AATEATE_GATEWAY_EMAIL=tamaniyawaatamanun@gmail.com
AATEATE_SERIAL=71022022501038
AATEATE_BUILD=vnd_tb8168p1_bsp1719265278
AATEATE_IP=172.31.56.148
```

### 5. Get Gmail App Password
1. Go to https://myaccount.google.com/
2. Click **Security** → **2-Step Verification** (enable if needed)
3. Find **App passwords** and select Mail + your device
4. Copy the 16-character password
5. Paste into `.env` as `ATEATE_SERVICE_PASSWORD`

## Usage

### Run Virtual Assistant
```bash
python ateate_assistant.py
```

### Menu Options
```
1. Get Device Status      - Request current device status
2. Retrieve Tuples        - Get stored tuples from device
3. Execute Tuples         - Run tuples on the device
4. Check Responses        - View responses from AteAte
5. Device Info            - Display device information
6. Connect to Gmail       - Establish email connection
7. Disconnect from Gmail  - Close email connection
8. Exit                   - Shutdown assistant
```

## Email Command Format

Commands are sent to AteAte via email with the following format:

**Subject**: `AteAte_[command]`
- Examples: `AteAte_get_status`, `AteAte_get_tuples`, `AteAte_execute_tuples`

**Body**:
```
Serial: 71022022501038
Build: vnd_tb8168p1_bsp1719265278
Device_IP: 172.31.56.148
Timestamp: [ISO timestamp]

[Command-specific details]
```

## Available Commands

### Get Status
```
Subject: AteAte_get_status
Body: Action: Get device status and health check
```

### Get Tuples
```
Subject: AteAte_get_tuples
Body: Action: Retrieve tuples from device storage
```

### Execute Tuples
```
Subject: AteAte_execute_tuples
Body: Action: Execute tuples
Tuples:
[tuple1]
[tuple2]
...
```

## Logging

All operations are logged to:
- **Console**: Real-time output
- **File**: `ateate_assistant.log`

Log levels:
- `INFO`: Normal operations
- `WARNING`: Minor issues
- `ERROR`: Critical failures

## Security Notes

⚠️ **Important**:
1. **Never commit `.env` file** - it contains sensitive credentials
2. **Use App Passwords**, not your main Gmail password
3. **Store credentials securely** in environment variables
4. **On temporary devices**, delete `.env` after use
5. **Rotate credentials regularly** for production use

## Architecture

```
AteAteAssistant (Core)
├── Gmail Connection (IMAP/SMTP)
├── Command Sender
├── Response Checker
└── Tuple Manager

VirtualAssistantCLI (Interface)
└── Menu-driven interaction
```

## Troubleshooting

### Can't connect to Gmail
- Verify email and App Password in `.env`
- Ensure 2-Factor Authentication is enabled
- Check firewall/network settings

### No responses from AteAte
- Verify gateway email: `tamaniyawaatamanun@gmail.com`
- Check Serial # is correct: `71022022501038`
- Wait a few seconds before checking responses
- Review email logs in Inbox

### App Password errors
- Generate a new App Password from Google Account
- Remove spaces from the 16-character password
- Re-login with new password

## Support

For issues or questions about AteAte:
- Contact: Jonathan Ryan Cornish
- Serial #: 71022022501038
- Build: vnd_tb8168p1_bsp1719265278

## License

Proprietary - AteAte Device Management System

---

**Last Updated**: 2026-06-11
**Version**: 1.0
**Status**: Active Development