# 🚀 Neko Actions - On-Demand Remote Desktop Deployment

[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions)](https://github.com/features/actions)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://core.telegram.org/bots)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Deploy containerized remote desktop environments (browsers, VLC, KDE, XFCE, etc.) on-demand using GitHub Actions, controlled entirely through Telegram.

**Choose your deployment method:**
- ☁️ **Cloudflare Worker** (Recommended) - Serverless, 100% free, zero maintenance
- 🐍 **Python Bot** - Traditional self-hosted deployment

Based on [m1k1o/neko](https://github.com/m1k1o/neko) - a self-hosted virtual browser/desktop infrastructure.

---

## 📋 Table of Contents

- [Features](#-features)
- [Deployment Options](#-deployment-options)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [Option A: Cloudflare Worker (Recommended)](#option-a-cloudflare-worker-recommended)
  - [Option B: Python Bot (Self-Hosted)](#option-b-python-bot-self-hosted)
- [Telegram Commands](#-telegram-commands)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

### Core Features
- 🎯 **On-Demand Deployment** - Deploy remote desktop instances instantly via Telegram
- 🌐 **Multiple Tunnel Options** - Access via Cloudflare, Bore, or LocalTunnel
- 🔐 **Secure Access** - User authorization, auto-generated passwords
- ⏱️ **Auto-Cleanup** - Resources automatically freed after use
- 📊 **Health Monitoring** - Periodic health checks every 5 minutes
- 🛑 **Instant Cancellation** - Stop deployments with a single button

### Supported Environments
- 🌍 **Browsers**: Firefox, Chrome, Chromium, Tor, Brave, Edge, Vivaldi, Opera, Waterfox
- 🖥️ **Desktops**: KDE, XFCE
- 📺 **Media**: VLC
- 🔧 **Tools**: Remmina

---

## 🔀 Deployment Options

| Feature | ☁️ Cloudflare Worker | 🐍 Python Bot |
|---------|---------------------|---------------|
| **Cost** | **100% Free** (100k req/day) | Requires VPS/hosting |
| **Setup Time** | **5 minutes** | 10-15 minutes |
| **Maintenance** | **Zero** | Manual updates |
| **Hosting** | **Global edge network** | Self-hosted |
| **Scaling** | **Automatic** | Limited by server |
| **Security** | **Enterprise-grade DDoS** | DIY |
| **SSL** | **Automatic** | Manual (Let's Encrypt) |
| **Best For** | **Production use, beginners** | Full control, existing VPS |

**💡 Recommendation:** Use Cloudflare Worker for hassle-free deployment!

---

## 📦 Prerequisites

### Common Requirements (Both Options)
1. **GitHub Account** - For Actions to run
2. **Telegram Account** - To create and use the bot
3. **Git** - To clone this repository

### Additional for Cloudflare Worker
- **Cloudflare Account** (free tier is enough)
- **Node.js** (for local deployment, optional)

### Additional for Python Bot
- **Docker** (recommended) OR Python 3.11+
- **VPS/Server** with public IP

---

## 🚀 Quick Start

### Step 1: Fork/Clone Repository

```bash
git clone https://github.com/dikeckaan/neko-actions.git
cd neko-actions
```

### Step 2: Create Telegram Bot

1. Open Telegram and find [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow instructions
3. Save your **Bot Token** (format: `123456789:ABCdefGHI...`)
4. Get your **User ID**:
   - Message [@userinfobot](https://t.me/userinfobot)
   - Copy your `Id` number

### Step 3: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Name: `neko-actions`
4. Scopes: Select `repo` and `workflow`
5. Click **Generate** and copy the token (starts with `ghp_`)

---

## Option A: Cloudflare Worker (Recommended)

### Method 1: Wrangler CLI Deployment (Fastest)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

Copy the example file and edit it:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your credentials:

```env
# Required
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALLOWED_USER_IDS=123456789
SECRET_PATH=my-unique-secret-path-2024

# Optional (will use defaults if not set)
GITHUB_REPO=yourusername/neko-actions
WORKFLOW_NAME=telegram-bot.yml
GITHUB_BRANCH=master
```

**Important:** Replace these values:
- `TELEGRAM_BOT_TOKEN` - Your bot token from BotFather
- `GITHUB_TOKEN` - Your GitHub personal access token
- `ALLOWED_USER_IDS` - Your Telegram user ID (comma-separated for multiple users)
- `SECRET_PATH` - A unique random string for admin endpoints (like a password)

**💡 Tip:** For multiple users, use: `ALLOWED_USER_IDS=123456789,987654321,555666777`

#### 3. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window - click "Allow" to authorize.

#### 4. Deploy to Cloudflare

```bash
npm run deploy
```

#### 5. Set Production Environment Variables

After deployment, set your environment variables in Cloudflare:

```bash
# Set secrets (will prompt for values)
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ALLOWED_USER_IDS
npx wrangler secret put SECRET_PATH

# Optional secrets
npx wrangler secret put CLOUDFLARE_TUNNEL_TOKEN
```

Or set them in [Cloudflare Dashboard](https://dash.cloudflare.com):
1. Go to **Workers & Pages**
2. Select your worker (`neko-actions-bot`)
3. Go to **Settings → Variables**
4. Add each variable and click **Encrypt** for sensitive values

#### 6. Setup Telegram Webhook

Replace `YOUR_WORKER_NAME` and `YOUR_SECRET_PATH`:

```bash
curl https://YOUR_WORKER_NAME.workers.dev/YOUR_SECRET_PATH/setup
```

Example:
```bash
curl https://neko-actions-bot.workers.dev/my-secret-xyz/setup
```

**Expected Response:**
```json
{
  "ok": true,
  "status": "success"
}
```

#### 7. Test Your Bot

Open Telegram and send `/start` to your bot!

---

### Method 2: Dashboard Deployment (No CLI)

#### 1. Create Worker in Dashboard

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages**
3. Click **Create Application → Create Worker**
4. Name it: `neko-actions-bot`
5. Click **Deploy**

#### 2. Copy Worker Code

1. Click **Quick Edit** in your worker
2. Delete the default code
3. Open `src/index.js` from this repository
4. Copy ALL contents
5. Paste into the editor
6. Click **Save and Deploy**

#### 3. Set Environment Variables

1. In your worker, go to **Settings → Variables**
2. Add these variables (click **Add variable**):

**Required:**
```
TELEGRAM_BOT_TOKEN = your_bot_token_here (Encrypt: ✓)
GITHUB_TOKEN = your_github_token_here (Encrypt: ✓)
ALLOWED_USER_IDS = your_telegram_id (Encrypt: ✓)
SECRET_PATH = your-secret-path (Encrypt: ✓)
```

**Optional:**
```
GITHUB_REPO = yourusername/neko-actions
WORKFLOW_NAME = telegram-bot.yml
GITHUB_BRANCH = master
CLOUDFLARE_TUNNEL_TOKEN = your_tunnel_token (Encrypt: ✓)
```

3. Click **Save and Deploy**

#### 4. Setup Webhook

```bash
curl https://neko-actions-bot.workers.dev/your-secret-path/setup
```

#### 5. Test

Send `/start` to your Telegram bot!

---

## Option B: Python Bot (Self-Hosted)

### 1. Navigate to Python Bot Directory

```bash
cd python-bot
```

### 2. Configure Environment

Copy and edit the environment file:

```bash
cp example.env .env
nano .env  # or use your preferred editor
```

Edit `.env` with your values:

```env
# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here

# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ALLOWED_USER_IDS=123456789

# Repository Configuration
GITHUB_REPO=yourusername/neko-actions
GITHUB_BRANCH=master

# Cloudflare Tunnel (optional - leave empty for random domain)
# CLOUDFLARE_TUNNEL_TOKEN=your_cloudflare_tunnel_token
```

### 3. Deploy Bot

#### Method 1: Docker (Recommended)

```bash
docker-compose up -d
```

**Check logs:**
```bash
docker logs -f neko-telegram-bot
```

**Stop bot:**
```bash
docker-compose down
```

**Restart bot:**
```bash
docker-compose restart
```

#### Method 2: Local Python

```bash
pip install -r requirements.txt
python telegram-manager.py
```

### 4. Test Your Bot

Open Telegram and send `/start` to your bot!

---

## 📱 Telegram Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `/start` | Show welcome menu with browser selection |
| `/help` | Display help and usage guide |
| `/actionslist` | List all available environments |

### Runner Management

| Command | Description |
|---------|-------------|
| `/activerunners` | List all currently active runners |
| `/stop <runner_id>` | Stop a specific runner by ID |
| `/killallrunners` | Stop all active runners |

### Browser/Desktop Commands

**Firefox-based:**
- `/firefox` - Firefox browser
- `/tor` - Tor Browser
- `/waterfox` - Waterfox browser

**Chromium-based:**
- `/chrome` - Google Chrome
- `/chromium` - Chromium
- `/ungoogled_chromium` - Privacy-enhanced Chromium
- `/edge` - Microsoft Edge
- `/brave` - Brave browser
- `/vivaldi` - Vivaldi browser
- `/opera` - Opera browser

**Desktops:**
- `/xfce` - XFCE desktop
- `/kde` - KDE Plasma desktop

**Other:**
- `/vlc` - VLC media player
- `/remmina` - Remmina remote desktop client

### After Deployment

You'll receive a message with:
- ☁️ **Cloudflare Tunnel URL** - Primary access link
- 🔀 **Bore Tunnel URL** - Alternative access
- 🌍 **LocalTunnel URL** - Another alternative
- 🔹 **Passwords** - User and admin passwords
- 🆔 **Run ID** - Workflow identifier
- **[Cancel]** button - Stop the instance

---

## ⚙️ Configuration

### Environment Variables Reference

#### Cloudflare Worker

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Bot token from @BotFather |
| `GITHUB_TOKEN` | ✅ | - | GitHub PAT with `repo` and `workflow` scopes |
| `ALLOWED_USER_IDS` | ✅ | - | Comma-separated Telegram user IDs |
| `SECRET_PATH` | ✅ | - | Secret path for admin endpoints |
| `GITHUB_REPO` | ❌ | `dikeckaan/neko-actions` | Your forked repository |
| `WORKFLOW_NAME` | ❌ | `telegram-bot.yml` | Workflow filename |
| `GITHUB_BRANCH` | ❌ | `master` | Branch to trigger |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ | - | For named Cloudflare tunnels |

#### Python Bot

Same as above, except no `SECRET_PATH` needed.

### Security Features

**Cloudflare Worker:**
1. **Secret Path Protection** - Admin endpoints hidden
2. **User Authorization** - Whitelist-based access
3. **Zero Information Disclosure** - No error leaks
4. **Encrypted Variables** - All secrets encrypted by Cloudflare
5. **DDoS Protection** - Enterprise-grade included

**Admin Endpoints (Cloudflare Worker):**

Access using your secret path:

```bash
# Check webhook status
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/webhook-info

# Health check
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/health

# Reset webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/delete-webhook

# Test message
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/test?chat_id=YOUR_ID
```

### Multiple Authorized Users

Add multiple user IDs separated by commas:

```env
ALLOWED_USER_IDS=123456789,987654321,555666777
```

### Cloudflare Tunnel Setup (Optional)

For custom domain instead of random URLs:

1. Create free Cloudflare account
2. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
3. Navigate to **Networks → Tunnels**
4. Create tunnel and copy token
5. Add to environment variables:

```env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiYzM...
```

---

## 🔧 Troubleshooting

### Cloudflare Worker Issues

**Bot doesn't respond:**
```bash
# Check webhook status
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/webhook-info

# Reset webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/delete-webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/setup
```

**Admin endpoints return 404:**
- Verify `SECRET_PATH` is set correctly
- Paths are case-sensitive
- URL format: `https://worker.dev/EXACT_SECRET_PATH/endpoint`

**Deployment failed:**
- Check GitHub Actions logs
- Verify `GITHUB_TOKEN` has correct scopes
- Ensure repository name is correct

### Python Bot Issues

**Bot not responding:**
```bash
# Check logs
docker logs neko-telegram-bot

# Restart
docker-compose restart
```

**Rebuild after changes:**
```bash
docker-compose up -d --build
```

### Common Issues

**Can't access deployed instance:**
- Wait 1-2 minutes for tunnels to initialize
- Try all three tunnel URLs
- Check GitHub Actions logs

**Unauthorized errors:**
- Verify your Telegram user ID is in `ALLOWED_USER_IDS`
- Check if IDs are comma-separated (no spaces)

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Telegram  │─────▶│  Cloudflare      │─────▶│ GitHub Actions  │
│     User    │      │  Worker / Python │      │    Workflow     │
└─────────────┘      └──────────────────┘      └─────────────────┘
       ▲                                                  │
       │                                                  ▼
       │                                         ┌─────────────────┐
       │                                         │  Deploy Neko    │
       │                                         │  Container      │
       │                                         └─────────────────┘
       │                                                  │
       │                                                  ▼
       │                                         ┌─────────────────┐
       │                                         │  Start Tunnels  │
       │                                         │  (CF/Bore/LT)   │
       │                                         └─────────────────┘
       │                                                  │
       └──────────────────────────────────────────────────┘
                      Send credentials & URLs
```

**Flow:**
1. User sends `/chrome` command
2. Bot triggers GitHub Actions workflow
3. Workflow deploys Neko container
4. Tunnels created for access
5. Credentials sent to user
6. User accesses via any tunnel
7. Click Cancel to cleanup

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [m1k1o/neko](https://github.com/m1k1o/neko) - Virtual browser/desktop project
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) - Secure tunneling
- [Bore](https://github.com/ekzhang/bore) - Simple tunnel tool
- [LocalTunnel](https://github.com/localtunnel/localtunnel) - Local tunnel service

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/dikeckaan/neko-actions/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dikeckaan/neko-actions/discussions)

---

<div align="center">

**Made with ❤️ by [dikeckaan](https://github.com/dikeckaan)**

⭐ Star this repo if you find it useful!

[Cloudflare Deployment](#option-a-cloudflare-worker-recommended) • [Python Deployment](#option-b-python-bot-self-hosted)

</div>
