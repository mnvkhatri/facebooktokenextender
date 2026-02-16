# Facebook Token Extender and Manager

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Run the development server:
   ```
   npm run dev
   ```

## How It Works

### Facebook Token Exchange & Management
This application helps you manage Facebook access tokens by converting short-lived tokens into long-lived tokens and extracting page tokens. Here's what it does:

#### Main Features:

1. **Token Exchange**
   - Takes a short-lived user access token and exchanges it for a never-expiring long-lived token
   - Uses Facebook's OAuth token exchange API with your app credentials

2. **Page Token Extraction**
   - Retrieves all pages you manage
   - Gets access tokens for each page
   - Displays page details (name, category, permissions)

3. **Cache Management**
   - Clears browser cache to ensure fresh token data
   - Helps when dealing with stale token information

#### How to Use:

1. Enter your Facebook app credentials:
   - **App ID**: Your Facebook app's ID
   - **App Secret**: Your Facebook app's secret key
   - **User Access Token**: Short-lived token from your user
   - **App-Scoped User ID**: Your Facebook user ID

2. Click "Extract Tokens" to:
   - Exchange the token for a long-lived version
   - Fetch all page tokens you have access to
   - Display token details and page information

3. Use "Clear Cache" to refresh cached data if needed

4. Copy token values using the reveal/hide buttons and copy icons

## Getting Your Credentials (Quick Guide)

### Prerequisites
- Facebook Developer Account: [Sign up here](https://developers.facebook.com)

### Step-by-Step Instructions

1. **Get Your App ID & App Secret**
   - Go to [Facebook Developers](https://developers.facebook.com)
   - Navigate to App Settings > Basic
   - Copy your **App ID** and **App Secret**

2. **Generate User Access Token**
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Request permissions (grant these scopes):
     - `read_insights`
     - `pages_show_list`
     - `business_management`
     - `pages_read_engagement`
     - `pages_manage_metadata`
     - `pages_read_user_content`
     - `pages_manage_posts`
     - `pages_manage_engagement`
   - Copy the generated token (this is your **User Access Token**)

3. **Get Your App-Scoped User ID**
   - Use [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to debug your token
   - You'll find your **App-Scoped User ID** in the token details

### Using This App

Now you have 4 credentials:
- **App ID**
- **App Secret**
- **User Access Token** (short-lived, ~1 hour)
- **App-Scoped User ID**

Enter these into the app interface and click "Extract Tokens" to get:
- ✅ **Never-expiring long-lived user access token**
- ✅ **All Facebook page access tokens** under your account
- ✅ **Page details** (name, category, permissions)

You can verify token expiry anytime using [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

## Documentation

- [Full Documentation & Details](https://docs.google.com/document/d/1VFfTS_lmi2Zr5Rta7i-Tzhrme2FGhVk2a3hmaw_hgZQ/edit?usp=sharing)

## Contact & Links

- **GitHub**: [mnvkhatri](https://github.com/mnvkhatri)
- **LinkedIn**: [mnvkhatri](https://www.linkedin.com/in/mnvkhatri/)
- **Facebook**: [mnv.khatri](https://www.facebook.com/mnv.khatri/)

For any queries, feel free to reach out! 🎉

## Notes
- node_modules and .next are not included. They will be generated on install/build.
- Only source code and config files are present.
