/**
 * DIALOGS SYSTEM
 * Defines the educational instructions, details, and action prompts for each step of the simulation.
 */
class DialogsManager {
    constructor() {
        this.stepElement = null;
        this.textElement = null;
        this.iconElement = null;
        this.actionContainer = null;
        
        // Define all educational phases of the voting process
        this.steps = {
            1: {
                title: "Ingresar al Local",
                icon: "📍",
                instructions: "Usa las teclas <strong>WASD</strong> (o flechas) para caminar y el <strong>mouse</strong> para mirar a tu alrededor. Dirígete hacia la <strong>puerta del aula</strong> de la escuela e interactúa con ella para entrar."
            },
            2: {
                title: "Presentar Identificación (DNI)",
                icon: "🪪",
                instructions: "Acércate a la mesa de votación. Haz clic sobre el <strong>miembro de mesa</strong> para entregar tu DNI virtual y comenzar el registro de firmas."
            },
            3: {
                title: "Recoger Cédula y Lapicero",
                icon: "✏️",
                instructions: "El miembro de mesa verificará tus datos. Haz clic en el botón <strong>Recoger Cédula</strong> para recibir tu cédula de votación y el lapicero."
            },
            4: {
                title: "Votación Secreta en la Cabina",
                icon: "🗳️",
                instructions: "Dirígete a la <strong>cabina de votación de cartón</strong> ubicada al fondo de la sala. Ingresa en ella e interactúa para abrir la cédula de votación secreta."
            },
            5: {
                title: "Validar y Doblar Cédula",
                icon: "📝",
                instructions: "Realiza tu marca (una <strong>X</strong> o un <strong>+</strong>) de forma válida dentro del recuadro de tu candidato. Luego haz clic en <strong>Confirmar y Doblar Cédula</strong>."
            },
            6: {
                title: "Depositar Cédula en el Ánfora",
                icon: "📥",
                instructions: "Sal de la cabina y dirígete al <strong>ánfora electoral</strong> (la caja amarilla). Haz clic sobre ella para depositar tu voto doblado de forma segura."
            }
        };
    }

    init() {
        this.stepElement = document.getElementById('instruction-step');
        this.textElement = document.getElementById('instruction-text');
        this.iconElement = document.getElementById('instruction-icon');
        this.actionContainer = document.getElementById('instruction-action-container');
    }

    /**
     * Updates the HUD instructions dialog
     * @param {number} stepNum Step number from 1 to 6
     * @param {Array} actionButtons Optional array of button objects: { text, class, onClick }
     */
    showStep(stepNum, actionButtons = []) {
        const stepData = this.steps[stepNum];
        if (!stepData) return;

        // Update Text
        if (this.stepElement) this.stepElement.innerHTML = `PASO ${stepNum}: ${stepData.title}`;
        if (this.textElement) this.textElement.innerHTML = stepData.instructions;
        if (this.iconElement) this.iconElement.innerText = stepData.icon;

        // Clear and rebuild buttons
        if (this.actionContainer) {
            this.actionContainer.innerHTML = '';
            
            actionButtons.forEach(btnInfo => {
                const btn = document.createElement('button');
                btn.className = `btn ${btnInfo.class || 'btn-primary'}`;
                btn.innerText = btnInfo.text;
                btn.addEventListener('click', btnInfo.onClick);
                this.actionContainer.appendChild(btn);
            });
        }
    }

    /**
     * Temporarily overrides instruction text (e.g. for warning messages)
     */
    setCustomText(text) {
        if (this.textElement) this.textElement.innerHTML = text;
    }
}

export const dialogsManager = new DialogsManager();
export default dialogsManager;
