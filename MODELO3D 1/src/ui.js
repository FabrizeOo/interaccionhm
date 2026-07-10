import { audioManager } from './utils.js';

/**
 * UI MANAGER
 * Coordinates welcome/success screen overlays, help/AR modals, HUD progress indicators, and interaction prompts.
 */
class UIManager {
    constructor() {
        this.activeModals = [];
        this.onStartCallback = null;
        this.onResetCallback = null;
    }

    init(onStart, onReset) {
        this.onStartCallback = onStart;
        this.onResetCallback = onReset;

        this.bindEvents();
    }

    bindEvents() {
        // Welcome screen Start button
        const startBtn = document.getElementById('btn-start');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.hideOverlay('welcome-screen');
                if (this.onStartCallback) this.onStartCallback();
            });
        }

        // Welcome screen AR button
        const arDirectBtn = document.getElementById('btn-ar-direct');
        if (arDirectBtn) {
            arDirectBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.openModal('ar-modal');
            });
        }

        // HUD Reset button
        const resetBtn = document.getElementById('btn-hud-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                audioManager.play('click');
                if (this.onResetCallback) this.onResetCallback();
            });
        }

        // HUD Help button
        const helpBtn = document.getElementById('btn-hud-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.openModal('help-modal');
            });
        }

        // Close Help button
        const closeHelpBtn = document.getElementById('btn-close-help');
        if (closeHelpBtn) {
            closeHelpBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.closeModal('help-modal');
            });
        }

        // HUD AR button
        const arBtn = document.getElementById('btn-hud-ar');
        if (arBtn) {
            arBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.openModal('ar-modal');
            });
        }

        // Close AR button
        const closeArBtn = document.getElementById('btn-close-ar');
        if (closeArBtn) {
            closeArBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.closeModal('ar-modal');
            });
        }

        // Success Restart button
        const successRestartBtn = document.getElementById('btn-success-restart');
        if (successRestartBtn) {
            successRestartBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.hideOverlay('success-screen');
                if (this.onResetCallback) this.onResetCallback();
            });
        }

        // Success AR button
        const successArBtn = document.getElementById('btn-success-ar');
        if (successArBtn) {
            successArBtn.addEventListener('click', () => {
                audioManager.play('click');
                this.openModal('ar-modal');
            });
        }

        // AR Model Selectors
        const selectorBtns = document.querySelectorAll('.ar-select-btn');
        selectorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                audioManager.play('click');
                selectorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const modelName = btn.getAttribute('data-model');
                this.switchARModel(modelName);
            });
        });

        // Close modals on clicking overlay background
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    /**
     * Swaps GLTF model references inside Google Model-Viewer
     */
    switchARModel(name) {
        const viewer = document.getElementById('ar-viewer');
        if (!viewer) return;

        const modelMap = {
            cedula: { src: './models/cedula.glb', alt: 'Cédula de votación 3D para AR', title: 'Cédula de Votación' },
            anfora: { src: './models/anfora.glb', alt: 'Ánfora electoral 3D para AR',   title: 'Ánfora Electoral' },
            cabina: { src: './models/cabina.glb', alt: 'Cabina electoral 3D para AR',   title: 'Cabina Electoral' },
        };

        const cfg = modelMap[name];
        if (!cfg) return;

        viewer.setAttribute('src', cfg.src);
        viewer.setAttribute('alt', cfg.alt);

        // Update QR code to point to the model directly
        this._currentARModel = name;
        this.generateARQRCode(name);
    }

    /**
     * Generates a QR code so desktop users can open the experience on mobile.
     * If on localhost, detects local network IP and builds a proper URL.
     */
    generateARQRCode(modelName = 'cedula') {
        const qrContainer = document.getElementById('ar-qr-code');
        const qrNote      = document.getElementById('ar-qr-note');
        if (!qrContainer) return;

        const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        let targetURL     = window.location.origin + window.location.pathname;

        // Append model anchor so mobile opens straight to AR
        targetURL = targetURL.replace(/\/?$/, '/') + `#ar-${modelName}`;

        if (isLocalhost) {
            // We can't determine network IP from JS, show a helpful message
            qrContainer.innerHTML = `
                <div style="text-align:center; padding:8px;">
                    <div style="font-size:1.8rem; margin-bottom:6px;">⚠️</div>
                    <p style="font-size:0.75rem; color:#d90429; font-weight:600; margin-bottom:6px;">
                        Servidor en Localhost
                    </p>
                    <p style="font-size:0.7rem; color:#4b5563; line-height:1.4;">
                        Para probar la realidad aumentada en tu celular, accede utilizando la <strong>IP local de tu red</strong> y el puerto activo:<br>
                        <code style="background:#f3f4f6; padding:2px 6px; border-radius:4px; font-size:0.7rem; display:block; margin:4px 0;">http://&lt;tu-ip-local&gt;:${window.location.port || '5173'}</code>
                        donde <code>&lt;tu-ip-local&gt;</code> es la IP de tu PC (ej: <code>192.168.1.15</code>).
                    </p>
                </div>`;
            if (qrNote) qrNote.style.display = 'none';
        } else {
            const apiURL = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(targetURL)}&color=0b2240&bgcolor=ffffff&margin=2`;
            qrContainer.innerHTML = `<img src="${apiURL}" alt="Escanear QR para AR" style="width:140px;height:140px;border-radius:6px;" />`;
            if (qrNote) qrNote.style.display = 'block';
        }
    }

    /**
     * Updates loading screen progress bar
     */
    updateLoader(percent, statusText) {
        const progressFill = document.getElementById('loader-progress');
        const statusEl = document.getElementById('loader-status');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (statusEl) statusEl.innerText = statusText;
        
        if (percent >= 100) {
            setTimeout(() => {
                this.hideOverlay('loading-screen');
                this.showOverlay('welcome-screen');
            }, 600);
        }
    }

    showOverlay(id) {
        const overlay = document.getElementById(id);
        if (overlay) overlay.classList.add('active');
    }

    hideOverlay(id) {
        const overlay = document.getElementById(id);
        if (overlay) overlay.classList.remove('active');
    }

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            this.activeModals.push(id);
            
            if (id === 'ar-modal') {
                this.generateARQRCode();
            }
        }
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            this.activeModals = this.activeModals.filter(m => m !== id);
        }
    }

    /**
     * Refreshes progress bar and title at the top header
     * @param {number} step 1 to 6
     * @param {string} title Current phase title
     */
    updateHUDProgress(step, title) {
        const stepNumEl = document.getElementById('current-step-num');
        const stepTitleEl = document.getElementById('current-step-title');
        const progressFill = document.getElementById('hud-progress-fill');

        if (stepNumEl) stepNumEl.innerText = step;
        if (stepTitleEl) stepTitleEl.innerText = title;
        
        if (progressFill) {
            // Map 1..6 steps to 16.6%..100% width
            const percent = (step / 6) * 100;
            progressFill.style.width = `${percent}%`;
        }
    }

    /**
     * Shows action tips in first person mode
     */
    showInteractionPrompt(type) {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            crosshair.classList.add('interactable');
        }

        const controlsHint = document.getElementById('controls-hint');
        if (controlsHint && controlsHint.classList.contains('hidden') === false) {
            // Already visible, append interaction message
            return;
        }

        // Custom hint depending on lookat target
        let tip = "Haz clic para interactuar";
        switch (type) {
            case 'door':
                tip = "Haz clic para entrar al aula";
                break;
            case 'member':
                tip = "Haz clic para identificarte con tu DNI";
                break;
            case 'booth':
                tip = "Haz clic para ingresar a la cabina de votación";
                break;
            case 'urn':
                tip = "Haz clic para depositar tu cédula en el ánfora";
                break;
        }

        const hintEl = document.getElementById('controls-hint');
        if (hintEl) {
            hintEl.innerHTML = `${tip}<br><small>Presiona ESC para liberar el cursor</small>`;
            hintEl.classList.remove('hidden');
        }
    }

    hideInteractionPrompt() {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            crosshair.classList.remove('interactable');
        }

        // Only hide if pointer is actually locked, otherwise keep click hint visible
        const isLocked = document.pointerLockElement !== null;
        const hintEl = document.getElementById('controls-hint');
        if (hintEl) {
            if (isLocked) {
                hintEl.classList.add('hidden');
            } else {
                hintEl.innerHTML = `Haz clic en la pantalla para activar el control de cámara (Vista Primera Persona)<br><small>Presiona ESC para liberar el cursor</small>`;
            }
        }
    }
}

export const uiManager = new UIManager();
export default uiManager;
