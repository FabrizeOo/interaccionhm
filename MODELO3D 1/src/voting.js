import { audioManager } from './utils.js';

/**
 * VOTING SYSTEM — FREEHAND PEN MODE
 * The user draws freely on the ballot with the mouse. Each mouse-down → mouse-up
 * sequence creates one "stroke" (a polyline). Two crossing strokes = a valid X.
 * The ballot image fills the full available panel height.
 */
class VotingManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.bgImage = null;

        // Zoom / Pan
        this.scale = 1.0;
        this.panX = 0;
        this.panY = 0;

        // Freehand drawing state
        this.isDrawing = false;
        this.currentPath = [];   // Points of the stroke being drawn [{x,y}] in ballot-space
        this.strokes = [];       // All finished strokes [{type, points, boxId}]

        // Demo presets use synthetic "stamp" marks for the sidebar examples
        this.stampMarks = [];    // [{type,x,y,boxId,progress}]  — used only for demos

        // Ballot coordinate space (matches the texture PNG resolution)
        this.ballotWidth  = 1190;
        this.ballotHeight = 1247;

        // Candidate hit-boxes in ballot coordinate space.
        // Covers the actual checkboxes on the ballot.
        // We generate candidate boxes programmatically to match the printed squares:
        this.candidateBoxes = [];

        // 1. Top Half Boxes (13 rows, 5 columns)
        const topColLabels = [
            'Presidente (Columna 1)',
            'Senadores Nacional (Columna 2)',
            'Senadores Lima (Columna 3)',
            'Diputados Lima (Columna 4)',
            'Parlamento Andino (Columna 5)'
        ];
        
        for (let r = 0; r < 13; r++) {
            for (let c = 0; c < 5; c++) {
                const boxX = 195 + c * 210;
                const boxY = 115 + r * 20;
                this.candidateBoxes.push({
                    id: `top_r${r}_c${c}`,
                    x: boxX - 4, // 4px padding left
                    y: boxY - 3, // 3px padding top
                    w: 34,       // 26px square + 8px padding
                    h: 26,       // 20px height + 6px padding
                    label: `${topColLabels[c]} - Fila ${r + 1}`
                });
            }
        }

        // 2. Bottom Half Boxes (22 rows, 4 columns: Column 2 to 5)
        const botColLabels = [
            'Senadores Nacional (Columna 2)',
            'Senadores Lima (Columna 3)',
            'Diputados Lima (Columna 4)',
            'Parlamento Andino (Columna 5)'
        ];

        for (let r = 0; r < 22; r++) {
            for (let c = 0; c < 4; c++) {
                // c=0 maps to Column 2, c=3 maps to Column 5
                // We cover both the logo square (x=358) and the number square (x=398)
                const boxX = 358 + c * 210;
                const boxY = 440 + r * 30;
                this.candidateBoxes.push({
                    id: `bot_r${r}_c${c}`,
                    x: boxX - 5,
                    y: boxY - 4,
                    w: 75,       // Covers from 358 to 425 + padding
                    h: 38,
                    label: `${botColLabels[c]} - Fila ${r + 1}`
                });
            }
        }

        this.onVoteValidatedCallback = null;
        this._boundMouseMove = null;
        this._boundMouseUp   = null;
    }

    /* ------------------------------------------------------------------
       INIT — called every time the voting modal opens
    ------------------------------------------------------------------ */
    init(canvas, textures) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');

        // Load the ballot texture image
        if (textures && textures.ballot_front && textures.ballot_front.image) {
            this.bgImage = textures.ballot_front.image;
        }

        // Size canvas to fill the ballot-viewport div as large as possible
        this._sizeCanvas();

        this.resetView();
        this._setupListeners();
        this.draw();
    }

    _sizeCanvas() {
        // Use the wrapper element's actual rendered size
        const wrapper = document.getElementById('ballot-canvas-wrapper');
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect();
            // Leave a small margin
            this.canvasWidth  = Math.max(400, rect.width  - 10);
            this.canvasHeight = Math.max(500, rect.height - 10);
        } else {
            this.canvasWidth  = 820;
            this.canvasHeight = 900;
        }
        this.canvas.width  = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    }

    resetView() {
        this.scale  = 1.0;
        this.panX   = 0;
        this.panY   = 0;
        this.strokes    = [];
        this.stampMarks = [];
        this.currentPath = [];
        this.isDrawing   = false;
        if (this.ctx) this.draw();
        this._updateValidation();
    }

    /* ------------------------------------------------------------------
       EVENT LISTENERS
    ------------------------------------------------------------------ */
    _setupListeners() {
        // Remove old listeners if re-initialised
        if (this._boundMouseUp) {
            window.removeEventListener('mouseup',   this._boundMouseUp);
            window.removeEventListener('mousemove', this._boundMouseMove);
        }

        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
        this.canvas.addEventListener('dblclick',    e => e.preventDefault());

        // Wheel → zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect   = this.canvas.getBoundingClientRect();
            const mx     = e.clientX - rect.left;
            const my     = e.clientY - rect.top;
            const bx     = (mx - this.panX) / this.scale;
            const by     = (my - this.panY) / this.scale;
            const factor = e.deltaY < 0 ? 1.12 : 0.9;
            this.scale   = Math.max(0.8, Math.min(3.0, this.scale * factor));
            this.panX    = mx - bx * this.scale;
            this.panY    = my - by * this.scale;
            this._limitPan();
            this.draw();
        }, { passive: false });

        // Mouse down — start drawing OR panning
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const sx   = e.clientX - rect.left;
            const sy   = e.clientY - rect.top;

            if (e.button === 2 || e.shiftKey) {
                // Pan mode
                this._panStart = { sx, sy, px: this.panX, py: this.panY };
                this.canvas.style.cursor = 'grabbing';
            } else if (e.button === 0) {
                // Draw mode — start a new stroke
                this.isDrawing   = true;
                this.currentPath = [this._screenToBallot(sx, sy)];
                this.canvas.style.cursor = 'crosshair';
                audioManager.play('entrega');
            }
        });

        // Zoom buttons wired in index.html
        const zoomIn  = document.getElementById('btn-ballot-zoom-in');
        const zoomOut = document.getElementById('btn-ballot-zoom-out');
        const reset   = document.getElementById('btn-ballot-reset');
        if (zoomIn)  zoomIn.onclick  = () => { this.scale = Math.min(3.0, this.scale * 1.2); this._limitPan(); this.draw(); };
        if (zoomOut) zoomOut.onclick = () => { this.scale = Math.max(0.8, this.scale * 0.85); this._limitPan(); this.draw(); };
        if (reset)   reset.onclick   = () => { this.scale = 1.0; this.panX = 0; this.panY = 0; this.draw(); };

        // Mouse move (global so drag works outside canvas)
        this._boundMouseMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const sx   = e.clientX - rect.left;
            const sy   = e.clientY - rect.top;

            if (this._panStart) {
                this.panX = this._panStart.px + (sx - this._panStart.sx);
                this.panY = this._panStart.py + (sy - this._panStart.sy);
                this._limitPan();
                this.draw();
                return;
            }

            if (!this.isDrawing) return;

            const bp = this._screenToBallot(sx, sy);
            // Only record if moved at least 2px in ballot space
            const last = this.currentPath[this.currentPath.length - 1];
            const dx = bp.x - last.x, dy = bp.y - last.y;
            if (Math.sqrt(dx*dx + dy*dy) >= 2) {
                this.currentPath.push(bp);
                this.draw();
            }
        };

        // Mouse up (global)
        this._boundMouseUp = (e) => {
            this._panStart = null;
            this.canvas.style.cursor = 'crosshair';

            if (!this.isDrawing) return;
            this.isDrawing = false;

            if (this.currentPath.length >= 2) {
                const stroke = this._analyseStroke(this.currentPath);
                this.strokes.push(stroke);
            }
            this.currentPath = [];
            this.draw();
            this._updateValidation();
        };

        window.addEventListener('mousemove', this._boundMouseMove);
        window.addEventListener('mouseup',   this._boundMouseUp);
    }

    /* ------------------------------------------------------------------
       COORDINATE HELPERS
    ------------------------------------------------------------------ */
    _screenToBallot(sx, sy) {
        const bx = (sx - this.panX) / this.scale;
        const by = (sy - this.panY) / this.scale;
        return {
            x: (bx / this.canvasWidth)  * this.ballotWidth,
            y: (by / this.canvasHeight) * this.ballotHeight
        };
    }

    _ballotToScreen(bx, by) {
        const sx = (bx / this.ballotWidth)  * this.canvasWidth  * this.scale + this.panX;
        const sy = (by / this.ballotHeight) * this.canvasHeight * this.scale + this.panY;
        return { x: sx, y: sy };
    }

    _limitPan() {
        const maxX = this.canvasWidth  * (this.scale - 0.5);
        const maxY = this.canvasHeight * (this.scale - 0.5);
        this.panX = Math.max(-maxX, Math.min(maxX, this.panX));
        this.panY = Math.max(-maxY, Math.min(maxY, this.panY));
    }

    /* ------------------------------------------------------------------
       STROKE ANALYSIS
       Determines which candidate box a stroke is inside, and whether it
       resembles the right shape (any free stroke counts as a "mark").
    ------------------------------------------------------------------ */
    _analyseStroke(points) {
        // Bounding box of the stroke in ballot coords
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;

        // Find which box the centre falls inside
        let boxId = null;
        for (const box of this.candidateBoxes) {
            if (cx >= box.x && cx <= box.x + box.w &&
                cy >= box.y && cy <= box.y + box.h) {
                boxId = box.id;
                break;
            }
        }

        return { type: 'freehand', points, boxId, cx, cy };
    }

    /* ------------------------------------------------------------------
       DRAWING
    ------------------------------------------------------------------ */
    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Background / ballot image
        this.ctx.save();
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);

        if (this.bgImage) {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvasWidth, this.canvasHeight);
        } else {
            // Fallback white ballot
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.strokeStyle = '#0b2240';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(5, 5, this.canvasWidth - 10, this.canvasHeight - 10);
        }

        // Highlight candidate boxes for guidance
        for (const box of this.candidateBoxes) {
            const bsx = (box.x / this.ballotWidth)  * this.canvasWidth;
            const bsy = (box.y / this.ballotHeight) * this.canvasHeight;
            const bsw = (box.w / this.ballotWidth)  * this.canvasWidth;
            const bsh = (box.h / this.ballotHeight) * this.canvasHeight;
            this.ctx.strokeStyle = 'rgba(11, 34, 64, 0.25)';
            this.ctx.lineWidth   = 1.5;
            this.ctx.setLineDash([5, 4]);
            this.ctx.strokeRect(bsx, bsy, bsw, bsh);
            this.ctx.setLineDash([]);
        }

        this.ctx.restore();

        // Draw finished strokes
        for (const stroke of this.strokes) {
            this._drawFreehandStroke(stroke.points);
        }

        // Draw the stroke currently being drawn
        if (this.isDrawing && this.currentPath.length >= 2) {
            this._drawFreehandStroke(this.currentPath, true);
        }

        // Draw demo stamp marks (sidebar examples)
        for (const mark of this.stampMarks) {
            this._drawStampMark(mark);
        }
    }

    _drawFreehandStroke(points, isLive = false) {
        if (points.length < 2) return;
        this.ctx.save();
        this.ctx.strokeStyle = isLive ? 'rgba(217, 4, 41, 0.8)' : '#d90429';
        this.ctx.lineWidth   = Math.max(1.5, 2.5 * this.scale);
        this.ctx.lineCap     = 'round';
        this.ctx.lineJoin    = 'round';
        this.ctx.beginPath();
        const p0 = this._ballotToScreen(points[0].x, points[0].y);
        this.ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < points.length; i++) {
            const p = this._ballotToScreen(points[i].x, points[i].y);
            this.ctx.lineTo(p.x, p.y);
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    _drawStampMark(mark) {
        const sp = this._ballotToScreen(mark.x, mark.y);
        // Calculate size in screen space based on 8 pixels in ballot space
        const sz = 8 * this.scale * (this.canvasWidth / this.ballotWidth);
        this.ctx.save();
        this.ctx.strokeStyle = '#d90429';
        this.ctx.lineWidth   = Math.max(1.5, 2.5 * this.scale);
        this.ctx.lineCap     = 'round';

        if (mark.type === 'X') {
            const p = mark.progress;
            const s1 = Math.min(1, p * 2);
            const s2 = Math.max(0, (p - 0.5) * 2);
            if (s1 > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(sp.x - sz, sp.y - sz);
                this.ctx.lineTo(sp.x - sz + sz * 2 * s1, sp.y - sz + sz * 2 * s1);
                this.ctx.stroke();
            }
            if (s2 > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(sp.x + sz, sp.y - sz);
                this.ctx.lineTo(sp.x + sz - sz * 2 * s2, sp.y - sz + sz * 2 * s2);
                this.ctx.stroke();
            }
        } else if (mark.type === 'checkmark') {
            this.ctx.beginPath();
            this.ctx.moveTo(sp.x - sz, sp.y);
            this.ctx.lineTo(sp.x - sz/3, sp.y + sz);
            this.ctx.lineTo(sp.x + sz, sp.y - sz);
            this.ctx.stroke();
        } else if (mark.type === 'scribble') {
            const segs = [[-sz,-sz],[sz,-sz/2],[-sz*0.8,0],[sz*0.9,sz/2],[-sz/2,sz]];
            this.ctx.beginPath();
            this.ctx.moveTo(sp.x + segs[0][0], sp.y + segs[0][1]);
            for (let i = 1; i < segs.length; i++) {
                this.ctx.lineTo(sp.x + segs[i][0], sp.y + segs[i][1]);
            }
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    /* ------------------------------------------------------------------
       VALIDATION
    ------------------------------------------------------------------ */
    _updateValidation() {
        const feedbackEl  = document.getElementById('vote-feedback');
        const confirmBtn  = document.getElementById('btn-confirm-vote');
        if (!feedbackEl || !confirmBtn) return;

        // Demo mode: use stampMarks only
        if (this.stampMarks.length > 0) {
            this._validateStampMarks(feedbackEl, confirmBtn);
            return;
        }

        const strokes = this.strokes;

        if (strokes.length === 0) {
            feedbackEl.innerText  = 'Dibuja tu marca (X o +) directamente sobre el recuadro del partido que eliges.';
            feedbackEl.className  = 'vote-feedback';
            confirmBtn.classList.add('disabled');
            return;
        }

        // Collect box IDs from all strokes
        const boxIds = strokes.map(s => s.boxId).filter(Boolean);
        const uniqueBoxes = new Set(boxIds);
        const outsideCount = strokes.filter(s => !s.boxId).length;

        let isValid = false;
        let msg     = '';

        if (outsideCount > 0) {
            msg = 'VOTO NULO: Hay trazos fuera de los recuadros oficiales.';
        } else if (uniqueBoxes.size > 1) {
            msg = 'VOTO NULO: Has marcado en más de un partido (voto múltiple).';
        } else if (uniqueBoxes.size === 1 && strokes.length > 4) {
            msg = 'VOTO NULO: Demasiados trazos — la cédula parece tachada.';
        } else if (uniqueBoxes.size === 1) {
            const box = this.candidateBoxes.find(b => b.id === Array.from(uniqueBoxes)[0]);
            isValid = true;
            msg = `VOTO VÁLIDO ✓ — Tu marca fue colocada correctamente para ${box ? box.label : 'el candidato seleccionado'}.`;
        } else {
            msg = 'VOTO NULO: No se detectaron trazos dentro de ningún recuadro.';
        }

        feedbackEl.innerText = msg;
        if (isValid) {
            feedbackEl.className = 'vote-feedback valid';
            confirmBtn.classList.remove('disabled');
        } else {
            feedbackEl.className = 'vote-feedback invalid';
            confirmBtn.classList.add('disabled');
        }

        if (this.onVoteValidatedCallback) this.onVoteValidatedCallback(isValid);
    }

    _validateStampMarks(feedbackEl, confirmBtn) {
        const marks = this.stampMarks;
        const hasIrregular  = marks.some(m => m.type !== 'X');
        const boxMarks      = marks.filter(m => m.boxId);
        const outsideMarks  = marks.filter(m => !m.boxId);
        const uniqueBoxes   = new Set(boxMarks.map(m => m.boxId));

        let isValid = false, msg = '';

        if (hasIrregular) {
            msg = 'VOTO NULO: Símbolo incorrecto (sólo se acepta X o +).';
        } else if (outsideMarks.length > 0) {
            msg = 'VOTO NULO: Marca fuera del recuadro oficial.';
        } else if (uniqueBoxes.size > 1) {
            msg = 'VOTO NULO: Múltiples partidos marcados.';
        } else if (uniqueBoxes.size === 1 && boxMarks.length > 1) {
            msg = 'VOTO NULO: Múltiples cruces en el mismo candidato.';
        } else if (uniqueBoxes.size === 1) {
            const box = this.candidateBoxes.find(b => b.id === Array.from(uniqueBoxes)[0]);
            isValid = true;
            msg = `VOTO VÁLIDO ✓ — ${box ? box.label : 'Candidato'}.`;
        } else {
            msg = 'VOTO NULO: Cédula en blanco.';
        }

        feedbackEl.innerText = msg;
        feedbackEl.className = isValid ? 'vote-feedback valid' : 'vote-feedback invalid';
        if (isValid) confirmBtn.classList.remove('disabled');
        else         confirmBtn.classList.add('disabled');
        if (this.onVoteValidatedCallback) this.onVoteValidatedCallback(isValid);
    }

    /* ------------------------------------------------------------------
       DEMO PRESETS  (sidebar buttons)
    ------------------------------------------------------------------ */
    loadDemoPreset(type) {
        // Clear user strokes and stamp fresh demo marks
        this.strokes    = [];
        this.stampMarks = [];
        this.currentPath = [];
        audioManager.play('entrega');

        const animateStamp = (mark) => {
            mark.progress = 0;
            const start = performance.now();
            const tick = (t) => {
                mark.progress = Math.min(1, (t - start) / 280);
                this.draw();
                if (mark.progress < 1) requestAnimationFrame(tick);
                else this._updateValidation();
            };
            requestAnimationFrame(tick);
        };

        switch (type) {
            case 'valid': {
                const m = { type: 'X', x: 418, y: 325, boxId: 'top_r10_c1', progress: 0 };
                this.stampMarks.push(m);
                animateStamp(m);
                break;
            }
            case 'outside': {
                const m = { type: 'X', x: 300, y: 325, boxId: null, progress: 0 };
                this.stampMarks.push(m);
                animateStamp(m);
                break;
            }
            case 'double': {
                const m1 = { type: 'X', x: 418, y: 325, boxId: 'top_r10_c1', progress: 0 };
                const m2 = { type: 'X', x: 628, y: 205, boxId: 'top_r5_c2', progress: 0 };
                this.stampMarks.push(m1, m2);
                animateStamp(m1);
                setTimeout(() => animateStamp(m2), 300);
                break;
            }
            case 'symbol': {
                const m = { type: 'checkmark', x: 418, y: 325, boxId: 'top_r10_c1', progress: 0 };
                this.stampMarks.push(m);
                animateStamp(m);
                break;
            }
            case 'scribble': {
                const m = { type: 'scribble', x: 418, y: 325, boxId: 'top_r10_c1', progress: 0 };
                this.stampMarks.push(m);
                animateStamp(m);
                break;
            }
        }

        this.draw();
    }

    onVoteValidated(callback) {
        this.onVoteValidatedCallback = callback;
    }

    /** Returns true if a valid vote has been drawn (for main.js to check) */
    hasValidVote() {
        // Quick check used by confirmAndFoldBallot
        const confirmBtn = document.getElementById('btn-confirm-vote');
        return confirmBtn && !confirmBtn.classList.contains('disabled');
    }
}

export const votingManager = new VotingManager();
export default votingManager;
