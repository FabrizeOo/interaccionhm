/**
 * UTILS & AUDIO MANAGER
 * Contains general helper functions and the audio management system.
 */

// ----------------------------------------------------
// AUDIO MANAGER WITH SYNTHESIZER FALLBACK
// ----------------------------------------------------
class AudioManager {
    constructor() {
        this.ctx = null;
        this.audioBuffers = {};
        this.enabled = true;
        this.fallbackEnabled = true;
        
        // Define paths to the generated audio files
        this.soundPaths = {
            pasos: './audio/pasos.wav',
            click: './audio/click.wav',
            entrega: './audio/entrega.wav',
            insercion: './audio/insercion.wav',
            confirmacion: './audio/confirmacion.wav'
        };

        // Bind user interaction to resume audio context
        window.addEventListener('click', () => this.initAudioContext(), { once: true });
        window.addEventListener('keydown', () => this.initAudioContext(), { once: true });
    }

    initAudioContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.loadAllSounds();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Preloads all WAV files from public/audio
     */
    async loadAllSounds() {
        if (!this.ctx) return;
        
        for (const [key, url] of Object.entries(this.soundPaths)) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();
                this.audioBuffers[key] = await this.ctx.decodeAudioData(arrayBuffer);
                console.log(`Audio loaded successfully: ${key}`);
            } catch (err) {
                console.warn(`Failed to load audio file "${url}", using Web Audio synthesizer instead.`, err);
            }
        }
    }

    /**
     * Plays a sound. Tries buffer first, falls back to real-time synthesis.
     */
    play(soundName) {
        this.initAudioContext();
        if (!this.enabled) return;

        // Try playing decoded buffer first
        if (this.audioBuffers[soundName] && this.ctx) {
            try {
                const source = this.ctx.createBufferSource();
                source.buffer = this.audioBuffers[soundName];
                source.connect(this.ctx.destination);
                source.start(0);
                return;
            } catch (e) {
                console.error("Error playing buffered sound, falling back to synth", e);
            }
        }

        // Synthesizer fallback if buffer is not loaded or fails
        if (this.fallbackEnabled && this.ctx) {
            this.synthesizeSound(soundName);
        }
    }

    /**
     * Synthesizes audio in real-time using Web Audio API nodes
     */
    synthesizeSound(name) {
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        
        switch (name) {
            case 'pasos': {
                // Footstep: Low frequency thud with filter
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.15);
                
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(now);
                osc.stop(now + 0.16);
                break;
            }
            case 'click': {
                // Click: Short high frequency pop
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, now);
                
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(now);
                osc.stop(now + 0.06);
                break;
            }
            case 'entrega':
            case 'insercion': {
                // Paper rustle/sliding: Synthesized white noise with bandpass filtering
                const bufferSize = this.ctx.sampleRate * 0.4;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const noiseNode = this.ctx.createBufferSource();
                noiseNode.buffer = buffer;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 2.0;
                
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                
                noiseNode.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                
                noiseNode.start(now);
                noiseNode.stop(now + 0.45);
                break;
            }
            case 'confirmacion': {
                // Dual chime: C5 (523Hz) & E5 (659Hz) played harmoniously with a decay
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                gain.connect(this.ctx.destination);

                const osc1 = this.ctx.createOscillator();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(523.25, now); // C5
                osc1.connect(gain);
                
                const osc2 = this.ctx.createOscillator();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(659.25, now); // E5
                osc2.connect(gain);
                
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.85);
                osc2.stop(now + 0.85);
                break;
            }
        }
    }
}

export const audioManager = new AudioManager();

// ----------------------------------------------------
// COLLISION & MATH UTILS
// ----------------------------------------------------

/**
 * Checks if a point collides with a 2D Axis-Aligned Bounding Box (AABB)
 * Used for fast horizontal collision checks in the classroom.
 * @param {number} px Player X
 * @param {number} pz Player Z
 * @param {number} minX Box min X
 * @param {number} maxX Box max X
 * @param {number} minZ Box min Z
 * @param {number} maxZ Box max Z
 * @param {number} padding Extra margin/radius of player
 * @returns {boolean} True if inside collision zone
 */
export function checkAABBCollision2D(px, pz, minX, maxX, minZ, maxZ, padding = 0.3) {
    return px >= minX - padding &&
           px <= maxX + padding &&
           pz >= minZ - padding &&
           pz <= maxZ + padding;
}

/**
 * Normalizes a number from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}
