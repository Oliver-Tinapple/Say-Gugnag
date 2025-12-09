# SAY GUGNAG - Official Websight

The word your teacher doesn't want you to know! A gloriously chaotic Christmas gift celebrating the forbidden word "Gugnag".

## Features

- **Big Button**: Click to hear "Gugnag" spoken via text-to-speech
- **Chaos Level 7/10**: Rainbow backgrounds, snowfall, cursor trails, screen shake, and more
- **Fake Visitor Counter**: Random numbers that mean nothing
- **Random Alerts**: Occasional popup messages to keep you on your toes
- **Easter Egg**: Try the Konami code (↑↑↓↓←→←→BA) for ULTRA GUGNAG MODE
- **Intentionally Terrible Design**: Comic Sans, clashing colors, marquees, and excessive animations

## Local Testing

Testing locally is super easy - no server required for basic functionality!

1. Simply open `index.html` in your browser:
   - On Mac: Right-click `index.html` → Open With → Browser
   - Or drag `index.html` into your browser window

2. The text-to-speech will work immediately in Chrome, Firefox, Safari, or Edge

3. Click the big button and enjoy the chaos!

## Replacing the Audio (Optional)

The site currently uses browser text-to-speech to say "Gugnag". To use your own audio recording:

1. Record someone saying "Gugnag" and save as `gugnag.mp3`
2. Create an `audio` folder: `mkdir audio`
3. Move your audio file: `mv gugnag.mp3 audio/`
4. Update `script.js` - replace the `sayGugnag()` function with:

```javascript
function sayGugnag() {
    // Keep the screen shake and visual effects...
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 500);

    // Play audio file instead of TTS
    const audio = new Audio('audio/gugnag.mp3');
    audio.play();

    createConfetti();
    // ... rest of the effects
}
```

## Railway Deployment

Deploy this masterpiece to the internet via Railway:

### Step 1: Push to GitHub (if not already)

```bash
cd "Say Gugnag"
git init
git add .
git commit -m "Initial commit: Gugnag websight"
git branch -M main
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/say-gugnag.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up or log in
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `say-gugnag` repository
6. Railway will auto-detect the Node.js project and deploy!

### Step 3: Configure Custom Domain (Optional)

1. In your Railway project, go to Settings
2. Click on "Domains"
3. Add your custom domain
4. Update your domain's DNS settings as instructed by Railway

That's it! Your Gugnag websight will be live on the internet.

## Environment Variables

None needed! This is a simple static site.

## Browser Compatibility

- **Chrome/Edge**: Full support, best experience
- **Firefox**: Full support
- **Safari**: Full support
- **Internet Explorer**: Not supported (and why would you?)

## Technologies Used

- Pure HTML, CSS, and JavaScript (no frameworks!)
- Web Speech API for text-to-speech
- CSS animations for maximum chaos
- http-server for Railway deployment

## Credits

- Created as a Christmas gift
- Powered by chaos and Comic Sans
- 0% approved by teachers worldwide

## License

MIT License - Do whatever you want with this beautiful disaster

---

**DISCLAIMER**: This websight is intentionally terrible. Any resemblance to good web design practices is purely coincidental.

Merry Christmas! 🎄 Say Gugnag! 🤪
