// EDITABLE TEXT SYSTEM - Anyone can edit by clicking!

const API_URL = window.location.origin;

// Timer for auto-reset
let lastEditTime = null;
let resetTimer = null;
let countdownTimer = null;
let countdownElement = null;

// Load text from database and apply to page
async function loadEditableText() {
    try {
        const response = await fetch(`${API_URL}/api/text`);
        const data = await response.json();

        // Apply loaded text to elements
        if (data.main_header) {
            const header = document.querySelector('h1');
            if (header) header.textContent = data.main_header;
        }

        if (data.button_text) {
            const button = document.querySelector('.button-text');
            if (button) button.textContent = data.button_text;
        }

        if (data.top_marquee) {
            const marquee = document.querySelector('.top-marquee');
            if (marquee) marquee.textContent = data.top_marquee;
        }

        if (data.spinning_text) {
            const spinning = document.querySelector('.spinning-text');
            if (spinning) spinning.textContent = data.spinning_text;
        }

        if (data.badge1) {
            const badges = document.querySelectorAll('.badge');
            if (badges[0]) badges[0].innerHTML = `<blink>${data.badge1}</blink>`;
        }

        if (data.badge2) {
            const badges = document.querySelectorAll('.badge');
            if (badges[1]) badges[1].textContent = data.badge2;
        }

        if (data.badge3) {
            const badges = document.querySelectorAll('.badge');
            if (badges[2]) badges[2].textContent = data.badge3;
        }

        if (data.footer_copyright) {
            const copyright = document.querySelector('.rainbow-text');
            if (copyright) copyright.textContent = data.footer_copyright;
        }

        if (data.popup_checkbox) {
            const checkbox = document.querySelector('.popup-toggle span');
            if (checkbox) checkbox.textContent = data.popup_checkbox;
        }

    } catch (err) {
        console.log('Could not load text from database, using defaults:', err);
    }
}

// Make element editable
function makeEditable(element, key) {
    element.style.cursor = 'pointer';
    element.title = 'Click to edit!';

    element.addEventListener('click', function(e) {
        // Don't make it editable if it's already being edited
        if (element.contentEditable === 'true') return;

        const originalText = element.textContent;

        // Make it editable
        element.contentEditable = 'true';
        element.style.outline = '3px solid #00ff00';
        element.style.background = 'rgba(0, 255, 0, 0.1)';
        element.focus();

        // Select all text
        const range = document.createRange();
        range.selectNodeContents(element);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        // Save on Enter or when clicking away
        const saveEdit = async () => {
            const newText = element.textContent.trim();

            if (newText && newText !== originalText) {
                // Save to database
                try {
                    await fetch(`${API_URL}/api/text/${key}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ value: newText })
                    });
                    console.log(`Saved ${key}: ${newText}`);

                    // Start auto-reset timer after successful save
                    startResetTimer();
                } catch (err) {
                    console.error(`Error saving ${key}:`, err);
                    alert('Failed to save! Changes not saved.');
                    element.textContent = originalText;
                }
            } else if (!newText) {
                // Restore original if empty
                element.textContent = originalText;
            }

            // Reset editing state
            element.contentEditable = 'false';
            element.style.outline = '';
            element.style.background = '';
        };

        // Save on Enter key
        const handleKeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
                element.removeEventListener('keydown', handleKeydown);
                element.removeEventListener('blur', handleBlur);
            } else if (e.key === 'Escape') {
                element.textContent = originalText;
                element.contentEditable = 'false';
                element.style.outline = '';
                element.style.background = '';
                element.removeEventListener('keydown', handleKeydown);
                element.removeEventListener('blur', handleBlur);
            }
        };

        // Save when clicking away
        const handleBlur = () => {
            setTimeout(() => {
                saveEdit();
                element.removeEventListener('keydown', handleKeydown);
                element.removeEventListener('blur', handleBlur);
            }, 100);
        };

        element.addEventListener('keydown', handleKeydown);
        element.addEventListener('blur', handleBlur);
    });
}

// Initialize editable system
function initEditableText() {
    // Load text from database first
    loadEditableText();

    // Make elements editable after a short delay (to let page load)
    setTimeout(() => {
        const h1 = document.querySelector('h1');
        if (h1) makeEditable(h1, 'main_header');

        const buttonText = document.querySelector('.button-text');
        if (buttonText) makeEditable(buttonText, 'button_text');

        const topMarquee = document.querySelector('.top-marquee');
        if (topMarquee) makeEditable(topMarquee, 'top_marquee');

        const spinningText = document.querySelector('.spinning-text');
        if (spinningText) makeEditable(spinningText, 'spinning_text');

        const badges = document.querySelectorAll('.badge');
        if (badges[0]) makeEditable(badges[0], 'badge1');
        if (badges[1]) makeEditable(badges[1], 'badge2');
        if (badges[2]) makeEditable(badges[2], 'badge3');

        const copyright = document.querySelector('.rainbow-text');
        if (copyright) makeEditable(copyright, 'footer_copyright');

        const checkboxLabel = document.querySelector('.popup-toggle span');
        if (checkboxLabel) makeEditable(checkboxLabel, 'popup_checkbox');

        console.log('✏️ Click on any text to edit it!');
    }, 500);
}

// Auto-reset timer functions
function startResetTimer() {
    // Clear any existing timers
    if (resetTimer) clearTimeout(resetTimer);
    if (countdownTimer) clearInterval(countdownTimer);

    // Update last edit time
    lastEditTime = Date.now();

    // Hide countdown if it exists
    if (countdownElement) {
        countdownElement.style.display = 'none';
    }

    // Set timer for 60 seconds (show countdown at 30 seconds)
    setTimeout(() => {
        showCountdown();
    }, 30000); // 30 seconds

    // Set timer to reset after 60 seconds total
    resetTimer = setTimeout(() => {
        resetToDefaults();
    }, 60000); // 60 seconds
}

function showCountdown() {
    // Create countdown element if it doesn't exist
    if (!countdownElement) {
        countdownElement = document.createElement('div');
        countdownElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-family: 'Comic Sans MS', cursive;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        `;
        document.body.appendChild(countdownElement);
    }

    let secondsLeft = 30;
    countdownElement.textContent = `⏰ Resetting in ${secondsLeft}s...`;
    countdownElement.style.display = 'block';

    // Update countdown every second
    countdownTimer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            countdownElement.textContent = `⏰ Resetting in ${secondsLeft}s...`;
        } else {
            clearInterval(countdownTimer);
        }
    }, 1000);
}

async function resetToDefaults() {
    try {
        // Call API to reset all text
        await fetch(`${API_URL}/api/text/reset-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Hide countdown
        if (countdownElement) {
            countdownElement.style.display = 'none';
        }

        // Reload all text from database
        await loadEditableText();

        console.log('✅ Text reset to defaults!');
    } catch (err) {
        console.error('Error resetting text:', err);
    }

    // Clear timers
    lastEditTime = null;
    if (resetTimer) clearTimeout(resetTimer);
    if (countdownTimer) clearInterval(countdownTimer);
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditableText);
} else {
    initEditableText();
}
