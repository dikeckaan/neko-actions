# 🚀 Neko Actions - On-Demand Remote Desktop Deployment

[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions)](https://github.com/features/actions)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://core.telegram.org/bots)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue?logo=docker)](https://www.docker.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Deploy containerized remote desktop environments (browsers, VLC, KDE, XFCE, etc.) on-demand using GitHub Actions, controlled entirely through Telegram.

**Choose your deployment method:**
- 🐍 **Python Bot** - Traditional Docker/VPS hosting
- ☁️ **Cloudflare Worker** - Serverless, zero-maintenance deployment

Based on [m1k1o/neko](https://github.com/m1k1o/neko) - a self-hosted virtual browser/desktop infrastructure.

---

## 📋 Table of Contents

- [Features](#-features)
- [Deployment Options](#-deployment-options)
- [How It Works](#-how-it-works)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [Option A: Python Bot Deployment](#option-a-python-bot-traditional)
  - [Option B: Cloudflare Worker Deployment](#option-b-cloudflare-worker-serverless)
- [Telegram Commands](#-telegram-commands)
- [Tunnel Options](#-tunnel-options)
- [Advanced Configuration](#-advanced-configuration)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features
- 🎯 **On-Demand Deployment** - Deploy remote desktop instances instantly via Telegram
- 🌐 **Multiple Tunnel Options** - Choose from Cloudflare, Bore, or LocalTunnel
- 🔐 **Secure Access** - User authorization, masked credentials, auto-generated passwords
- ⏱️ **Auto-Cleanup** - Resources freed automatically after use
- 📊 **Health Monitoring** - Periodic health checks every 5 minutes
- 🛑 **Instant Cancellation** - Stop deployments with a single button click

### Supported Environments
- 🌍 **Firefox-based**: Firefox, Tor Browser, Waterfox
- 🌐 **Chromium-based**: Chrome, Chromium, Ungoogled Chromium, Edge, Brave, Vivaldi, Opera
- 🖥️ **Desktops**: KDE, XFCE
- 📺 **Media**: VLC
- 🔧 **Tools**: Remmina

### User Experience
- 📱 Interactive Telegram bot with inline keyboards
- 🔔 Real-time deployment notifications
- ❌ Error notifications with detailed logs
- 📖 Built-in help system and command guide
- 🎨 Clean HTML-formatted messages

---

## 🔀 Deployment Options

Choose the deployment method that best fits your needs:

| Feature | 🐍 Python Bot | ☁️ Cloudflare Worker |
|---------|---------------|---------------------|
| **Cost** | Requires VPS/Docker host | **100% Free** (100k req/day) |
| **Setup Time** | 10-15 minutes | **5 minutes** |
| **Maintenance** | Manual updates, server management | **Zero maintenance** |
| **Hosting** | Self-hosted (VPS, local machine) | **Global edge network** |
| **Scaling** | Limited by server resources | **Automatic, unlimited** |
| **DDoS Protection** | DIY | **Enterprise-grade included** |
| **SSL Certificate** | Manual setup (Let's Encrypt) | **Automatic** |
| **Cold Starts** | Possible if stopped | **None** |
| **Global CDN** | Extra cost | **Included** |
| **Uptime** | Depends on your server | **99.99% SLA** |
| **Best For** | Full control, existing infrastructure | Minimal effort, production use |

### 🤔 Which Should I Choose?

**Choose Python Bot if:**
- ✅ You already have a VPS or server
- ✅ You want full control over the code execution
- ✅ You prefer traditional hosting methods
- ✅ You need to customize the runtime environment

**Choose Cloudflare Worker if:**
- ✅ You want zero server management
- ✅ You need global availability and low latency
- ✅ You want automatic scaling
- ✅ You prefer serverless architecture
- ✅ You want enterprise-grade security out of the box
- ✅ **You're new to deployment (recommended for beginners)**

---

## 🔄 How It Works

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Telegram  │─────▶│   Bot (Python/   │─────▶│ GitHub Actions  │
│     User    │      │ Cloudflare)      │      │    Workflow     │
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

1. **User sends command** (e.g., `/chrome`) in Telegram
2. **Bot triggers GitHub Actions** workflow with parameters
3. **Workflow deploys** Neko container with selected environment
4. **Tunnels are created** (Cloudflare, Bore, LocalTunnel)
5. **Credentials sent** to user via Telegram with access URLs
6. **User accesses** remote desktop through any tunnel
7. **Click Cancel** button to stop instance and cleanup resources

---

## 📦 Prerequisites

### Common Requirements (Both Options)
- GitHub account with Actions enabled
- Telegram account
- Git installed on your machine

### Additional for Python Bot
- Docker and Docker Compose (recommended), OR
- Python 3.11+ (for local deployment)

### Additional for Cloudflare Worker
- Cloudflare account (free tier works perfectly)

### Optional (Both Options)
- Cloudflare account (for named tunnels with custom domains)

---

## 🚀 Quick Start

### 1. Fork/Clone Repository

```bash
git clone https://github.com/dikeckaan/neko-actions.git
cd neko-actions
```

### 2. Create Telegram Bot

1. Open Telegram and find [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow instructions
3. Copy the **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
4. Get your **User ID**:
   - Message [@userinfobot](https://t.me/userinfobot)
   - Copy the `Id` number

### 3. Create GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Name: `neko-actions`
4. Select scopes: **`repo`** and **`workflow`**
5. Click **Generate token**
6. Copy the token (starts with `ghp_`)

---

## Option A: Python Bot (Traditional)

### Step 1: Configure Environment

Navigate to `python-bot/` directory:

```bash
cd python-bot
cp example.env .env
```

Edit `.env` with your values:

```ini
# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here

# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ALLOWED_USER_IDS=123456789

# Repository Configuration (optional)
GITHUB_REPO=yourusername/neko-actions
GITHUB_BRANCH=improvements

# Cloudflare Tunnel (optional - leave empty for random domain)
# CLOUDFLARE_TUNNEL_TOKEN=your_cloudflare_tunnel_token
```

### Step 2: Deploy Bot

#### Method 1: Docker (Recommended)

```bash
cd python-bot
docker-compose up -d
```

Check logs:
```bash
docker logs -f neko-telegram-bot
```

Stop bot:
```bash
docker-compose down
```

Restart bot:
```bash
docker-compose restart
```

#### Method 2: Local Python

```bash
cd python-bot
pip install -r requirements.txt
python telegram-manager.py
```

### Step 3: Test Your Bot

Open Telegram and send `/start` to your bot!

---

## Option B: Cloudflare Worker (Serverless)

### Step 1: Create Cloudflare Worker

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Create Worker**
4. Name it (e.g., `telegram-bot`)
5. Click **Deploy**

### Step 2: Configure Environment Variables

In your worker settings (**Settings** → **Variables**), add:

#### Required Variables:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALLOWED_USER_IDS=123456789,987654321
SECRET_PATH=my-unique-secret-path-2024
```

#### Optional Variables:
```env
GITHUB_REPO=yourusername/neko-actions
WORKFLOW_NAME=telegram-bot.yml
GITHUB_BRANCH=improvements
CLOUDFLARE_TUNNEL_TOKEN=your_cloudflare_tunnel_token
```

**Important:** Click **Encrypt** for sensitive values (tokens).

### Step 3: Deploy Worker Code

1. In your worker page, click **Quick Edit**
2. Delete the default code
3. Copy the entire contents from `cloudflare-worker/cloudflare-edition.js`
4. Paste into the editor
5. Click **Save and deploy**

### Step 4: Configure Telegram Webhook

```bash
# Replace YOUR_WORKER_NAME and YOUR_SECRET_PATH
curl https://YOUR_WORKER_NAME.workers.dev/YOUR_SECRET_PATH/setup
```

Example:
```bash
curl https://telegram-bot.workers.dev/my-secret-xyz/setup
```

**Expected Response:**
```json
{
  "webhook_url": "https://telegram-bot.workers.dev/",
  "admin_panel": "https://telegram-bot.workers.dev/my-secret-xyz/",
  "telegram_response": {
    "ok": true,
    "result": true
  },
  "status": "success"
}
```

### Step 5: Test Your Bot

Open Telegram and send `/start` to your bot!

### 🔐 Cloudflare Worker Security Features

The Cloudflare Worker edition includes enhanced security:

1. **Secret Path Protection** - Admin endpoints hidden behind configurable secret path
2. **Minimal Attack Surface** - Unknown paths return empty 404 responses
3. **User Authorization** - Only whitelisted Telegram user IDs can use the bot
4. **No Information Disclosure** - No error messages, version numbers, or hints
5. **Environment Variable Isolation** - All credentials encrypted at rest by Cloudflare

#### Admin Endpoints

Access admin functions using your secret path:

| Endpoint | Purpose |
|----------|---------|
| `/:secret/setup` | Configure Telegram webhook |
| `/:secret/webhook-info` | Check webhook status |
| `/:secret/delete-webhook` | Reset webhook configuration |
| `/:secret/health` | Health check endpoint |
| `/:secret/test?chat_id=ID` | Send test messages |

Example:
```bash
# Check webhook status
curl https://telegram-bot.workers.dev/my-secret-xyz/webhook-info

# Health check
curl https://telegram-bot.workers.dev/my-secret-xyz/health
```

---

## 📱 Telegram Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `/start` | Show welcome menu with interactive buttons |
| `/help` | Display detailed usage guide and troubleshooting |
| `/actionslist` | List all available browser/desktop environments |

### Browser/Desktop Commands

#### Firefox-based Browsers
| Command | Environment |
|---------|-------------|
| `/firefox` | Latest stable Firefox browser |
| `/tor` | Privacy-focused Tor Browser |
| `/waterfox` | Privacy-focused Firefox fork |

#### Chromium-based Browsers
| Command | Environment |
|---------|-------------|
| `/chrome` | Google Chrome |
| `/chromium` | Open-source Chromium browser |
| `/ungoogled_chromium` | Privacy-enhanced Chromium |
| `/edge` | Microsoft Edge |
| `/brave` | Privacy-focused Brave browser |
| `/vivaldi` | Feature-rich Vivaldi browser |
| `/opera` | Opera browser |

#### Desktop Environments
| Command | Environment |
|---------|-------------|
| `/xfce` | Lightweight XFCE desktop |
| `/kde` | Full-featured KDE Plasma desktop |

#### Other Applications
| Command | Environment |
|---------|-------------|
| `/remmina` | Remote desktop client |
| `/vlc` | VLC media player |

### After Deployment

You'll receive a message with:
- ☁️ **Cloudflare Tunnel URL** - Click to access via Cloudflare
- 🔀 **Bore Tunnel URL** - Click to access via Bore
- 🌍 **LocalTunnel URL** - Click to access via LocalTunnel
- 🌎 **Public IP** - Server's public IP address
- 🔹 **Neko Password** - Regular user password
- 🔹 **Neko Admin Password** - Administrator password
- 🆔 **Run ID** - Unique workflow run identifier
- **[Cancel]** button - Click to immediately stop the instance

---

## 🌐 Tunnel Options

The bot provides **three tunnel options** to access your deployed instance:

### 1. ☁️ Cloudflare Tunnel (Recommended)

**Advantages:**
- Fastest performance (Cloudflare CDN)
- Most reliable (enterprise-grade infrastructure)
- DDoS protection included
- Global edge network
- HTTPS support

**Setup:**

#### Quick Tunnel (Random Domain)
Leave `CLOUDFLARE_TUNNEL_TOKEN` empty in your configuration.

Result: `https://random-xyz.trycloudflare.com`

#### Named Tunnel (Your Domain)
1. Create a Cloudflare account (free)
2. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
3. Navigate to **Networks → Tunnels**
4. Create a new tunnel and copy the token
5. Add to your configuration:

```ini
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiYzM...
```

Result: `https://your-tunnel.yourdomain.com`

### 2. 🔀 Bore Tunnel

**Advantages:**
- Simple setup (no configuration needed)
- Open source
- Reliable

**Limitations:**
- Random port each time
- HTTP only (no HTTPS)

URL format: `http://bore.pub:12345`

### 3. 🌍 LocalTunnel

**Advantages:**
- Simple setup
- HTTPS support
- Open source

**Limitations:**
- May show warning page on first visit
- Occasional connection issues

URL format: `https://random-name.loca.lt`

### Comparison Table

| Feature | Cloudflare | Bore | LocalTunnel |
|---------|-----------|------|-------------|
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Reliability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| HTTPS | ✅ | ❌ | ✅ |
| Custom Domain | ✅ (with token) | ❌ | ❌ |
| Setup Difficulty | Easy/Medium | Easy | Easy |
| Cost | Free | Free | Free |

---

## ⚙️ Advanced Configuration

### Environment Variables Reference

#### Python Bot

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | ✅ | - | GitHub PAT with `repo` and `workflow` scopes |
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Telegram bot token from BotFather |
| `ALLOWED_USER_IDS` | ✅ | - | Comma-separated Telegram user IDs |
| `GITHUB_REPO` | ❌ | `dikeckaan/neko-actions` | Your forked repository (`owner/repo`) |
| `GITHUB_BRANCH` | ❌ | `improvements` | Branch to trigger workflows from |
| `WORKFLOW_NAME` | ❌ | `telegram-bot.yml` | Workflow filename |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ | - | Cloudflare Tunnel token for named tunnel |

#### Cloudflare Worker

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | - | Bot token from @BotFather |
| `GITHUB_TOKEN` | ✅ | - | GitHub PAT with `repo` scope |
| `ALLOWED_USER_IDS` | ✅ | - | Comma-separated Telegram user IDs |
| `SECRET_PATH` | ✅ | - | Secret path for admin endpoints |
| `GITHUB_REPO` | ❌ | `dikeckaan/neko-actions` | Target repository |
| `WORKFLOW_NAME` | ❌ | `telegram-bot.yml` | Workflow file name |
| `GITHUB_BRANCH` | ❌ | `improvements` | Target branch |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ | - | Cloudflare Tunnel token |

### Multiple Authorized Users

Add multiple user IDs separated by commas:

```ini
ALLOWED_USER_IDS=123456789,987654321,555666777
```

### Custom Workflow Branch

To use a different branch:

```ini
GITHUB_BRANCH=main
```

### Runtime Limits

- **Maximum runtime:** 6 hours per instance
- **Health checks:** Every 5 minutes
- **Auto-cleanup:** On timeout, cancellation, or failure

### Extending Instance Lifetime

To run longer than 6 hours:
1. Edit `.github/workflows/telegram-bot.yml`
2. Find: `END_TIME=$((SECONDS + 21600))  # 6 hours`
3. Change `21600` to desired seconds (e.g., `43200` for 12 hours)
4. Commit and push changes

⚠️ **Note:** GitHub Actions free tier has usage limits. Monitor your quota.

---

## 🔧 Troubleshooting

### Python Bot Issues

#### Bot Not Responding

**Check bot status:**
```bash
docker logs neko-telegram-bot
```

**Common issues:**
- ❌ Invalid `TELEGRAM_BOT_TOKEN` → Check token with BotFather
- ❌ Unauthorized user → Add your user ID to `ALLOWED_USER_IDS`
- ❌ Bot not running → Start with `docker-compose up -d`

#### Container Issues

**Restart bot:**
```bash
cd python-bot
docker-compose restart
```

**Rebuild after changes:**
```bash
docker-compose up -d --build
```

### Cloudflare Worker Issues

#### Bot Doesn't Respond

**Check webhook status:**
```bash
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/webhook-info
```

**Look for:**
- `pending_update_count` - Should be 0 or low
- `last_error_date` - Should be absent
- `url` - Should match your worker URL

**Solution:**
```bash
# Reset and reconfigure webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/delete-webhook
curl https://YOUR_WORKER.workers.dev/YOUR_SECRET/setup
```

#### Admin Endpoints Return 404

**Cause:** SECRET_PATH mismatch or not set

**Solution:**
1. Verify `SECRET_PATH` environment variable exists
2. Ensure URL matches: `https://worker.dev/EXACT_SECRET_PATH/endpoint`
3. Secret paths are case-sensitive

#### Worker Quota Exceeded

**Cause:** Too many requests (rare due to path filtering)

**Why this is rare:**
- Worker rejects unknown paths with minimal processing
- Only Telegram webhooks and admin requests consume quota
- Free tier: 100,000 requests/day

**Solution:**
- Check Cloudflare Analytics for unusual traffic
- Consider Cloudflare Access for extra protection
- Upgrade to paid plan ($5/month) for 10M requests

### Common Issues (Both Deployments)

#### Deployment Failed

**Check GitHub Actions logs:**
1. Go to your repository
2. Click **Actions** tab
3. Click the failed workflow run
4. Review error messages

**Common issues:**
- ❌ Invalid `GITHUB_TOKEN` → Regenerate token with correct scopes
- ❌ Docker pull failed → Rate-limited, wait and retry
- ❌ Tunnel startup failed → Check logs for specific errors

#### Credentials Not Received

**No message at all:**
- Verify bot token is correct
- Check workflow logs for "Sending message to Telegram..."
- Ensure user ID matches the one triggering the workflow

**Error notification instead:**
- Check GitHub Actions logs for specific error
- Workflow may have failed during deployment

#### Connection Issues

**Cannot access via tunnels:**
- Wait 1-2 minutes for tunnels to fully initialize
- Try all three tunnel options
- Check if Neko container is running in workflow logs

**"Connection refused" error:**
- Container may have crashed - check logs
- Health check may have failed
- Wait a bit longer for startup

---

## 🏗️ Architecture

### System Components

```
┌──────────────────────────────────────────────────────────┐
│                    Telegram User                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│         Bot Layer (Python or Cloudflare Worker)          │
│  • Command handling (/start, /chrome, etc.)              │
│  • User authorization                                     │
│  • Workflow triggering via GitHub API                    │
│  • Callback handling (Cancel button)                     │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│                  GitHub Actions                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. Deploy Neko Docker Container                   │  │
│  │     • Pull image from ghcr.io (fallback: Docker)   │  │
│  │     • Generate random passwords                    │  │
│  │     • Start container on port 8080                 │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  2. Initialize Tunnels                             │  │
│  │     • Cloudflare Tunnel (named or quick)           │  │
│  │     • Bore Tunnel                                  │  │
│  │     • LocalTunnel                                  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  3. Send Credentials to Telegram                   │  │
│  │     • Extract tunnel URLs                          │  │
│  │     • Format HTML message                          │  │
│  │     • Send via Telegram API                        │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  4. Keep Alive & Monitor                           │  │
│  │     • Health checks every 5 minutes                │  │
│  │     • Container status monitoring                  │  │
│  │     • Run for up to 6 hours                        │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  5. Cleanup (on timeout/cancel/error)              │  │
│  │     • Stop Docker containers                       │  │
│  │     • Kill tunnel processes                        │  │
│  │     • Free resources                               │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

**Python Bot:**
- Backend: Python 3.11
- Bot Framework: python-telegram-bot
- HTTP Client: requests
- Containerization: Docker

**Cloudflare Worker:**
- Runtime: Cloudflare Workers (V8 JavaScript)
- Edge Network: Global Cloudflare CDN
- Deployment: Serverless

**Common:**
- Container Registry: GitHub Container Registry (ghcr.io) with Docker Hub fallback
- CI/CD: GitHub Actions
- Tunneling: Cloudflare Tunnel, Bore, LocalTunnel
- Remote Desktop: Neko (Docker)

---

## 🔐 Security

### Security Features

1. **Authorization:** Only whitelisted Telegram users can trigger deployments
2. **Token Masking:** Sensitive data masked in GitHub Actions logs
3. **Random Passwords:** Auto-generated secure passwords per deployment
4. **Input Validation:** Protected against command injection
5. **HTTPS Tunnels:** Encrypted connections (Cloudflare, LocalTunnel)
6. **Auto-Cleanup:** Resources freed to prevent abuse

### Cloudflare Worker Additional Security

7. **Secret Path Protection:** Admin endpoints hidden behind unpredictable paths
8. **Minimal Attack Surface:** Unknown paths return empty 404 responses
9. **No Information Disclosure:** No error messages or version hints
10. **Environment Encryption:** All credentials encrypted at rest by Cloudflare

### Best Practices

✅ **Do:**
- Keep `.env` file secure (never commit to git)
- Use strong GitHub token with minimal scopes
- Regularly rotate tokens
- Monitor GitHub Actions usage
- Review authorized user IDs periodically
- Use Cloudflare Worker's SECRET_PATH feature
- Generate secret paths with `uuidgen` or similar

❌ **Don't:**
- Share your bot token publicly
- Commit `.env` or `.dev.vars` files to repository
- Use tokens with excessive permissions
- Allow unauthorized users
- Leave instances running unnecessarily
- Reuse secret paths across projects

### Sensitive Data Handling

All sensitive data is:
- Protected by `.gitignore`
- Masked in GitHub Actions logs
- Not stored persistently
- Transmitted over HTTPS
- Auto-deleted after cleanup

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly** (both deployment methods if applicable)
5. **Commit your changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup - Python Bot

```bash
# Clone your fork
git clone https://github.com/yourusername/neko-actions.git
cd neko-actions

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd python-bot
pip install -r requirements.txt

# Copy example config
cp example.env .env
# Edit .env with your credentials

# Run bot
python telegram-manager.py
```

### Development Setup - Cloudflare Worker

```bash
# Install wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create .dev.vars for local testing
cd cloudflare-worker
cat > .dev.vars << EOF
TELEGRAM_BOT_TOKEN=your_token
GITHUB_TOKEN=your_token
ALLOWED_USER_IDS=your_id
SECRET_PATH=test-secret
EOF

# Test locally
wrangler dev

# Deploy
wrangler deploy
```

### Reporting Issues

Found a bug? Please open an issue with:
- Clear description of the problem
- Which deployment method you're using (Python/Cloudflare)
- Steps to reproduce
- Expected vs actual behavior
- Logs (with sensitive data removed)
- Environment details

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [m1k1o/neko](https://github.com/m1k1o/neko) - Amazing virtual browser/desktop project
- [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) - Secure tunnel solution
- [Bore](https://github.com/ekzhang/bore) - Simple tunnel tool
- [LocalTunnel](https://github.com/localtunnel/localtunnel) - Expose localhost to the world
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/dikeckaan/neko-actions/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dikeckaan/neko-actions/discussions)
- **Documentation:** This README

---

<div align="center">

**Made with ❤️ by [dikeckaan](https://github.com/dikeckaan)**

If you find this project useful, please consider giving it a ⭐

[Python Bot](./python-bot) • [Cloudflare Worker](./cloudflare-worker)

</div>
