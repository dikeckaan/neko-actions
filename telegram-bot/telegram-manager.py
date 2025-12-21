import os
import logging
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ALLOWED_USER_IDS = os.getenv("ALLOWED_USER_IDS", "").split(",")
GITHUB_REPO = os.getenv("GITHUB_REPO", "dikeckaan/neko-actions")
WORKFLOW_NAME = os.getenv("WORKFLOW_NAME", "telegram-bot.yml")

# Browser command mapping
BROWSER_COMMANDS = {
    "chrome": "google-chrome",
    "kde": "kde",
    "chromium": "chromium",
    "edge": "microsoft-edge",
    "opera": "opera",
    "vivaldi": "vivaldi",
    "ungoogled_chromium": "ungoogled-chromium",
    "brave": "brave",
    "firefox": "firefox",
    "latest": "latest",
    "remmina": "remmina",
    "xfce": "xfce",
    "vlc": "vlc"
}



def is_authorized(user_id: int) -> bool:
    """Check if user is authorized to use the bot."""
    return str(user_id) in ALLOWED_USER_IDS

def trigger_workflow(chat_id: str, image: str, bot_token: str) -> dict:
    """Trigger GitHub Actions workflow using GitHub API."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/actions/workflows/{WORKFLOW_NAME}/dispatches"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    payload = {
        "ref": "master",
        "inputs": {
            "chatid": chat_id,
            "image": image,
            "bottoken": bot_token
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        return {"success": True, "message": "✅ Workflow successfully triggered!"}
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error triggering workflow: {e}")
        return {"success": False, "message": f"❌ HTTP Error: {e.response.status_code}\n{e.response.text}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Error triggering workflow: {e}")
        return {"success": False, "message": f"❌ Network Error: {str(e)}"}

def cancel_workflow_run(run_id: str) -> dict:
    """Cancel a running GitHub Actions workflow."""
    url = f"https://api.github.com/repos/{GITHUB_REPO}/actions/runs/{run_id}/cancel"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    try:
        response = requests.post(url, headers=headers, timeout=10)
        response.raise_for_status()
        return {"success": True, "message": f"🟠 Workflow {run_id} is being stopped!"}
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error canceling workflow: {e}")
        return {"success": False, "message": f"❌ Failed to stop: {e.response.status_code}"}
    except requests.exceptions.RequestException as e:
        logger.error(f"Error canceling workflow: {e}")
        return {"success": False, "message": f"❌ Network Error: {str(e)}"}

async def start_browser(update: Update, context):
    """Handle browser start commands."""
    if not is_authorized(update.message.from_user.id):
        await update.message.reply_text("⛔ You are not authorized to use this bot.")
        return

    command_text = update.message.text.split("/")[1]  # Extract command name
    image_name = BROWSER_COMMANDS.get(command_text, None)
    if not image_name:
        await update.message.reply_text("❌ Invalid command!")
        return

    chat_id = str(update.message.chat.id)
    logger.info(f"User {update.message.from_user.id} requested {image_name} in chat {chat_id}")

    # Send initial acknowledgment
    await update.message.reply_text(f"🔄 Starting {image_name} instance...")

    # Trigger the workflow
    result = trigger_workflow(chat_id, image_name, TELEGRAM_BOT_TOKEN)
    await update.message.reply_text(result["message"])

async def stop_machine(run_id: str, query):
    """Stop a running GitHub Actions workflow."""
    logger.info(f"Attempting to stop workflow run {run_id}")
    result = cancel_workflow_run(run_id)
    await query.edit_message_text(result["message"])

async def button_handler(update: Update, context):
    """Handle inline keyboard button callbacks (Cancel button)."""
    query = update.callback_query
    if not is_authorized(query.from_user.id):
        await query.answer("⛔ You are not authorized to perform this action.", show_alert=True)
        return

    await query.answer()
    run_id = query.data  # The callback_data is the run_id itself
    await stop_machine(run_id, query)




async def start_command(update: Update, context):
    """Handle /start command - Welcome message with inline keyboard."""
    if not is_authorized(update.message.from_user.id):
        await update.message.reply_text("⛔ You are not authorized to use this bot.")
        return

    user_name = update.message.from_user.first_name or "User"

    welcome_text = (
        f"👋 *Welcome {user_name}!*\n\n"
        "🚀 *Neko Actions Bot* - Deploy remote desktop instances on demand\n\n"
        "This bot allows you to deploy containerized desktop environments "
        "(browsers, VLC, KDE, etc.) using GitHub Actions.\n\n"
        "Use the buttons below to get started:"
    )

    # Create inline keyboard
    keyboard = [
        [InlineKeyboardButton("📋 Available Commands", callback_data="list_commands")],
        [InlineKeyboardButton("❓ Help & Guide", callback_data="show_help")],
        [InlineKeyboardButton("🌐 GitHub Repository", url=f"https://github.com/{GITHUB_REPO}")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        welcome_text,
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

async def help_command(update: Update, context):
    """Handle /help command - Show detailed usage guide."""
    if not is_authorized(update.message.from_user.id):
        await update.message.reply_text("⛔ You are not authorized to use this bot.")
        return

    help_text = (
        "📖 *User Guide*\n\n"
        "*How to Use:*\n"
        "1️⃣ Choose a browser or desktop environment\n"
        "2️⃣ Send the command (e.g., `/chrome`)\n"
        "3️⃣ Wait for deployment (takes ~1-2 minutes)\n"
        "4️⃣ Receive connection details via message\n"
        "5️⃣ Click *Cancel* button to stop the instance\n\n"

        "*Available Commands:*\n"
        "• `/start` - Show welcome menu\n"
        "• `/help` - Show this guide\n"
        "• `/actionslist` - List all browser commands\n\n"

        "*Instance Details:*\n"
        "• Runtime: Up to 6 hours\n"
        "• Access: Via Bore Tunnel or LocalTunnel\n"
        "• Auto-cleanup: Resources freed after stop\n"
        "• Health checks: Every 5 minutes\n\n"

        "*Troubleshooting:*\n"
        "❌ If deployment fails, you'll receive an error message\n"
        "🔄 Check GitHub Actions logs for details\n"
        "⏱️ Cancel button works immediately\n\n"

        f"💡 *Repository:* [GitHub]({f'https://github.com/{GITHUB_REPO}'})"
    )

    await update.message.reply_text(help_text, parse_mode="Markdown", disable_web_page_preview=True)

async def actions_list(update: Update, context):
    """List available commands for starting browsers or other applications."""
    if not is_authorized(update.message.from_user.id):
        await update.message.reply_text("⛔ You are not authorized to use this bot.")
        return

    command_list = "\n".join([f"• `/{cmd}`" for cmd in BROWSER_COMMANDS.keys()])
    response_text = (
        "🎯 *Available Commands:*\n\n"
        f"{command_list}\n\n"
        "*Usage:*\n"
        "Simply type any command above to start an instance\n"
        "Example: `/chrome` to start Google Chrome\n\n"
        "To stop a running instance, click the *Cancel* button on the deployment message."
    )
    await update.message.reply_text(response_text, parse_mode="Markdown")

async def menu_callback_handler(update: Update, context):
    """Handle inline keyboard button clicks from the menu."""
    query = update.callback_query

    if not is_authorized(query.from_user.id):
        await query.answer("⛔ You are not authorized to perform this action.", show_alert=True)
        return

    await query.answer()

    if query.data == "list_commands":
        command_list = "\n".join([f"• `/{cmd}`" for cmd in BROWSER_COMMANDS.keys()])
        response_text = (
            "🎯 *Available Commands:*\n\n"
            f"{command_list}\n\n"
            "*Usage:*\n"
            "Simply type any command above to start an instance\n"
            "Example: `/chrome` to start Google Chrome"
        )
        await query.edit_message_text(response_text, parse_mode="Markdown")

    elif query.data == "show_help":
        help_text = (
            "📖 *Quick Guide*\n\n"
            "*Steps:*\n"
            "1️⃣ Send a command (e.g., `/chrome`)\n"
            "2️⃣ Wait ~1-2 minutes for deployment\n"
            "3️⃣ Receive connection URLs\n"
            "4️⃣ Click *Cancel* to stop\n\n"

            "*Runtime:* Up to 6 hours\n"
            "*Access:* Bore Tunnel or LocalTunnel\n"
            "*Auto-cleanup:* Yes\n\n"

            "Use `/help` for full documentation"
        )
        await query.edit_message_text(help_text, parse_mode="Markdown")
    
    
def main():
    """Initialize and start the Telegram bot."""
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN not found in environment variables!")
        return

    if not GITHUB_TOKEN:
        logger.error("GITHUB_TOKEN not found in environment variables!")
        return

    logger.info("Starting Telegram bot...")
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Add main menu commands
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("actionslist", actions_list))

    # Add command handlers dynamically for all browsers
    for command in BROWSER_COMMANDS.keys():
        app.add_handler(CommandHandler(command, start_browser))

    # Add callback handlers for inline keyboard buttons
    # Menu callbacks (from /start command)
    app.add_handler(CallbackQueryHandler(menu_callback_handler, pattern="^(list_commands|show_help)$"))
    # Cancel button callbacks (from deployment messages)
    app.add_handler(CallbackQueryHandler(button_handler, pattern="^[0-9]+$"))

    logger.info("Bot is running. Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
