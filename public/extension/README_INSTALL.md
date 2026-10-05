# Supply Chain & Trade News Intelligence — Autonomous Multi-Provider Browser Extension (v3.5.0)

A completely **serverless, multi-engine search & AI standalone browser extension** for Chrome, Edge, Brave, Opera, Firefox, and Safari.

---

## 🌊 Cross-Provider Rate-Limit (429) Auto-Failover & Multi-Engine Search Cascade

### 1. Will it automatically switch from one provider to another if one provider API limit is finished?
**YES, 100% automatically!**
When any configured search provider or AI model encounters:
- `HTTP 429 Too Many Requests`
- `RESOURCE_EXHAUSTED` / `quota exceeded`
- `insufficient_quota` or daily/monthly free credit limit exhausted
- Temporary upstream server outage (503 / 404)

The extension's autonomous waterfall engine **immediately catches the error and cascades to your next configured provider in line (1st → 2nd → 3rd → 4th)** without stopping or interrupting your workflow!

---

### 2. Free Search APIs Included (Add in 1 Click):
You can configure free API keys for any or all of the following web intelligence engines in **⚙️ Settings > Free Search APIs**:
1. **Tavily Search API:** 1,000 Free Agent Search Credits / Month ([Sign up at Tavily](https://app.tavily.com/sign-in))
2. **Serper.dev Google News:** 2,500 Free Google News Queries ([Sign up at Serper.dev](https://serper.dev/signup))
3. **Brave Search API:** 2,000 Free Independent Queries / Month ([Sign up at Brave Search API](https://brave.com/search/api/))
4. **Exa Neural Search:** 1,000 Free Neural Searches ($10 credit) ([Sign up at Exa.ai](https://dashboard.exa.ai/))
5. **Firecrawl API:** 500 Free Web Scrapes / Month ([Sign up at Firecrawl.dev](https://www.firecrawl.dev/app/api-keys))
6. **Google Search Grounding:** Built directly into Google Gemini Free Tier ([Google AI Studio](https://aistudio.google.com/app/apikey))

---

### 3. How to Set the Serial Priority (1st, 2nd, 3rd...):
Inside the extension popup:
1. Click **⚙️ Settings** in the top navigation bar.
2. Select the **🔍 Free Search APIs & Serial Waterfall** tab.
3. In the **Search Priority Waterfall Order** list, click the **▲ (Move Up)** and **▼ (Move Down)** buttons next to any provider to set its rank:
   - `#01 · 1st (Primary)` &rarr; First engine queried.
   - `#02 · 2nd (Fallback)` &rarr; If #1 hits 429 or quota limit, automatically switches here!
   - `#03 · 3rd (Fallback)` &rarr; If #2 runs out of credits, cascades here!
   - `#04, #05, #06...` &rarr; Seamless multi-tier resilience.
4. Enter your free API keys in the input fields below and click **🧪 Test** to verify connectivity.
5. In the **🤖 AI Models & 429 Failover** tab, you can also arrange the exact serial priority for LLM generation (`Gemini` &rarr; `Groq` &rarr; `OpenRouter` &rarr; `Cerebras` &rarr; `Grok` &rarr; `OpenAI`).
6. Click **Save All Settings**.

---

## 🚀 Easy 3-Step Installation Guide

### 1. Google Chrome & Brave
1. Unzip `supply-chain-intelligence-extension-v3.5.00000zip` into a permanent folder on your computer.
2. In your address bar, navigate to: `chrome://extensions` (or `brave://extensions`).
3. Toggle on **"Developer mode"** in the top-right corner.
4. Click **"Load unpacked"** in the top-left corner.
5. Select the unzipped folder containing `manifest.json`.
6. Click the extension puzzle icon in your browser toolbar and pin **Supply Chain Intelligence**!

### 2. Microsoft Edge
1. Unzip the downloaded zip file.
2. Navigate to: `edge://extensions`.
3. Turn on **"Developer mode"** in the left sidebar.
4. Click **"Load unpacked"** and select the unzipped folder.

### 3. Mozilla Firefox
1. Navigate to: `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select the `manifest.json` file inside the unzipped folder.

---

## 🛡️ Zero Server Load & BYOK (Bring Your Own Key) Security
- **100% Client-Side:** Direct browser-to-provider HTTPS execution. Zero user data, prompt text, or queries ever hit the developer's server.
- **Local Sandbox Storage:** Keys are saved strictly in `chrome.storage.local` inside your own browser.
