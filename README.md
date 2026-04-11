# 🎙️ Sobre la Mesa - Studio Console

![Sobre la Mesa](public/logo.jpg)

**Sobre la Mesa - Studio Console** es una aplicación web interactiva de alto rendimiento diseñada específicamente para producción de radio en vivo y transmisiones por streaming. Actúa como un *soundboard* profesional con un motor de audio de baja latencia y controles optimizados para respuestas ultrarrápidas, envuelto en una interfaz minimalista de primer nivel (*Obsidian Editorial Design*).

---

## ✨ Características Principales

*   ⚡ **Cero Latencia (Web Audio API)**: Los archivos de audio se pre-cargan directamente en la memoria del navegador (`AudioBuffer`), garantizando una reproducción absolutamente instantánea, imprescindible para el ritmo rápido de la radio en vivo.
*   🎹 **Integración de Hardware**: Especialmente mapeado para utilizarse sin mirar la pantalla mediante el teclado numérico (**Numpad 1-9** y números estándar).
*   🎛️ **Reproducción Polifónica**: Capacidad para desencadenar múltiples efectos de sonido (risas, aplausos, cortinas musicales) simultáneamente sin que se corten entre sí.
*   🛑 **Master Control ("Emergency Brake")**: Botón y funcionalidad de "Stop All" que purga instantáneamente todas las fuentes de audio activas. Control de volumen maestro en tiempo real.
*   💎 **Diseño *Premium* (Obsidian Editorial)**: Colores elegidos estratégicamente (carbón mate y acentos dorados `#F2CC5D`) para reducir la fatiga visual en estudios oscuros, sin usar bordes rígidos y priorizando la sensación de interacción física mediante sombras internas (*inner shadows*).
*   🖥️ **Modo Pantalla Completa**: Oculta distracciones y evita clics accidentales fuera de la consola de trabajo.

---

## 🛠️ Stack Tecnológico

*   **Frontend**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/) - Configurado para máxima velocidad en desarrollo.
*   **Audio Engine**: Javascript Puro (`window.AudioContext`)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 🚀 Instalación y Configuración Local

1. **Clonar/Descargar el repositorio**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Cargar los recursos (Assets)**:
   * **Audios**: Agrega tus archivos de sonido en formato `.mp3` dentro del directorio `public/sounds/`. Los archivos deben nombrarse estrictamente del `1.mp3` al `9.mp3`.
   * **Logo**: Asegúrate de tener el logo principal de la aplicación (`logo.jpg`) en el directorio `public/` raíz.
4. **Levantar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
5. Abre `http://localhost:5173` en tu navegador de preferencia. 

---

## 🎛️ Manual de Operación

| Tecla (Numpad) | Acción |
| :--- | :--- |
| **1 - 9** | Reproduce instantáneamente el sonido correspondiente (`public/sounds/X.mp3`). |
| **Botón de Stop All** | Detiene todos los sonidos en curso. |
| **Slider de Volumen** | Configura globalmente la ganancia para todos los nuevos triggers. |

---

## 📝 Roadmap & Tareas Futuras

*   [ ] Implementar sistema para cambiar keybindings visualmente usando `localStorage`.
*   [ ] Agregar soporte para páginas de *Banks* (Para usar más de 9 sonidos mediante flechas `<-` y `->`).
*   [ ] Permitir *Drag and Drop* sobre los pads para reemplazar el `.mp3` subyacente dinámicamente.

---
*Desarrollado con arquitectura moderna en mente para un flujo productivo de bajo estrés en estudios en vivo.*
