# 🐍 Python Bot - Traditional Deployment

This is the **traditional deployment** method for Neko Actions using Python and Docker.

## 📖 Quick Links

- **[Main Documentation](../README.md)** - Complete setup guide with both deployment options
- **[Quick Start Guide](../README.md#option-a-python-bot-traditional)** - Jump directly to Python Bot setup
- **[Troubleshooting](../README.md#python-bot-issues)** - Common issues and solutions

## 🚀 Quick Start

1. **Configure environment:**
   ```bash
   cd python-bot
   cp example.env .env
   # Edit .env with your credentials
   ```

2. **Deploy with Docker:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker logs -f neko-telegram-bot
   ```

## 📁 Files in This Directory

- `telegram-manager.py` - Main bot application
- `requirements.txt` - Python dependencies
- `Dockerfile` - Docker image configuration
- `docker-compose.yml` - Docker Compose configuration
- `example.env` - Example environment variables template
- `.env` - Your actual configuration (DO NOT commit!)

## ⚙️ Required Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from @BotFather |
| `ALLOWED_USER_IDS` | Comma-separated Telegram user IDs |
| `GITHUB_REPO` | Your repository (e.g., `username/neko-actions`) |
| `GITHUB_BRANCH` | Branch to use (default: `improvements`) |

See the [main README](../README.md#python-bot) for complete configuration details.

## 🐳 Docker Commands

```bash
# Start bot
docker-compose up -d

# View logs
docker logs -f neko-telegram-bot

# Restart bot
docker-compose restart

# Stop bot
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## 🔧 Local Python Deployment (Alternative)

If you prefer running without Docker:

```bash
pip install -r requirements.txt
python telegram-manager.py
```

## 📞 Need Help?

Check the [Troubleshooting section](../README.md#python-bot-issues) in the main README.

---

**Note:** For a serverless, zero-maintenance alternative, check out the [Cloudflare Worker deployment](../cloudflare-worker/).
