// Global variables
let currentScene = 0;
let clickedStars = new Set();
let lightsOn = false;
let tableSet = false;
let candlesLit = false;
let musicPlaying = false;
let audioInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingHearts();
    initializeTwinklingStars();
    initializeFallingHearts();
    initializeMusic();
    
    // Add event listeners for memory cards
    const memoryCards = document.querySelectorAll('.memory-card');
    memoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

// Music Control Functions
function initializeMusic() {
    const audio = document.getElementById('background-music');
    
    // Set initial volume
    audio.volume = 0.3;
    
    // Set loop to true
    audio.loop = true;
    
    // Try to auto-play (may be blocked by browser)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            audioInitialized = true;
            updateMusicButton();
            console.log('Music started automatically');
        }).catch(() => {
            // Auto-play blocked, user needs to interact first
            console.log('Auto-play blocked. User interaction required.');
            musicPlaying = false;
            updateMusicButton();
        });
    }
}

function toggleMusic() {
    const audio = document.getElementById('background-music');
    
    if (!audioInitialized) {
        // First time user interaction - initialize audio
        audio.volume = 0.3;
        audio.loop = true;
        audioInitialized = true;
    }
    
    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
        console.log('Music paused by user');
    } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                console.log('Music started by user');
            }).catch((error) => {
                console.log('Error playing audio:', error);
                musicPlaying = false;
            });
        }
    }
    
    updateMusicButton();
}

function updateMusicButton() {
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');
    const musicToggle = document.getElementById('music-toggle');
    
    if (musicPlaying) {
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Music Playing';
        musicToggle.classList.add('playing');
    } else {
        musicIcon.textContent = '🔇';
        musicText.textContent = 'Play Music';
        musicToggle.classList.remove('playing');
    }
}

// Ensure music continues playing
function ensureMusicPlaying() {
    const audio = document.getElementById('background-music');
    
    if (musicPlaying && audio.paused && audioInitialized) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Music resumed');
            }).catch((error) => {
                console.log('Could not resume music:', error);
            });
        }
    }
}

// Scene navigation
function nextScene() {
    if (currentScene < 6) {
        const currentSceneElement = document.getElementById(`scene-${currentScene}`);
        const nextSceneElement = document.getElementById(`scene-${currentScene + 1}`);
        
        // Add exiting class to current scene
        currentSceneElement.classList.add('exiting');
        
        setTimeout(() => {
            currentSceneElement.classList.remove('active', 'exiting');
            nextSceneElement.classList.add('active');
            currentScene++;
            
            // Ensure music continues playing during scene transitions
            ensureMusicPlaying();
            
            // Special handling for lights scene
            if (currentScene === 1) {
                document.getElementById('scene-1').classList.remove('lights-on');
                lightsOn = false;
                const lightSwitch = document.getElementById('light-switch');
                const switchToggle = document.getElementById('switch-toggle');
                lightSwitch.classList.remove('on');
                document.getElementById('fairy-lights').classList.add('hidden');
                document.getElementById('corner-hearts').classList.add('hidden');
                document.getElementById('lights-message').classList.add('hidden');
                document.getElementById('lights-instruction').classList.remove('hidden');
            }
        }, 400);
    }
}

function replayJourney() {
    // Reset all scene states
    currentScene = 0;
    clickedStars.clear();
    lightsOn = false;
    tableSet = false;
    candlesLit = false;
    
    // Keep music playing during replay
    ensureMusicPlaying();
    
    // Hide all scenes
    for (let i = 0; i <= 6; i++) {
        document.getElementById(`scene-${i}`).classList.remove('active', 'exiting');
    }
    
    // Show first scene
    document.getElementById('scene-0').classList.add('active');
    
    // Reset door
    document.getElementById('door').classList.remove('opening');
    document.getElementById('door-opened').classList.add('hidden');
    
    // Reset lights scene
    document.getElementById('scene-1').classList.remove('lights-on');
    document.getElementById('light-switch').classList.remove('on');
    document.getElementById('fairy-lights').classList.add('hidden');
    document.getElementById('corner-hearts').classList.add('hidden');
    document.getElementById('lights-message').classList.add('hidden');
    document.getElementById('lights-instruction').classList.remove('hidden');
    
    // Reset lunch scene
    document.getElementById('table-items').classList.add('hidden');
    document.getElementById('floating-hearts-dinner').classList.add('hidden');
    document.getElementById('dinner-message').classList.add('hidden');
    document.getElementById('dinner-instruction').classList.remove('hidden');
    
    // Reset dessert scene
    document.getElementById('flame-1').classList.add('hidden');
    document.getElementById('flame-2').classList.add('hidden');
    document.getElementById('flame-3').classList.add('hidden');
    document.getElementById('cake-glow').classList.add('hidden');
    document.getElementById('cake-message').classList.add('hidden');
    document.getElementById('confetti').classList.add('hidden');
    document.getElementById('cake-instruction').classList.remove('hidden');
    
    // Reset heart-to-heart scene
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.classList.remove('clicked'));
    document.getElementById('floating-wishes').innerHTML = '';
    document.getElementById('wishes-complete').classList.add('hidden');
    document.getElementById('wishes-instruction').classList.remove('hidden');
}

// Welcome Scene - Door interaction
function openDoor() {
    const door = document.getElementById('door');
    const doorOpened = document.getElementById('door-opened');
    
    door.classList.add('opening');
    
    // Try to start music when user interacts (if not already playing)
    if (!musicPlaying && !audioInitialized) {
        const audio = document.getElementById('background-music');
        audio.volume = 0.3;
        audio.loop = true;
        audioInitialized = true;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlaying = true;
                updateMusicButton();
                console.log('Music started on door interaction');
            }).catch(() => {
                console.log('Music play failed on door interaction');
            });
        }
    } else {
        ensureMusicPlaying();
    }
    
    setTimeout(() => {
        doorOpened.classList.remove('hidden');
    }, 500);
    
    setTimeout(() => {
        nextScene();
    }, 1500);
}

// Lights Scene - Switch interaction
function turnOnLights() {
    if (lightsOn) return;
    
    lightsOn = true;
    const scene = document.getElementById('scene-1');
    const lightSwitch = document.getElementById('light-switch');
    const fairyLights = document.getElementById('fairy-lights');
    const cornerHearts = document.getElementById('corner-hearts');
    const lightsMessage = document.getElementById('lights-message');
    const lightsInstruction = document.getElementById('lights-instruction');
    
    // Ensure music continues
    ensureMusicPlaying();
    
    // Switch animation
    lightSwitch.classList.add('on');
    
    // Change scene background
    scene.classList.add('lights-on');
    
    // Show fairy lights
    fairyLights.classList.remove('hidden');
    createFairyLights();
    
    // Show corner hearts
    setTimeout(() => {
        cornerHearts.classList.remove('hidden');
    }, 1000);
    
    // Show message
    setTimeout(() => {
        lightsInstruction.classList.add('hidden');
        lightsMessage.classList.remove('hidden');
    }, 2000);
    
    // Auto advance
    setTimeout(() => {
        nextScene();
    }, 3000);
}

function createFairyLights() {
    const container = document.getElementById('fairy-lights');
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const light = document.createElement('div');
        light.className = 'fairy-light';
        light.style.left = Math.random() * 100 + '%';
        light.style.top = Math.random() * 100 + '%';
        light.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(light);
    }
}

// Lunch Scene - Table interaction
function setTable() {
    if (tableSet) return;
    
    tableSet = true;
    const tableItems = document.getElementById('table-items');
    const floatingHearts = document.getElementById('floating-hearts-dinner');
    const dinnerMessage = document.getElementById('dinner-message');
    const dinnerInstruction = document.getElementById('dinner-instruction');
    
    // Ensure music continues
    ensureMusicPlaying();
    
    tableItems.classList.remove('hidden');
    
    setTimeout(() => {
        floatingHearts.classList.remove('hidden');
        createDinnerHearts();
    }, 2000);
    
    setTimeout(() => {
        dinnerInstruction.classList.add('hidden');
        dinnerMessage.classList.remove('hidden');
    }, 2000);
}

function createDinnerHearts() {
    const container = document.getElementById('floating-hearts-dinner');
    container.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'dinner-heart';
        heart.textContent = '💖';
        heart.style.left = (20 + Math.random() * 60) + '%';
        heart.style.top = (20 + Math.random() * 60) + '%';
        heart.style.animationDelay = (2 + i * 0.3) + 's';
        container.appendChild(heart);
    }
}

// Dessert Scene - Candle interaction
function lightCandles() {
    if (candlesLit) return;
    
    candlesLit = true;
    const flames = ['flame-1', 'flame-2', 'flame-3'];
    const cakeGlow = document.getElementById('cake-glow');
    const cakeMessage = document.getElementById('cake-message');
    const confetti = document.getElementById('confetti');
    const cakeInstruction = document.getElementById('cake-instruction');
    
    // Ensure music continues
    ensureMusicPlaying();
    
    // Light candles one by one
    flames.forEach((flameId, index) => {
        setTimeout(() => {
            document.getElementById(flameId).classList.remove('hidden');
        }, index * 200);
    });
    
    // Show glow effect
    setTimeout(() => {
        cakeGlow.classList.remove('hidden');
    }, 600);
    
    // Show message and sparkles
    setTimeout(() => {
        cakeInstruction.classList.add('hidden');
        cakeMessage.classList.remove('hidden');
        createSparkles();
    }, 1000);
    
    // Show confetti
    setTimeout(() => {
        confetti.classList.remove('hidden');
        createConfetti();
    }, 2000);
}

function createSparkles() {
    const container = document.getElementById('sparkles');
    container.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 50 + '%';
        sparkle.style.animationDelay = (1.5 + i * 0.2) + 's';
        container.appendChild(sparkle);
    }
}

function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.textContent = '💖';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.animationDelay = (2 + Math.random() * 2) + 's';
        piece.style.animationDuration = (3 + Math.random() * 2) + 's';
        container.appendChild(piece);
    }
}

// Heart-to-Heart Scene - Star interaction
function clickStar(index) {
    if (clickedStars.has(index)) return;
    
    clickedStars.add(index);
    const star = document.querySelectorAll('.star')[index];
    const wish = star.getAttribute('data-wish');
    
    // Ensure music continues
    ensureMusicPlaying();
    
    star.classList.add('clicked');
    
    // Create floating wish
    createFloatingWish(wish, index);
    
    // Check if enough stars clicked
    if (clickedStars.size >= 4) {
        setTimeout(() => {
            document.getElementById('wishes-instruction').classList.add('hidden');
            document.getElementById('wishes-complete').classList.remove('hidden');
        }, 1000);
    }
}

function createFloatingWish(wishText, index) {
    const container = document.getElementById('floating-wishes');
    const positions = [
        { x: '10%', y: '15%' },
        { x: '70%', y: '20%' },
        { x: '15%', y: '60%' },
        { x: '75%', y: '65%' },
        { x: '40%', y: '25%' },
        { x: '25%', y: '75%' },
        { x: '65%', y: '40%' },
        { x: '45%', y: '70%' }
    ];
    
    const position = positions[index] || { x: '50%', y: '50%' };
    
    const wishBubble = document.createElement('div');
    wishBubble.className = 'wish-bubble';
    wishBubble.style.left = position.x;
    wishBubble.style.top = position.y;
    
    const wishTextElement = document.createElement('p');
    wishTextElement.className = 'wish-text';
    wishTextElement.textContent = wishText;
    
    wishBubble.appendChild(wishTextElement);
    container.appendChild(wishBubble);
}

// Letter Modal
function showLetter() {
    document.getElementById('letter-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Ensure music continues
    ensureMusicPlaying();
}

function hideLetter() {
    document.getElementById('letter-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Ensure music continues
    ensureMusicPlaying();
}

// Download Messages
function downloadMessages() {
    const text = `Nag's Babe,

I still remember the first time we met — at that movie. Just a smile, a bit of talking, a laugh or two, and somehow, it felt like I'd known you forever.

You've got this incredible way of making everything feel easy, even when the world is all over the place. You walk in, dressed like the corporate queen you are, and I just... I'm in awe.

The way you carry yourself — so smart, so confident, and somehow effortlessly beautiful. You could waltz into any room and own it, without even trying.

That smile of yours. Babe, you don't even realize how much light you bring into the room just with that one smile. It's the kind of smile that makes everything feel okay, even when it's really not.

I don't always say it out loud, but I love you. I really do. I love you for being you — for the way you make everything better by just being there.

You're not just a committee member of turturee — you're the heartbeat of it all. I'm bloody lucky to have you around.

With all the love I've got,
Nithya Nagaraj

Thu, 24 April 2025`;

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "love-letter-nags.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Ensure music continues
    ensureMusicPlaying();
}

// Background Effects
function initializeFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-element';
        heart.textContent = '💖';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (0.8 + Math.random() * 0.4) + 'rem';
        heart.style.animationDuration = (8 + Math.random() * 4) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 15000);
    }
    
    // Create hearts periodically
    setInterval(createHeart, 2000);
    
    // Create initial hearts
    for (let i = 0; i < 8; i++) {
        setTimeout(createHeart, i * 500);
    }
}

function initializeTwinklingStars() {
    const container = document.getElementById('twinkling-stars');
    if (!container) return;
    
    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'twinkling-star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (2 + Math.random()) + 's';
        container.appendChild(star);
    }
}

function initializeFallingHearts() {
    const container = document.getElementById('falling-hearts-goodbye');
    if (!container) return;
    
    function createFallingHeart() {
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.textContent = '💖';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (4 + Math.random() * 3) + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 10000);
    }
    
    // Create falling hearts periodically
    setInterval(createFallingHeart, 1000);
    
    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createFallingHeart, i * 300);
    }
}

// Keyboard navigation (optional)
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (currentScene === 0 && !document.getElementById('door').classList.contains('opening')) {
            openDoor();
        } else if (currentScene === 1 && !lightsOn) {
            turnOnLights();
        } else if (currentScene === 3 && !tableSet) {
            setTable();
        } else if (currentScene === 4 && !candlesLit) {
            lightCandles();
        } else if (currentScene < 6) {
            nextScene();
        }
    } else if (e.key === 'Escape') {
        hideLetter();
    } else if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next scene
            if (currentScene < 6) {
                nextScene();
            }
        }
        // Swipe right could be used for previous scene if needed
    }
}

// Prevent context menu on long press for mobile
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Handle visibility change - keep music playing when possible
document.addEventListener('visibilitychange', function() {
    const audio = document.getElementById('background-music');
    
    if (document.hidden) {
        // Pause animations when tab is not visible, but keep music playing
        document.body.style.animationPlayState = 'paused';
        console.log('Tab hidden - animations paused, music continues');
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
        console.log('Tab visible - animations resumed');
        
        // Ensure music is still playing if it should be
        if (musicPlaying && audio.paused && audioInitialized) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Music resumed after tab became visible');
                }).catch(() => {
                    console.log('Could not resume music after tab became visible');
                });
            }
        }
    }
});

// Handle page unload - music will naturally stop when page closes
window.addEventListener('beforeunload', function() {
    console.log('Page is closing - music will stop naturally');
});

// Periodic check to ensure music keeps playing (every 5 seconds)
setInterval(() => {
    if (musicPlaying && audioInitialized) {
        const audio = document.getElementById('background-music');
        if (audio.paused && !document.hidden) {
            console.log('Music was paused unexpectedly, attempting to resume');
            ensureMusicPlaying();
        }
    }
}, 5000);