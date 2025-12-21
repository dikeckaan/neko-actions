# 🚀 Neko Actions - On-Demand Remote Desktop Deployment

[![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-blue?logo=github-actions)](https://github.com/features/actions)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://core.telegram.org/bots)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue?logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Deploy containerized remote desktop environments (browsers, VLC, KDE, etc.) on-demand using GitHub Actions, controlled entirely through Telegram.

Based on [m1k1o/neko](https://github.com/m1k1o/neko) - a self-hosted virtual browser/desktop infrastructure for security, privacy, and performance.

## 📋 Table of Contents

- [Features](#-features)
- [How It Works](#-how-it-works)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Tunnel Options](#-tunnel-options)
- [Telegram Commands](#-telegram-commands)
- [Docker Deployment](#-docker-deployment)
- [Advanced Usage](#-advanced-usage)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🎯 **On-Demand Deployment** - Deploy remote desktop instances instantly via Telegram
- 🌐 **Multiple Tunnel Options** - Choose from Cloudflare, Bore, or LocalTunnel
- 🔐 **Secure Access** - User authorization, masked credentials, auto-generated passwords
- ⏱️ **Auto-Cleanup** - Resources freed automatically after use
- 📊 **Health Monitoring** - Periodic health checks every 5 minutes
- 🛑 **Instant Cancellation** - Stop deployments with a single button click

### Supported Environments
- 🌍 **Browsers**: Chrome, Firefox, Edge, Chromium, Opera, Vivaldi, Brave, Ungoogled Chromium
- 🖥️ **Desktops**: KDE, XFCE
- 📺 **Media**: VLC
- 🔧 **Tools**: Remmina, Latest

### User Experience
- 📱 Interactive Telegram bot with inline keyboards
- 🔔 Real-time deployment notifications
- ❌ Error notifications with detailed logs
- 📖 Built-in help system and command guide
- 🎨 Clean HTML-formatted messages

### Technical Features
- 🔒 **Security**: Command injection protection, secure token handling
- 🐳 **Docker Support**: Containerized bot deployment
- 📝 **Comprehensive Logging**: Debug-friendly output
- 🔄 **Auto-Restart**: Container restart policies
- 🧹 **Resource Management**: Proper cleanup on success/failure/cancellation
- ⚡ **Performance**: Optimized workflow with caching

## 🔄 How It Works

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Telegram  │─────▶│  Bot (Local/ │─────▶│ GitHub Actions  │
│     User    │      │    Docker)   │      │    Workflow     │
└─────────────┘      └──────────────┘      └─────────────────┘
       ▲                                             │
       │                                             ▼
       │                                    ┌─────────────────┐
       │                                    │  Deploy Neko    │
       │                                    │  Container      │
       │                                    └─────────────────┘
       │                                             │
       │                                             ▼
       │                                    ┌─────────────────┐
       │                                    │  Start Tunnels  │
       │                                    │  (CF/Bore/LT)   │
       │                                    └─────────────────┘
       │                                             │
       └─────────────────────────────────────────────┘
                      Send credentials & URLs
```

1. **User sends command** (e.g., `/chrome`) in Telegram
2. **Bot triggers GitHub Actions** workflow with parameters
3. **Workflow deploys** Neko container with selected environment
4. **Tunnels are created** (Cloudflare, Bore, LocalTunnel)
5. **Credentials sent** to user via Telegram with access URLs
6. **User accesses** remote desktop through any tunnel
7. **Click Cancel** button to stop instance and cleanup resources

## 📦 Prerequisites

### Required
- GitHub account with Actions enabled
- Telegram account
- Git installed on your machine

### Optional
- Docker (for running the bot locally)
- Cloudflare account (for named tunnels)

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
4. Select scopes: `repo`, `workflow`
5. Click **Generate token**
6. Copy the token (starts with `ghp_`)

### 4. Configure Environment

Navigate to `telegram-bot/` directory:

```bash
cd telegram-bot
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

### 5. Deploy Bot

#### Option A: Docker (Recommended)

```bash
cd telegram-bot
docker-compose up -d
```

Check logs:
```bash
docker logs -f neko-telegram-bot
```

#### Option B: Local Python

```bash
cd telegram-bot
pip install -r requirements.txt
python telegram-manager.py
```

### 6. Start Using!

Open Telegram and send `/start` to your bot. You'll see an interactive menu!

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | ✅ Yes | - | GitHub Personal Access Token with `repo` and `workflow` scopes |
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | - | Telegram bot token from BotFather |
| `ALLOWED_USER_IDS` | ✅ Yes | - | Comma-separated list of authorized Telegram user IDs |
| `GITHUB_REPO` | ❌ No | `dikeckaan/neko-actions` | Your forked repository (format: `owner/repo`) |
| `GITHUB_BRANCH` | ❌ No | `improvements` | Branch to trigger workflows from |
| `WORKFLOW_NAME` | ❌ No | `telegram-bot.yml` | Workflow filename |
| `CLOUDFLARE_TUNNEL_TOKEN` | ❌ No | ` ` (empty) | Cloudflare Tunnel token for named tunnel |

### Multiple Users

To allow multiple users, add their Telegram IDs separated by commas:

```ini
ALLOWED_USER_IDS=123456789,987654321,555666777
```

## 🌐 Tunnel Options

The bot provides **three tunnel options** to access your deployed instance:

### 1. ☁️ Cloudflare Tunnel (Recommended)

**Advantages:**
- Fastest performance (Cloudflare CDN)
- Most reliable (enterprise-grade infrastructure)
- DDoS protection included
- Global edge network

**Setup:**

#### Quick Tunnel (Random Domain)
Leave `CLOUDFLARE_TUNNEL_TOKEN` empty in `.env`:

```ini
# CLOUDFLARE_TUNNEL_TOKEN=
```

Result: `https://random-xyz.trycloudflare.com`

#### Named Tunnel (Your Domain)
1. Create a Cloudflare account (free)
2. Go to [Cloudflare Zero Trust](https://one.dash.cloudflare.com/)
3. Navigate to **Networks → Tunnels**
4. Create a new tunnel
5. Copy the tunnel token
6. Add to `.env`:

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
- HTTP only

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

## 📱 Telegram Commands

### Main Commands

| Command | Description |
|---------|-------------|
| `/start` | Show welcome menu with interactive buttons |
| `/help` | Display detailed usage guide and troubleshooting |
| `/actionslist` | List all available browser/desktop environments |

### Browser/Desktop Commands

| Command | Environment | Description |
|---------|-------------|-------------|
| `/chrome` | Google Chrome | Latest stable Chrome browser |
| `/firefox` | Firefox | Latest stable Firefox browser |
| `/edge` | Microsoft Edge | Microsoft Edge browser |
| `/chromium` | Chromium | Open-source Chromium browser |
| `/opera` | Opera | Opera browser |
| `/vivaldi` | Vivaldi | Vivaldi browser |
| `/brave` | Brave | Privacy-focused Brave browser |
| `/ungoogled_chromium` | Ungoogled Chromium | Privacy-enhanced Chromium |
| `/kde` | KDE Desktop | Full KDE Plasma desktop environment |
| `/xfce` | XFCE Desktop | Lightweight XFCE desktop |
| `/vlc` | VLC Media Player | VLC media player |
| `/remmina` | Remmina | Remote desktop client |
| `/latest` | Latest | Latest experimental build |

### Interactive Features

After deployment, you'll receive a message with:
- ☁️ **Cloudflare Tunnel URL** - Click to access via Cloudflare
- 🔀 **Bore Tunnel URL** - Click to access via Bore
- 🌍 **LocalTunnel URL** - Click to access via LocalTunnel
- 🌎 **Public IP** - Server's public IP address
- 🔹 **Neko Password** - Regular user password
- 🔹 **Neko Admin Password** - Administrator password
- 🆔 **Run ID** - Unique workflow run identifier
- **[Cancel]** button - Click to immediately stop the instance

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The bot includes a complete Docker setup with health checks and auto-restart.

**Start the bot:**
```bash
cd telegram-bot
docker-compose up -d
```

**View logs:**
```bash
docker logs -f neko-telegram-bot
```

**Stop the bot:**
```bash
docker-compose down
```

**Restart the bot:**
```bash
docker-compose restart
```

**Rebuild after configuration changes:**
```bash
docker-compose up -d --build
```

### Docker Compose Configuration

The included `docker-compose.yml` provides:
- Automatic restart on failure
- Health checks every 30 seconds
- Resource limits (0.5 CPU, 256MB RAM)
- Environment variable injection from `.env`
- Log rotation (max 10MB per file, 3 files)

### Manual Docker Commands

```bash
# Build image
docker build -t neko-telegram-bot .

# Run container
docker run -d \
  --name neko-telegram-bot \
  --restart unless-stopped \
  --env-file .env \
  neko-telegram-bot

# View logs
docker logs -f neko-telegram-bot

# Stop container
docker stop neko-telegram-bot

# Remove container
docker rm neko-telegram-bot
```

## 🎓 Advanced Usage

### Custom Workflow Branch

By default, workflows run from the `improvements` branch. To use a different branch:

```ini
GITHUB_BRANCH=main
```

Restart the bot to apply changes.

### Workflow Parameters

The workflow accepts these inputs:
- `chatid` - Telegram chat ID (auto-filled)
- `image` - Browser/desktop image name (auto-filled)
- `bottoken` - Telegram bot token (auto-filled)
- `cloudflaretoken` - Cloudflare tunnel token (optional)

### Runtime Limits

- **Maximum runtime:** 6 hours per instance
- **Health checks:** Every 5 minutes
- **Auto-cleanup:** On timeout, cancellation, or failure

### Extending Instance Lifetime

To run longer than 6 hours:
1. Modify workflow file: `.github/workflows/telegram-bot.yml`
2. Find: `END_TIME=$((SECONDS + 21600))  # 6 hours`
3. Change `21600` to desired seconds (e.g., `43200` for 12 hours)
4. Commit and push changes

⚠️ Note: GitHub Actions free tier has usage limits. Monitor your quota.

## 🔧 Troubleshooting

### Bot Not Responding

**Check bot status:**
```bash
docker logs neko-telegram-bot
```

**Common issues:**
- ❌ Invalid `TELEGRAM_BOT_TOKEN` → Check token with BotFather
- ❌ Unauthorized user → Add your user ID to `ALLOWED_USER_IDS`
- ❌ Bot not running → Start with `docker-compose up -d`

### Deployment Failed

**Check GitHub Actions logs:**
1. Go to your repository
2. Click **Actions** tab
3. Click the failed workflow run
4. Review error messages

**Common issues:**
- ❌ Invalid `GITHUB_TOKEN` → Regenerate token with correct scopes
- ❌ Docker pull failed → GitHub Actions may be rate-limited, wait and retry
- ❌ Tunnel startup failed → Check logs for specific tunnel errors

### Telegram Message Not Received

**Error notification sent instead of credentials:**
- Check GitHub Actions logs for the specific error
- Workflow may have failed during deployment

**No message at all:**
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check workflow logs for "Sending message to Telegram..."
- Ensure user ID matches the one triggering the workflow

### Cloudflare Tunnel Issues

**Named tunnel not working:**
- Verify token is correct and not expired
- Check tunnel is active in Cloudflare dashboard
- Review workflow logs for tunnel startup errors

**Quick tunnel not generating URL:**
- Check workflow logs for "cloudflared" output
- May need to increase sleep time in workflow
- Try manual deployment to debug

### Container Connection Issues

**Cannot access via tunnels:**
- Wait 1-2 minutes for tunnels to fully initialize
- Try all three tunnel options
- Check if Neko container is running in workflow logs

**"Connection refused" error:**
- Container may have crashed - check workflow logs
- Port 8080 may be blocked - unlikely on GitHub Actions
- Health check may have failed - review logs

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                    Telegram User                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Telegram Bot (Docker/Local)                 │
│  - Command handling (/start, /chrome, etc.)             │
│  - User authorization                                    │
│  - Workflow triggering via GitHub API                   │
│  - Callback handling (Cancel button)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  GitHub Actions                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  1. Deploy Neko Docker Container                  │  │
│  │     - Pull image (m1k1o/neko:<environment>)       │  │
│  │     - Generate random passwords                   │  │
│  │     - Start container on port 8080                │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  2. Initialize Tunnels                            │  │
│  │     - Cloudflare Tunnel (named or quick)          │  │
│  │     - Bore Tunnel                                 │  │
│  │     - LocalTunnel                                 │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  3. Send Credentials to Telegram                  │  │
│  │     - Extract tunnel URLs                         │  │
│  │     - Format HTML message                         │  │
│  │     - Send via Telegram API                       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  4. Keep Alive & Monitor                          │  │
│  │     - Health checks every 5 minutes               │  │
│  │     - Container status monitoring                 │  │
│  │     - Run for up to 6 hours                       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  5. Cleanup (on timeout/cancel/error)             │  │
│  │     - Stop Docker containers                      │  │
│  │     - Kill tunnel processes                       │  │
│  │     - Free resources                              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Security Features

1. **Authorization:** Only whitelisted Telegram users can trigger deployments
2. **Token Masking:** Sensitive data masked in GitHub Actions logs
3. **Random Passwords:** Auto-generated secure passwords per deployment
4. **Input Validation:** Protected against command injection
5. **HTTPS Tunnels:** Encrypted connections (Cloudflare, LocalTunnel)
6. **Auto-Cleanup:** Resources freed to prevent abuse

### Technologies Used

- **Backend:** Python 3.11
- **Bot Framework:** python-telegram-bot
- **HTTP Client:** requests
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Tunneling:** Cloudflare Tunnel, Bore, LocalTunnel
- **Remote Desktop:** Neko (Docker)

## 🔐 Security

### Best Practices

✅ **Do:**
- Keep `.env` file secure (never commit to git)
- Use strong GitHub token with minimal scopes
- Regularly rotate tokens
- Monitor GitHub Actions usage
- Review authorized user IDs periodically

❌ **Don't:**
- Share your bot token publicly
- Commit `.env` file to repository
- Use tokens with excessive permissions
- Allow unauthorized users
- Leave instances running unnecessarily

### Sensitive Data Handling

All sensitive data is:
- Masked in GitHub Actions logs
- Not stored persistently
- Transmitted over HTTPS
- Auto-deleted after cleanup

### .gitignore

The repository includes a `.gitignore` that protects:
- `.env` files
- Python cache files
- Docker artifacts
- IDE configurations

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/neko-actions.git
cd neko-actions

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd telegram-bot
pip install -r requirements.txt

# Copy example config
cp example.env .env
# Edit .env with your credentials

# Run bot
python telegram-manager.py
```

### Reporting Issues

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Logs (with sensitive data removed)
- Environment details (OS, Python version, etc.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [m1k1o/neko](https://github.com/m1k1o/neko) - Amazing virtual browser/desktop project
- [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) - Secure tunnel solution
- [Bore](https://github.com/ekzhang/bore) - Simple tunnel tool
- [LocalTunnel](https://github.com/localtunnel/localtunnel) - Expose localhost to the world

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/dikeckaan/neko-actions/issues)
- **Discussions:** [GitHub Discussions](https://github.com/dikeckaan/neko-actions/discussions)

---

<div align="center">

**Made with ❤️ by [dikeckaan](https://github.com/dikeckaan)**

If you find this project useful, please consider giving it a ⭐!

</div>
