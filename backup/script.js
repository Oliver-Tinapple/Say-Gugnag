// GUGNAG CHAOS SCRIPT - CHAOS LEVEL 7/10

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGugnag();
});

function initGugnag() {
    // Main button functionality
    const button = document.getElementById('gugnagButton');
    button.addEventListener('click', sayGugnag);

    // Random visitor counter updates
    updateVisitorCounter();
    setInterval(updateVisitorCounter, 3000);

    // Random title changes
    setInterval(randomTitleChange, 5000);

    // Cursor trail effect
    document.addEventListener('mousemove', createCursorTrail);

    // Random alerts (occasionally)
    setTimeout(() => {
        setInterval(randomAlert, 30000); // Every 30 seconds
    }, 10000); // Start after 10 seconds

    // Make page title blink in browser tab
    blinkPageTitle();

    console.log('🤪 GUGNAG WEBSIGHT LOADED! YOUR TEACHER HATES THIS! 🤪');
}

// Main function - Say Gugnag with audio file
function sayGugnag() {
    // Screen shake effect
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);

    // Button animation
    const button = document.getElementById('gugnagButton');
    button.style.transform = 'scale(0.9) rotate(10deg)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);

    // Play audio with random pitch shift
    playGugnagAudio();

    // Create confetti effect
    createConfetti();

    // Random bonus effects
    if (Math.random() > 0.7) {
        flashColors();
    }

    if (Math.random() > 0.8) {
        spinButton();
    }
}

// Play audio file with pitch/speed variation
// Note: playbackRate changes both pitch AND speed together (like a vinyl record)
// For true independent pitch shifting, more complex audio processing is needed
function playGugnagAudio() {
    // For now, just use simple playback rate which affects both
    // This creates fun chipmunk (fast/high) or slow-mo (slow/low) effects

    // Create new audio element each time
    const audio = new Audio('audio/gugnag.m4a');

    // Random pitch/speed shift (playback rate between 0.85 and 1.15)
    const pitchShift = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
    audio.playbackRate = pitchShift;

    // Set volume
    audio.volume = 1.0;

    // Play the audio
    audio.play().catch(err => {
        console.log('Audio playback failed:', err);

        // Try simple playback without pitch shift as fallback
        const fallbackAudio = new Audio('audio/gugnag.m4a');
        fallbackAudio.play().catch(err2 => {
            console.log('Fallback also failed:', err2);
            alert('🎉 GUGNAG! 🎉\n\n(Audio failed to load - make sure you allow audio playback)');
        });
    });
}

// Visitor counter - random numbers
function updateVisitorCounter() {
    const counter = document.getElementById('visitorCount');
    const randomCount = Math.floor(Math.random() * 999999) + 100000;
    counter.textContent = randomCount.toLocaleString();
}

// Random title changes
function randomTitleChange() {
    const titles = [
        'THE OFFICIAL GUGNAG WEBSIGHT 🔥',
        '⚠️ GUGNAG WARNING ⚠️',
        '🎄 MERRY GUGNAG 🎄',
        '🤪 SAY IT NOW 🤪',
        '💯 GUGNAG APPROVED 💯',
        '🚨 YOUR TEACHER HATES THIS 🚨',
        '✨ GUGNAG MAGIC ✨',
        '🎅 CHRISTMAS GUGNAG 🎅'
    ];

    document.title = titles[Math.floor(Math.random() * titles.length)];
}

// Blink page title
function blinkPageTitle() {
    let originalTitle = document.title;
    let isOriginal = true;

    setInterval(() => {
        if (isOriginal) {
            document.title = '✨✨✨ GUGNAG ✨✨✨';
        } else {
            document.title = originalTitle;
        }
        isOriginal = !isOriginal;
    }, 2000);
}

// Cursor trail with sparkles
let lastTrailTime = 0;
function createCursorTrail(e) {
    const now = Date.now();
    if (now - lastTrailTime < 50) return; // Throttle
    lastTrailTime = now;

    const trail = document.createElement('div');
    const sparkles = ['✨', '⭐', '💫', '🌟', '⚡'];
    trail.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.pointerEvents = 'none';
    trail.style.fontSize = '20px';
    trail.style.zIndex = '9999';
    trail.style.transition = 'all 1s ease-out';
    trail.style.opacity = '1';

    document.body.appendChild(trail);

    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'translateY(50px) scale(0.5)';
    }, 10);

    setTimeout(() => {
        trail.remove();
    }, 1000);
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff0080', '#00ff00', '#0080ff', '#ffff00', '#ff00ff', '#00ffff'];
    const emojis = ['🎉', '🎊', '✨', '⭐', '💫', '🌟'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const useEmoji = Math.random() > 0.5;

            if (useEmoji) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.fontSize = '25px';
            } else {
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            }

            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '10000';
            confetti.style.transition = 'all 3s ease-out';

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 400 - 200}px)`;
                confetti.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Flash colors effect
function flashColors() {
    const colors = [
        'linear-gradient(45deg, #ff006e, #fb5607, #ffbe0b, #8338ec, #3a86ff)',
        'linear-gradient(45deg, #00ff00, #00ffff, #ff00ff, #ffff00, #ff0000)',
        'linear-gradient(45deg, #8338ec, #3a86ff, #ff006e, #fb5607, #ffbe0b)'
    ];

    let count = 0;
    const interval = setInterval(() => {
        document.body.style.background = colors[count % colors.length];
        document.body.style.backgroundSize = '400% 400%';
        count++;
        if (count > 6) {
            clearInterval(interval);
        }
    }, 200);
}

// Spin the button
function spinButton() {
    const button = document.getElementById('gugnagButton');
    button.style.transition = 'transform 1s ease';
    button.style.transform = 'rotate(720deg) scale(1.2)';

    setTimeout(() => {
        button.style.transform = '';
    }, 1000);
}

// Random alerts
function randomAlert() {
    // Check if popups are disabled
    const disablePopups = document.getElementById('disablePopups');
    if (disablePopups && disablePopups.checked) {
        return; // Don't show popup if disabled
    }

    const messages = [
        '🎉 You have been blessed by Gugnag! 🎉',
        '⚠️ Warning: Excessive Gugnag detected! ⚠️',
        '🤪 Your teacher still hates this word! 🤪',
        '🎄 Merry Christmas from Gugnag! 🎄',
        '✨ You are visitor #' + Math.floor(Math.random() * 999999) + '! ✨',
        '🚨 GUGNAG ALERT! 🚨',
        '💫 The prophecy is true... 💫',
        '🎅 Santa says: GUGNAG! 🎅'
    ];

    // Only show alert sometimes (not always)
    if (Math.random() > 0.5) {
        const message = messages[Math.floor(Math.random() * messages.length)];
        alert(message);
    }
}

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateKonamiMode();
    }
});

function activateKonamiMode() {
    // Check if popups are disabled
    const disablePopups = document.getElementById('disablePopups');
    if (!disablePopups || !disablePopups.checked) {
        alert('🎮 KONAMI CODE ACTIVATED! 🎮\n\nULTRA GUGNAG MODE ENGAGED!');
    }

    // Make everything go crazy
    document.body.style.animation = 'gradientShift 0.5s ease infinite, shake 0.5s infinite';

    // Rapid fire Gugnag
    let count = 0;
    const interval = setInterval(() => {
        sayGugnag();
        count++;
        if (count >= 10) {
            clearInterval(interval);
            document.body.style.animation = 'gradientShift 5s ease infinite';
        }
    }, 300);
}

// Log random messages to console
console.log('%c GUGNAG ', 'background: #ff00ff; color: #ffff00; font-size: 50px; font-weight: bold;');
console.log('%c Your teacher hates this word! ', 'background: #ff0000; color: white; font-size: 20px;');
console.log('%c Merry Christmas! 🎄 ', 'background: #00ff00; color: #ff0000; font-size: 20px;');
