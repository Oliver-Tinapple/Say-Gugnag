# Gugnag Website - Text Content Reference

This file lists all text content on the website and where to find it for easy editing.

---

## HTML FILE (index.html)

### Page Title (Browser Tab)
- **Location**: Line 6
- **Current Text**: `THE OFFICIAL GUGNAG WEBSIGHT 🔥`
- **Note**: This is the initial title. It changes randomly via JavaScript (see below)

### Top Marquee
- **Location**: Lines 27-29
- **Current Text**: `⚠️ Warning: Screaming this word at the top of your lungs will result in PAIN⚠️`

### Main Header
- **Location**: Line 33
- **Current Text**: `SAY GUGNAG`

### Subheader (Blinking)
- **Location**: Line 34
- **Current Text**: `✨ OFFICIAL WEBSIGHT ✨`

### Warning Box (Alternating Marquee)
- **Location**: Line 38
- **Current Text**: `🚨 PROCEED WITH CAUTION 🚨`

### Big Button Text
- **Location**: Line 43
- **Current Text**: `CLICK TO SAY GUGNAG`

### Spinning Text
- **Location**: Line 49
- **Current Text**: `🌟 THE WORD YOUR TEACHER YOUR TEACHER LOVES 🌟`

### Visitor Counter Label
- **Location**: Line 54
- **Current Text**: `VISITORS:` (SVG text)
- **Note**: The number itself is randomly generated via JavaScript

### Bottom Marquee
- **Location**: Lines 59-61
- **Current Text**: `🎄 MERRY CHRISTMAS 🎄 HAPPY GUGNAG 🎄 SEASON'S GREETINGS 🎄`

### Badge 1
- **Location**: Line 65
- **Current Text**: `⭐ FAVORITE WORD AMONGST YAHOO USERS ⭐`

### Badge 2
- **Location**: Lines 67-69
- **Current Text**: `💯 100% APPROVED BY ZERO TEACHERS 💯`

### Badge 3 (Rotating)
- **Location**: Lines 70-72
- **Current Text**: `🔥 UNDER CONSTRUCTION 🔥`

### Footer Copyright
- **Location**: Line 76
- **Current Text**: `© 2024 "GUGNAG DANIALS" ENTERPRISES™`

### Footer Subtitle
- **Location**: Line 77
- **Current Text**: `This websight is intentionally terrible`

### Footer Marquee
- **Location**: Lines 78-80
- **Current Text**: `🎅 A CHRISTMAS GIFT FROM THE INTERNET 🎅`

### Popup Toggle Checkbox Label
- **Location**: Line 86
- **Current Text**: `turn off popups like a bitch`

---

## JAVASCRIPT FILE (script.js)

### Random Page Titles (Browser Tab)
- **Location**: Lines 107-114
- **Current Titles**:
  - `THE OFFICIAL GUGNAG WEBSIGHT 🔥`
  - `⚠️ GUGNAG WARNING ⚠️`
  - `🎄 MERRY GUGNAG 🎄`
  - `SAY IT NOW `
  - `GUGNAG MOTHER FUCKER`
  - `🚨 SCREAM IT NOW 🚨`
  - `✨ GUGNAG ✨`
  - `🎅 CHRISTMAS GUGNAG 🎅`
- **Note**: One of these is randomly selected every 5 seconds

### Blinking Page Title (Browser Tab)
- **Location**: Line 110 (inside blinkPageTitle function)
- **Current Text**: `✨✨✨ GUGNAG ✨✨✨`
- **Note**: Alternates with the random titles every 2 seconds

### Random Alert Popups (Can be disabled with checkbox)
- **Location**: Lines 228-235 in script.js
- **Frequency**: Appears every 30 seconds (only 50% chance each time)
- **How to Edit**: Change the text in the `messages` array
- **Current Messages**:
  1. Line 229: `🎉 die 🎉`
  2. Line 230: `⚠️ Warning: Excessive Gugnag detected! ⚠️`
  3. Line 231: `🤪 Your teacher loves hates this word! 🤪`
  4. Line 232: `🎄 Merry Christmas from Gugnag! 🎄`
  5. Line 233: `✨ You are visitor #[random number] loser! ✨` (number auto-generated)
  6. Line 234: `🚨 GUGNAG ALERT! 🚨`
  7. Line 235: `💫 The prophecy is true... 💫`
  8. Line 236: `🎅 Santa says: GUGNAG! 🎅`
- **Note**: Users can disable these by checking the "turn off popups" checkbox at the bottom

### Konami Code Activation Alert
- **Location**: Line 257
- **Current Text**: `🎮 KONAMI CODE ACTIVATED! 🎮\n\nULTRA GUGNAG MODE ENGAGED!`
- **Note**: Shows when user enters the Konami code (↑↑↓↓←→←→BA)

### Audio Fallback Alert
- **Location**: Line 95
- **Current Text**: `🎉 GUGNAG! 🎉\n\n(Audio failed to load - make sure you allow audio playback)`
- **Note**: Only shows if audio playback fails

### Console Messages
- **Location**: Lines 272-274
- **Current Messages**:
  - `GUGNAG` (big purple/yellow text)
  - `Your teacher hates this word!` (red background)
  - `Merry Christmas! 🎄` (green/red text)
- **Note**: These appear in the browser developer console

### Page Load Console Message
- **Location**: Line 31
- **Current Text**: `🤪 GUGNAG WEBSIGHT LOADED! YOUR TEACHER HATES THIS! 🤪`

---

## EDITING TIPS

1. **HTML texts** are straightforward - just change the text between tags
2. **JavaScript array texts** (like random alerts) - edit the strings in the arrays
3. **Emojis** can be replaced with any other emoji or removed entirely
4. **Keep the formatting** (like `\n` for new lines in alerts)
5. **Test after editing** by opening index.html in your browser

---

## POPUP ALERT DETAILS

The website has 3 different types of popups:

### 1. Random Timed Popups (Lines 228-236 in script.js)
- **When**: Every 30 seconds, with 50% chance of actually showing
- **Can be disabled**: Yes, with the checkbox
- **8 different messages** - edit any or all of them!

### 2. Konami Code Popup (Line 257 in script.js)
- **When**: User enters ↑↑↓↓←→←→BA on keyboard
- **Can be disabled**: Yes, respects the checkbox
- **Message**: "KONAMI CODE ACTIVATED! ULTRA GUGNAG MODE ENGAGED!"

### 3. Audio Failure Popup (Line 95 in script.js)
- **When**: Only if audio fails to load/play
- **Can be disabled**: No (it's an error message)
- **Message**: "GUGNAG! (Audio failed to load...)"

---

## QUICK EDIT CHECKLIST

Want to change the vibe? Here are the key texts to focus on:

- [ ] Main header (Line 33 in index.html) - The big "SAY GUGNAG"
- [ ] Button text (Line 43 in index.html) - What the button says
- [ ] Top warning (Line 28 in index.html) - Teacher warning message
- [ ] Random popup alerts (Lines 229-236 in script.js) - 8 popup messages
- [ ] Badges (Lines 65-72 in index.html) - The three badges at the bottom
- [ ] Page tab titles (Lines 107-114 in script.js) - 8 rotating titles

Have fun making it even more chaotic! 🤪
