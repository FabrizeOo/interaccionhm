# 🗳️ Plataforma de Simulación Electoral 3D e Interactiva (ONPE Style)

Plataforma educativa inmersiva desarrollada en **JavaScript puro (ES6+)**, **Three.js** y **WebXR / Model Viewer**, diseñada para enseñar a los ciudadanos peruanos los pasos institucionales obligatorios para votar de manera correcta en un local de votación, previniendo votos nulos o errores procedimentales.

La plataforma cuenta con un entorno 3D transitable en primera persona (estilo FPS con control de mouse y teclado WASD), colisiones realistas, sonidos procedimentales con altavoces en tiempo real y una simulación de cédula interactiva basada en el diseño de Lima Metropolitana. También incorpora Realidad Aumentada (AR) para smartphones.

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
* [npm](https://www.npmjs.com/) (incluido con Node.js)

### Pasos de Configuración

1. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo de desarrollo local:**
   ```bash
   npm run dev
   ```
   *Esto iniciará un servidor local (usualmente en `http://localhost:3000/`) y abrirá la pestaña en tu navegador web de forma automática.*

3. **Compilar el proyecto para producción (despliegue estático):**
   ```bash
   npm run build
   ```
   *Esto generará un directorio `/dist` con todos los recursos optimizados listos para ser alojados en cualquier proveedor estático como GitHub Pages, Netlify o Vercel.*

4. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura modular y limpia, separando las responsabilidades de renderizado 3D, lógica física, animaciones y flujos interactivos de la interfaz de usuario de la siguiente manera:

```text
/
├── index.html               # Estructura HTML y overlays de UI
├── package.json             # Dependencias del proyecto (Three.js, GSAP, Vite)
├── vite.config.js           # Ajustes de Vite para despliegue y puertos
├── README.md                # Documentación del sistema
├── generate_assets.py       # Script generador de modelos .glb y audio .wav
├── public/                  # Recursos estáticos servidos por Vite
│   ├── models/              # Archivos 3D exportados (.glb)
│   ├── textures/            # Imágenes de alta resolución (Cédula de votación)
│   ├── audio/               # Sonidos procedimentales en formato (.wav)
│   └── icons/               # Iconografía del simulador
└── src/                     # Código fuente de la aplicación
    ├── main.js              # Controlador principal y máquina de estados
    ├── scene.js             # Inicialización de la escena, luces y bucle de renderizado (setAnimationLoop)
    ├── camera.js            # Ajustes de la cámara perspectiva y eventos resize
    ├── lights.js            # Luces de la escena (ambiental, sol con sombras suaves y pointlights)
    ├── environment.js       # Construcción del aula de clases y colocación de modelos 3D
    ├── loader.js            # Administrador de carga de archivos (GLTFLoader y TextureLoader)
    ├── controls.js          # Control de cámara (PointerLockControls y OrbitControls)
    ├── collision.js         # Detección de colisiones contra paredes y mobiliario (desplazamiento suave)
    ├── player.js            # Físicas del jugador, movimientos WASD y intervalos de pisadas
    ├── animations.js        # Animaciones de cámara (GSAP), doblado 3D y inserción en ánfora
    ├── interaction.js       # Raycasting para clic de ratón y tip contextual en pantalla
    ├── voting.js            # Cédula interactiva en Canvas 2D (zoom, pan, dibujo de X y validaciones)
    ├── dialogs.js           # Descripciones e instrucciones de los 6 pasos institucionales
    ├── ui.js                # Control de modales HUD, botones de AR y generación de códigos QR
    ├── ar.js                # Compatibilidad WebXR AR y deep links intents de Scene Viewer
    ├── utils.js             # AudioManager (con sintetizador Web Audio API) y cálculos matemáticos
    └── styles/              # Archivos de estilos visuales
        ├── style.css        # Diseño principal, tipografías institucionales y glassmorphism
        └── responsive.css   # Reglas para smartphones, tabletas y visualizaciones apiladas
```

---

## 🗳️ Flujo del Simulador (Maquina de Estados)

La simulación avanza a través de 6 pasos obligatorios, bloqueando el progreso a menos que el usuario realice la acción educativa requerida:

1. **Paso 1: Ingreso al Local (Escena 2):** El jugador aparece fuera del aula. Debe usar la cámara primera persona (Pointer Lock) y caminar hacia la puerta, haciendo clic para abrirla.
2. **Paso 2: Presentar DNI (Escena 5):** El jugador camina hacia la mesa de sufragio y hace clic sobre el miembro de mesa para presentar su identificación virtual.
3. **Paso 3: Recoger Cédula (Escena 5):** Se activa un botón para que el jugador tome la cédula de votación y el lapicero.
4. **Paso 4: Caminar a la Cabina (Escena 6):** El jugador entra en la cabina electoral de cartón e interactúa con el espacio privado.
5. **Paso 5: Votar y Doblar (Escena 7):** Se abre una cédula a pantalla completa. El jugador puede marcar una cruz (X).
   * *La cédula cuenta con validación estricta de votos en base a las leyes de la ONPE.*
   * *Hay un panel interactivo que enseña por qué otros tipos de votos (marcas dobles, checkmarks, rayones o fuera del recuadro) se considerarían nulos.*
   * *Al confirmar, se reproduce una animación en 3D del doblado de la cédula.*
6. **Paso 6: Depositar en Ánfora (Escena 10-11):** El jugador camina hacia el ánfora amarilla y hace clic en ella. La cédula doblada se inserta con animación y se finaliza la experiencia mostrando una pantalla de éxito institucional.

---

## 📱 Realidad Aumentada (AR)

La plataforma integra Realidad Aumentada mediante el componente de Google `<model-viewer>` y APIs móviles nativas:

* **En PC:** Al abrir el panel de Realidad Aumentada, se genera un **código QR** dinámico utilizando la API de QRServer apuntando a la dirección IP/Host de tu navegador actual. Al escanearlo con el celular, puedes abrir el simulador directamente en el móvil.
* **En Dispositivo compatible (Android / iOS):** Puedes proyectar individualmente la **cédula de votación**, el **ánfora electoral** o la **cabina** en tu propio cuarto físico utilizando la cámara trasera del dispositivo (compatible con Scene Viewer en Android y WebXR/Quick Look en iOS).

---

## 🛠️ Generación de Recursos (Paso de Desarrollo Adicional)

Para asegurar el funcionamiento offline y eliminar dependencias de archivos remotos, el repositorio incluye un script en Python (`generate_assets.py`) que ya ha sido ejecutado para generar localmente los siguientes archivos:

* **Modelos 3D (.glb) en `/public/models/`:**
  * `mesa.glb`: Mesa de votación de madera con patas de metal.
  * `silla.glb`: Sillas del aula con respaldos acolchados.
  * `anfora.glb`: Ánfora oficial color amarillo con ranura de inserción.
  * `cabina.glb`: Cabina electoral de cartón.
  * `dni.glb`: Cédula DNI azul celeste del votante.
  * `lapicero.glb`: Lapicero azul para marcar.
  * `cedula.glb`: Hoja plana proporción A4 para la textura del voto.
  * `persona.glb` & `miembro_mesa.glb`: Modelos humanoides estilizados con articulaciones jerárquicas listas para animación procedimental.
* **Audio (.wav) en `/public/audio/`:**
  * `pasos.wav`: Sonido sordo y corto de caminata.
  * `click.wav`: Sonido seco metálico de interacción.
  * `entrega.wav` & `insercion.wav`: Sonidos de roce de papel.
  * `confirmacion.wav`: Acorde de campanas armonioso de éxito.

---

## 🖥️ Despliegue en GitHub Pages

El proyecto está configurado con rutas relativas (`vite.config.js -> base: './'`) haciéndolo compatible de forma nativa con GitHub Pages:

1. Crea un repositorio en GitHub y sube los archivos de este proyecto.
2. Asegúrate de configurar un flujo de GitHub Actions para Vite o realiza una compilación local.
3. Si lo haces manualmente:
   ```bash
   npm run build
   ```
   Luego sube el contenido de la carpeta `/dist` a una rama llamada `gh-pages` o configura la pestaña de Configuración de tu repositorio (**Settings -> Pages**) para servir la carpeta `/dist`.
4. ¡Tu simulador estará listo y en línea!
