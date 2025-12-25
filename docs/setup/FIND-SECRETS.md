# 🔍 Step-by-Step: How to Find Each Secret Value

Follow these steps to find all 4 secret values you need.

---

## 🔑 Secret #1: VERCEL_TOKEN

### Steps:

1. **Open your browser** and go to:
   ```
   https://vercel.com/account/tokens
   ```
   (Or: Vercel.com → Click your profile (top right) → Settings → Tokens)

2. **You'll see a page with "Tokens"**

3. **Click the big button** that says **"Create Token"** (usually at the top)

4. **Fill in:**
   - **Name:** Type `GitHub Actions` (or any name you want)
   - **Expiration:** Leave as "No expiration" (or choose a date)
   - Click **"Create Token"**

5. **IMPORTANT:** A token will appear (looks like: `vercel_xxxxxxxxxxxxx`)
   - **Copy it immediately!** 
   - **You won't see it again!**
   - Paste it somewhere safe (Notepad, etc.)

6. **✅ You now have VERCEL_TOKEN!** Save it - you'll paste it into GitHub later.

---

## 🔑 Secret #2: VERCEL_ORG_ID

### Steps:

1. **Open your browser** and go to:
   ```
   https://vercel.com/account/general
   ```
   (Or: Vercel.com → Your profile → Settings → General)

2. **Scroll down** to find the section that says **"Team"** or **"Organization"**

3. **Look for:**
   - **"Team ID"** - Copy this!
   - OR **"Organization ID"** - Copy this!
   
   It might look like:
   - `team_abc123xyz`
   - OR just your username (like `yourname`)

4. **✅ You now have VERCEL_ORG_ID!** Save it.

---

## 🔑 Secret #3: VERCEL_PROJECT_ID

### Steps:

1. **Open your browser** and go to:
   ```
   https://vercel.com/dashboard
   ```

2. **Find your QuickBite project** in the list of projects
   - Click on it to open it

3. **At the top**, click on **"Settings"** tab

4. **In the left sidebar**, click **"General"**

5. **Scroll down** to find **"Project ID"**
   - It looks like: `prj_abc123xyz` or `prj_xxxxxxxxx`
   - **Copy it!**

6. **✅ You now have VERCEL_PROJECT_ID!** Save it.

**Alternative:** If you can't find it:
- The Project ID might also be in the URL: `vercel.com/yourname/projectname`
- But it's better to get it from Settings → General

---

## 🔑 Secret #4: GOOGLE_GENAI_API_KEY

### Steps:

1. **Open your browser** and go to:
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **Sign in** with your Google account (if not already signed in)

3. **You'll see a page** with your API keys (if you have any)

4. **Option A: You already have a key**
   - Look for an existing API key in the list
   - Click the **copy icon** (📋) next to it
   - **✅ Done!**

5. **Option B: You need to create a new key**
   - Click **"Create API Key"** button
   - Select your Google Cloud project (or create one)
   - Click **"Create API Key"**
   - A key will appear - **Copy it immediately!**
   - It looks like: `AIzaSyC...` (a long string)

6. **✅ You now have GOOGLE_GENAI_API_KEY!** Save it.

---

## 📝 Now Write Down All 4 Values

Before going to GitHub, make sure you have all 4 values written down:

```
1. VERCEL_TOKEN = vercel_xxxxxxxxxxxxx
2. VERCEL_ORG_ID = team_abc123 (or your username)
3. VERCEL_PROJECT_ID = prj_abc123xyz
4. GOOGLE_GENAI_API_KEY = AIzaSyC...
```

---

## ➡️ Next Step: Add Them to GitHub

Once you have all 4 values:

1. **Go to:** https://github.com/unnita1235/QuickBite/settings/secrets/actions

2. **For each secret:**
   - Click **"New repository secret"**
   - Name: (paste the name exactly as shown above)
   - Value: (paste the value you copied)
   - Click **"Add secret"**

3. **Repeat 4 times** (once for each secret)

4. **✅ Done!**

---

## 🆘 Troubleshooting

### "I can't find VERCEL_TOKEN"
- Make sure you're logged into Vercel
- Go directly to: https://vercel.com/account/tokens
- If you don't see "Create Token", you might need to verify your account

### "I can't find VERCEL_ORG_ID"
- Try: https://vercel.com/account/general
- Look for "Team ID" or "Organization ID"
- If you're on a free plan, it might just be your username

### "I can't find VERCEL_PROJECT_ID"
- Make sure you're looking at the RIGHT project (QuickBite)
- Settings → General → Scroll down
- It's definitely there - keep scrolling!

### "I don't have GOOGLE_GENAI_API_KEY"
- Go to: https://aistudio.google.com/app/apikey
- Click "Create API Key"
- It's free - just need a Google account

---

## ✅ Checklist

Before going to GitHub, check:

- [ ] I have VERCEL_TOKEN (from vercel.com/account/tokens)
- [ ] I have VERCEL_ORG_ID (from vercel.com/account/general)
- [ ] I have VERCEL_PROJECT_ID (from Vercel project Settings → General)
- [ ] I have GOOGLE_GENAI_API_KEY (from aistudio.google.com/app/apikey)
- [ ] All 4 values are saved somewhere safe

**Ready?** Now go add them to GitHub! 🚀

---

**Quick Links:**
- Vercel Tokens: https://vercel.com/account/tokens
- Vercel General: https://vercel.com/account/general
- Vercel Dashboard: https://vercel.com/dashboard
- Google AI Studio: https://aistudio.google.com/app/apikey
- GitHub Secrets: https://github.com/unnita1235/QuickBite/settings/secrets/actions

