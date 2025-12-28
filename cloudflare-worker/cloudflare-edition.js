/**
 * Telegram Bot - Cloudflare Worker Edition
 *
 * A serverless Telegram bot that runs on Cloudflare Workers.
 * Manages remote desktop deployments via GitHub Actions.
 *
 * Environment Variables Required:
 * - TELEGRAM_BOT_TOKEN: Your Telegram bot token
 * - GITHUB_TOKEN: GitHub personal access token
 * - ALLOWED_USER_IDS: Comma-separated list of authorized Telegram user IDs
 * - SECRET_PATH: Secret path for admin endpoints (e.g., "my-secret-path-123")
 *
 * Environment Variables Optional:
 * - GITHUB_REPO: GitHub repository (default: dikeckaan/neko-actions)
 * - WORKFLOW_NAME: Workflow file name (default: telegram-bot.yml)
 * - GITHUB_BRANCH: Target branch (default: improvements)
 * - CLOUDFLARE_TUNNEL_TOKEN: Optional Cloudflare tunnel token
 */

// Browser/Desktop command mapping
const BROWSER_COMMANDS = {
  // Firefox-based browsers
  firefox: "firefox",
  tor: "tor-browser",
  waterfox: "waterfox",

  // Chromium-based browsers
  chromium: "chromium",
  chrome: "google-chrome",
  ungoogled_chromium: "ungoogled-chromium",
  edge: "microsoft-edge",
  brave: "brave",
  vivaldi: "vivaldi",
  opera: "opera",

  // Desktop Environments
  xfce: "xfce",
  kde: "kde",

  // Other Applications
  remmina: "remmina",
  vlc: "vlc"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const secretPath = env.SECRET_PATH || "";

    // Handle Telegram webhook (POST requests to root)
    if (request.method === "POST" && url.pathname === "/") {
      return handleWebhook(request, env);
    }

    // If no SECRET_PATH is set, only allow /setup for initial configuration
    if (!secretPath) {
      if (request.method === "GET" && url.pathname === "/setup") {
        return setupWebhook(request, env, "");
      }
      // Reject all other requests to save worker invocations
      return new Response(null, { status: 404 });
    }

    // Admin endpoints - protected by SECRET_PATH
    if (url.pathname.startsWith(`/${secretPath}/`)) {
      const adminPath = url.pathname.replace(`/${secretPath}/`, "");

      // Setup webhook endpoint
      if (request.method === "GET" && adminPath === "setup") {
        return setupWebhook(request, env, secretPath);
      }

      // Check webhook status
      if (request.method === "GET" && adminPath === "webhook-info") {
        return checkWebhookInfo(env);
      }

      // Delete/reset webhook
      if (request.method === "GET" && adminPath === "delete-webhook") {
        return deleteWebhook(env);
      }

      // Test message endpoint
      if (request.method === "GET" && adminPath === "test") {
        return testMessage(request, env);
      }

      // Health check endpoint
      if (request.method === "GET" && adminPath === "health") {
        return new Response(JSON.stringify({
          status: "ok",
          worker: "telegram-bot",
          authenticated: true
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Admin dashboard
      if (request.method === "GET" && adminPath === "") {
        return new Response(
          `🤖 Telegram Bot - Admin Panel\n\n` +
          `Available endpoints:\n` +
          `- GET /${secretPath}/health - Health check\n` +
          `- GET /${secretPath}/setup - Configure webhook\n` +
          `- GET /${secretPath}/webhook-info - Check webhook status\n` +
          `- GET /${secretPath}/delete-webhook - Reset webhook\n` +
          `- GET /${secretPath}/test?chat_id=ID - Test message sending\n\n` +
          `Main webhook:\n` +
          `- POST / - Telegram webhook endpoint`,
          {
            status: 200,
            headers: { "Content-Type": "text/plain" }
          }
        );
      }
    }

    // Reject all other requests to save worker invocations
    return new Response(null, { status: 404 });
  }
};

/**
 * Handle incoming Telegram webhook updates
 */
async function handleWebhook(request, env) {
  try {
    const update = await request.json();
    console.log("Received webhook update:", JSON.stringify(update, null, 2));

    // Handle callback queries (inline button clicks)
    if (update.callback_query) {
      console.log("Processing callback query");
      await handleCallbackQuery(update.callback_query, env);
      return new Response("OK", { status: 200 });
    }

    // Handle regular messages
    if (update.message) {
      console.log("Processing message");
      await handleMessage(update.message, env);
      return new Response("OK", { status: 200 });
    }

    console.log("Update type not recognized");
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    console.error("Error stack:", error.stack);
    return new Response("Error", { status: 500 });
  }
}

/**
 * Check if user is authorized
 */
function isAuthorized(userId, env) {
  const allowedIds = (env.ALLOWED_USER_IDS || "").split(",").map(id => id.trim());
  return allowedIds.includes(String(userId));
}

/**
 * Send a message to Telegram
 */
async function sendMessage(chatId, text, env, options = {}) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text
  };

  // Only add optional parameters if they are provided
  if (options.parse_mode) {
    payload.parse_mode = options.parse_mode;
  }
  if (options.reply_markup) {
    payload.reply_markup = options.reply_markup;
  }
  if (options.disable_web_page_preview) {
    payload.disable_web_page_preview = options.disable_web_page_preview;
  }

  console.log("Sending message to Telegram:", JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const responseData = await response.clone().json();

  if (!response.ok) {
    console.error("❌ Failed to send message!");
    console.error("Status:", response.status);
    console.error("Response:", JSON.stringify(responseData, null, 2));
  } else {
    console.log("✅ Message sent successfully");
    console.log("Response:", JSON.stringify(responseData, null, 2));
  }

  return response;
}

/**
 * Edit an existing message
 */
async function editMessage(chatId, messageId, text, env, options = {}) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/editMessageText`;
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text
  };

  // Only add optional parameters if they are provided
  if (options.parse_mode) {
    payload.parse_mode = options.parse_mode;
  }
  if (options.reply_markup) {
    payload.reply_markup = options.reply_markup;
  }

  console.log("Editing message:", JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const responseData = await response.clone().json();

  if (!response.ok) {
    console.error("❌ Failed to edit message!");
    console.error("Status:", response.status);
    console.error("Response:", JSON.stringify(responseData, null, 2));
  } else {
    console.log("✅ Message edited successfully");
    console.log("Response:", JSON.stringify(responseData, null, 2));
  }

  return response;
}

/**
 * Answer a callback query (acknowledge button click)
 */
async function answerCallbackQuery(callbackQueryId, env, options = {}) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  const payload = {
    callback_query_id: callbackQueryId
  };

  // Only add optional parameters if they are provided
  if (options.text) {
    payload.text = options.text;
  }
  if (options.show_alert) {
    payload.show_alert = options.show_alert;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error("Failed to answer callback query:", await response.text());
  }

  return response;
}

/**
 * Trigger GitHub Actions workflow
 */
async function triggerWorkflow(chatId, image, env) {
  const githubRepo = env.GITHUB_REPO || "dikeckaan/neko-actions";
  const workflowName = env.WORKFLOW_NAME || "telegram-bot.yml";
  const branch = env.GITHUB_BRANCH || "improvements";
  const cfToken = env.CLOUDFLARE_TUNNEL_TOKEN || "";

  const url = `https://api.github.com/repos/${githubRepo}/actions/workflows/${workflowName}/dispatches`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
    "User-Agent": "Telegram-Bot-Cloudflare-Worker"
  };

  const payload = {
    ref: branch,
    inputs: {
      chatid: chatId,
      image: image,
      bottoken: env.TELEGRAM_BOT_TOKEN,
      cloudflaretoken: cfToken
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorText}`);
      return {
        success: false,
        message: `❌ HTTP Error: ${response.status}\n${errorText.substring(0, 200)}`
      };
    }

    return {
      success: true,
      message: "✅ Workflow successfully triggered!"
    };
  } catch (error) {
    console.error("Error triggering workflow:", error);
    return {
      success: false,
      message: `❌ Network Error: ${error.message}`
    };
  }
}

/**
 * Cancel a running GitHub Actions workflow
 */
async function cancelWorkflowRun(runId, env) {
  const githubRepo = env.GITHUB_REPO || "dikeckaan/neko-actions";
  const url = `https://api.github.com/repos/${githubRepo}/actions/runs/${runId}/cancel`;
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Telegram-Bot-Cloudflare-Worker"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers
    });

    if (!response.ok) {
      console.error(`Failed to cancel workflow: ${response.status}`);
      return {
        success: false,
        message: `❌ Failed to stop: ${response.status}`
      };
    }

    return {
      success: true,
      message: `🟠 Workflow ${runId} is being stopped!`
    };
  } catch (error) {
    console.error("Error canceling workflow:", error);
    return {
      success: false,
      message: `❌ Network Error: ${error.message}`
    };
  }
}

/**
 * Handle incoming messages
 */
async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const userId = message.from.id;

  console.log(`Received message from user ${userId} in chat ${chatId}: ${message.text}`);

  // Authorization check
  if (!isAuthorized(userId, env)) {
    console.log(`User ${userId} is not authorized`);
    await sendMessage(chatId, "⛔ You are not authorized to use this bot.", env);
    return;
  }

  // Only process commands
  if (!message.text || !message.text.startsWith("/")) {
    console.log("Message is not a command, ignoring");
    return;
  }

  // Extract command (remove leading /, ignore parameters)
  const command = message.text.split(" ")[0].substring(1).split("@")[0];
  console.log(`Processing command: ${command}`);

  // Route to appropriate handler
  switch (command) {
    case "start":
      await handleStartCommand(message, env);
      break;
    case "help":
      await handleHelpCommand(message, env);
      break;
    case "actionslist":
      await handleActionsListCommand(message, env);
      break;
    default:
      // Check if it's a browser command
      if (BROWSER_COMMANDS[command]) {
        await handleBrowserCommand(message, command, env);
      } else {
        console.log(`Unknown command: ${command}`);
      }
      break;
  }
}

/**
 * Handle /start command
 */
async function handleStartCommand(message, env) {
  console.log(`Handling /start command for user ${message.from.id}`);

  const userName = message.from.first_name || "User";
  const githubRepo = env.GITHUB_REPO || "dikeckaan/neko-actions";

  const welcomeText = `👋 *Welcome ${userName}!*\n\n🚀 *Neko Actions Bot* - Deploy remote desktop instances on demand\n\nThis bot allows you to deploy containerized desktop environments (browsers, VLC, KDE, etc.) using GitHub Actions.\n\nUse the buttons below to get started:`;

  const keyboard = {
    inline_keyboard: [
      [{ text: "📋 Available Commands", callback_data: "list_commands" }],
      [{ text: "❓ Help & Guide", callback_data: "show_help" }],
      [{ text: "🌐 GitHub Repository", url: `https://github.com/${githubRepo}` }]
    ]
  };

  const result = await sendMessage(message.chat.id, welcomeText, env, {
    parse_mode: "Markdown",
    reply_markup: keyboard
  });

  console.log(`/start command response status: ${result.ok ? 'success' : 'failed'}`);
}

/**
 * Handle /help command
 */
async function handleHelpCommand(message, env) {
  const githubRepo = env.GITHUB_REPO || "dikeckaan/neko-actions";

  const helpText = `📖 *User Guide*\n\n*How to Use:*\n1️⃣ Choose a browser or desktop environment\n2️⃣ Send the command (e.g., \`/chrome\`)\n3️⃣ Wait for deployment (takes ~1-2 minutes)\n4️⃣ Receive connection details via message\n5️⃣ Click *Cancel* button to stop the instance\n\n*Available Commands:*\n• \`/start\` - Show welcome menu\n• \`/help\` - Show this guide\n• \`/actionslist\` - List all browser commands\n\n*Instance Details:*\n• Runtime: Up to 6 hours\n• Access: Via Cloudflare Tunnel, Bore or LocalTunnel\n• Auto-cleanup: Resources freed after stop\n• Health checks: Every 5 minutes\n\n*Troubleshooting:*\n❌ If deployment fails, you'll receive an error message\n🔄 Check GitHub Actions logs for details\n⏱️ Cancel button works immediately\n\n💡 *Repository:* [GitHub](https://github.com/${githubRepo})`;

  await sendMessage(message.chat.id, helpText, env, {
    parse_mode: "Markdown",
    disable_web_page_preview: true
  });
}

/**
 * Handle /actionslist command
 */
async function handleActionsListCommand(message, env) {
  const commandList = Object.keys(BROWSER_COMMANDS).map(cmd => `• \`/${cmd}\``).join("\n");

  const responseText = `🎯 *Available Commands:*\n\n${commandList}\n\n*Usage:*\nSimply type any command above to start an instance\nExample: \`/chrome\` to start Google Chrome\n\nTo stop a running instance, click the *Cancel* button on the deployment message.`;

  await sendMessage(message.chat.id, responseText, env, {
    parse_mode: "Markdown"
  });
}

/**
 * Handle browser/desktop launch commands
 */
async function handleBrowserCommand(message, command, env) {
  const imageName = BROWSER_COMMANDS[command];
  const chatId = String(message.chat.id);

  console.log(`User ${message.from.id} requested ${imageName} in chat ${chatId}`);

  // Send initial acknowledgment
  console.log(`Sending acknowledgment message for ${imageName}...`);
  const ackResult = await sendMessage(chatId, `🔄 Starting ${imageName} instance...`, env);
  console.log(`Acknowledgment message status: ${ackResult.ok ? 'success' : 'failed'}`);

  // Trigger GitHub Actions workflow
  console.log(`Triggering GitHub Actions workflow for ${imageName}...`);
  const result = await triggerWorkflow(chatId, imageName, env);
  console.log(`Workflow trigger result: ${result.success ? 'success' : 'failed'}`);

  const finalResult = await sendMessage(chatId, result.message, env);
  console.log(`Final message status: ${finalResult.ok ? 'success' : 'failed'}`);
}

/**
 * Handle callback queries (button clicks)
 */
async function handleCallbackQuery(callbackQuery, env) {
  const userId = callbackQuery.from.id;
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  console.log(`Received callback query from user ${userId} with data: ${data}`);

  // Authorization check
  if (!isAuthorized(userId, env)) {
    console.log(`User ${userId} is not authorized for callback query`);
    await answerCallbackQuery(callbackQuery.id, env, {
      text: "⛔ You are not authorized to perform this action.",
      show_alert: true
    });
    return;
  }

  // Acknowledge the callback
  await answerCallbackQuery(callbackQuery.id, env);

  // Handle menu callbacks
  if (data === "list_commands") {
    console.log("Handling list_commands callback");
    const commandList = Object.keys(BROWSER_COMMANDS).map(cmd => `• \`/${cmd}\``).join("\n");
    const responseText = `🎯 *Available Commands:*\n\n${commandList}\n\n*Usage:*\nSimply type any command above to start an instance\nExample: \`/chrome\` to start Google Chrome`;

    await editMessage(chatId, messageId, responseText, env, {
      parse_mode: "Markdown"
    });
    return;
  }

  if (data === "show_help") {
    console.log("Handling show_help callback");
    const helpText = `📖 *Quick Guide*\n\n*Steps:*\n1️⃣ Send a command (e.g., \`/chrome\`)\n2️⃣ Wait ~1-2 minutes for deployment\n3️⃣ Receive connection URLs\n4️⃣ Click *Cancel* to stop\n\n*Runtime:* Up to 6 hours\n*Access:* Cloudflare Tunnel, Bore or LocalTunnel\n*Auto-cleanup:* Yes\n\nUse \`/help\` for full documentation`;

    await editMessage(chatId, messageId, helpText, env, {
      parse_mode: "Markdown"
    });
    return;
  }

  // Handle workflow cancellation (run_id as callback_data)
  // Run IDs are numeric strings
  if (/^[0-9]+$/.test(data)) {
    const runId = data;
    console.log(`Canceling workflow run ${runId}`);
    const result = await cancelWorkflowRun(runId, env);
    await editMessage(chatId, messageId, result.message, env);
    return;
  }

  console.log(`Unknown callback data: ${data}`);
}

/**
 * Setup Telegram webhook
 * Call this endpoint once to configure the webhook URL
 * GET /:secret/setup
 */
async function setupWebhook(request, env, secretPath) {
  const url = new URL(request.url);
  const webhookUrl = `${url.protocol}//${url.host}/`;

  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`;

  const payload = {
    url: webhookUrl,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false
  };

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return new Response(JSON.stringify({
      webhook_url: webhookUrl,
      admin_panel: `${url.protocol}//${url.host}/${secretPath}/`,
      telegram_response: result,
      status: response.ok ? "success" : "failed"
    }, null, 2), {
      status: response.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      status: "failed"
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * Delete/Reset Telegram webhook
 * GET /:secret/delete-webhook
 */
async function deleteWebhook(env) {
  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/deleteWebhook`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drop_pending_updates: true })
    });

    const result = await response.json();

    return new Response(JSON.stringify({
      message: "Webhook deleted/reset successfully",
      telegram_response: result,
      status: response.ok ? "success" : "failed",
      note: "Run /setup to configure webhook again"
    }, null, 2), {
      status: response.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      status: "failed"
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * Check webhook status
 * GET /webhook-info
 */
async function checkWebhookInfo(env) {
  const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`;

  try {
    const response = await fetch(telegramUrl);
    const result = await response.json();

    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      status: "failed"
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * Test message sending
 * GET /test?chat_id=YOUR_CHAT_ID
 */
async function testMessage(request, env) {
  const url = new URL(request.url);
  const chatId = url.searchParams.get("chat_id");

  if (!chatId) {
    return new Response(JSON.stringify({
      error: "Missing chat_id parameter",
      usage: "/test?chat_id=YOUR_CHAT_ID"
    }, null, 2), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Test simple message
    const result1 = await sendMessage(chatId, "🧪 Test 1: Simple message", env);
    const response1 = await result1.json();

    // Test message with Markdown
    const result2 = await sendMessage(chatId, "*Test 2:* Message with `Markdown`", env, {
      parse_mode: "Markdown"
    });
    const response2 = await result2.json();

    // Test message with inline keyboard
    const keyboard = {
      inline_keyboard: [
        [{ text: "Test Button", callback_data: "test_callback" }]
      ]
    };
    const result3 = await sendMessage(chatId, "🧪 Test 3: Message with keyboard", env, {
      reply_markup: keyboard
    });
    const response3 = await result3.json();

    return new Response(JSON.stringify({
      status: "Tests completed",
      test1_simple: response1,
      test2_markdown: response2,
      test3_keyboard: response3
    }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
