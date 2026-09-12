/**
 * Brain Betrayal - Audio Manager
 * Provides procedural retro/synthwave background music using Web Audio API
 * (no external audio files required, zero broken links, works 100% offline)
 * plus interactive sound effects (click, countdown tick, correct, error, whoosh).
 */

const AudioManager = (function () {
    let audioCtx = null;
    let isPlaying = false;
    let isMuted = localStorage.getItem("bb_music_muted") === "true";
    let bgmInterval = null;
    let step = 0;

    // Master volume control
    let masterGain = null;

    function initContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
                masterGain = audioCtx.createGain();
                masterGain.gain.value = isMuted ? 0 : 0.18;
                masterGain.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    // --- Procedural Synthwave BGM Notes ---
    // Catchy, suspenseful retro chord sequence in D minor
    const BASS_NOTES = [146.83, 146.83, 174.61, 196.00, 146.83, 146.83, 130.81, 110.00]; // D3, D3, F3, G3, D3, D3, C3, A2
    const LEAD_NOTES = [293.66, 349.23, 440.00, 523.25, 440.00, 392.00, 349.23, 329.63]; // D4, F4, A4, C5, A4, G4, F4, E4

    function playBgmBeat() {
        if (!audioCtx || isMuted) return;

        try {
            const now = audioCtx.currentTime;
            const bassFreq = BASS_NOTES[step % BASS_NOTES.length];
            const leadFreq = LEAD_NOTES[step % LEAD_NOTES.length];

            // 1. Synth Bass Note (pulsing square/triangle wave)
            const bassOsc = audioCtx.createOscillator();
            const bassGain = audioCtx.createGain();
            bassOsc.type = "sawtooth";
            bassOsc.frequency.setValueAtTime(bassFreq, now);

            // Filter for warm retro synth bass
            const filter = audioCtx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.exponentialRampToValueAtTime(150, now + 0.22);

            bassGain.gain.setValueAtTime(0.25, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

            bassOsc.connect(filter);
            filter.connect(bassGain);
            bassGain.connect(masterGain);

            bassOsc.start(now);
            bassOsc.stop(now + 0.25);

            // 2. Subtle melodic arpeggio every alternating beat
            if (step % 2 === 0) {
                const leadOsc = audioCtx.createOscillator();
                const leadGain = audioCtx.createGain();
                leadOsc.type = "sine";
                leadOsc.frequency.setValueAtTime(leadFreq, now);

                leadGain.gain.setValueAtTime(0.08, now);
                leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

                leadOsc.connect(leadGain);
                leadGain.connect(masterGain);

                leadOsc.start(now);
                leadOsc.stop(now + 0.36);
            }

            // 3. Hi-hat noise click on offbeats
            if (step % 2 === 1) {
                playHiHat(now);
            }

            step = (step + 1) % 64;
        } catch (e) {
            // Audio error safeguard
        }
    }

    function playHiHat(now) {
        if (!audioCtx) return;
        const bufferSize = audioCtx.sampleRate * 0.04;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(8000, now);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.04);
    }

    function startBgm() {
        if (bgmInterval) return;
        initContext();
        isPlaying = true;
        // ~135 BPM (around 220ms per 8th note)
        bgmInterval = setInterval(playBgmBeat, 222);
        updateUi();
    }

    function stopBgm() {
        if (bgmInterval) {
            clearInterval(bgmInterval);
            bgmInterval = null;
        }
        isPlaying = false;
        updateUi();
    }

    function toggleMute() {
        initContext();
        isMuted = !isMuted;
        localStorage.setItem("bb_music_muted", isMuted ? "true" : "false");

        if (masterGain && audioCtx) {
            masterGain.gain.setValueAtTime(isMuted ? 0 : 0.18, audioCtx.currentTime);
        }

        if (isMuted) {
            stopBgm();
        } else {
            startBgm();
        }
        updateUi();
    }

    // --- Sound Effects ---

    function playTick() {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } catch (e) {}
    }

    function playUrgentTick() {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(1100, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.11);
        } catch (e) {}
    }

    function playWhoosh() {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.21);
        } catch (e) {}
    }

    function playSuccess() {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const now = audioCtx.currentTime + (idx * 0.08);
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.32);
            });
        } catch (e) {}
    }

    function playFail() {
        if (isMuted) return;
        initContext();
        if (!audioCtx) return;
        try {
            const notes = [311.13, 293.66, 277.18, 233.08]; // Descending minor fall
            notes.forEach((freq, idx) => {
                const now = audioCtx.currentTime + (idx * 0.1);
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.28);
            });
        } catch (e) {}
    }

    // --- Floating Music Widget UI ---
    function renderWidget() {
        if (document.getElementById("bgmFloatingWidget")) return;

        const widget = document.createElement("button");
        widget.id = "bgmFloatingWidget";
        widget.className = "bgm-widget";
        widget.setAttribute("aria-label", "Toggle Background Music");
        widget.title = "Toggle Background Music";

        widget.innerHTML = `
            <span class="bgm-icon">🎵</span>
            <span class="bgm-bars ${isMuted ? 'muted' : ''}">
                <span class="bar bar1"></span>
                <span class="bar bar2"></span>
                <span class="bar bar3"></span>
            </span>
            <span class="bgm-text">${isMuted ? "MUSIC: OFF" : "MUSIC: ON"}</span>
        `;

        widget.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleMute();
        });

        document.body.appendChild(widget);
    }

    function updateUi() {
        const widget = document.getElementById("bgmFloatingWidget");
        if (!widget) return;
        const textSpan = widget.querySelector(".bgm-text");
        const barsSpan = widget.querySelector(".bgm-bars");
        if (textSpan) textSpan.textContent = isMuted ? "MUSIC: OFF" : "MUSIC: ON";
        if (barsSpan) {
            if (isMuted) {
                barsSpan.classList.add("muted");
            } else {
                barsSpan.classList.remove("muted");
            }
        }
    }

    // Auto-init on first user interaction to satisfy browser autoplay policy
    function setupAutoPlay() {
        function triggerAudio() {
            if (!isMuted && !isPlaying) {
                startBgm();
            }
            window.removeEventListener("click", triggerAudio);
            window.removeEventListener("keydown", triggerAudio);
            window.removeEventListener("touchstart", triggerAudio);
        }

        window.addEventListener("click", triggerAudio, { once: true });
        window.addEventListener("keydown", triggerAudio, { once: true });
        window.addEventListener("touchstart", triggerAudio, { once: true });

        // If not muted, also attempt immediate playback
        if (!isMuted) {
            startBgm();
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderWidget();
        setupAutoPlay();
    });

    // Also call immediately if DOM is already ready
    if (document.readyState === "interactive" || document.readyState === "complete") {
        renderWidget();
        setupAutoPlay();
    }

    return {
        startBgm,
        stopBgm,
        toggleMute,
        playTick,
        playUrgentTick,
        playWhoosh,
        playSuccess,
        playFail
    };
})();

