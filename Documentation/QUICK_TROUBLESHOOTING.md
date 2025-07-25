# Quick Troubleshooting Guide

## 🚨 Emergency Commands

### Kill All Node Processes
```bash
# Windows
taskkill /f /im node.exe

# Mac/Linux  
killall node
```

### Check What's Deployed
```bash
# Check functions (should be empty for static site)
firebase functions:list

# Check hosting status
firebase hosting:channel:list

# Check current project
firebase projects:list
```

### Clean Deploy
```bash
# 1. Kill processes
taskkill /f /im node.exe

# 2. Navigate to project
cd c:\Users\never\Desktop\personal_data\website

# 3. Deploy static only
firebase deploy --only hosting
```

## 🔍 Debug Checklist

- [ ] No functions deployed (`firebase functions:list` = empty)
- [ ] Static config in `public/index.html` shows `false` for both features
- [ ] No `<script src="/api/config">` references in HTML
- [ ] CSS classes `.chatbot-disabled` and `.messaging-disabled` exist
- [ ] Website loads without console errors
- [ ] Contact form and chatbot sections are hidden

## 💰 Cost Check

**Should be $0:**
- Hosting: Free tier (10GB storage, 10GB transfer)
- Functions: None deployed
- API calls: None made

**If you see costs, check:**
- Firebase Console → Functions (should be empty)
- Firebase Console → Usage (should show minimal hosting only)

## 🆘 Last Resort

```bash
# Complete reset
firebase logout
firebase login
taskkill /f /im node.exe
cd c:\Users\never\Desktop\personal_data\website
firebase deploy --only hosting
```
