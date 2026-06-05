Buscador de Discografías y Reproductor de Streaming
Este proyecto es una aplicación web full-stack que permite buscar la discografía completa de cualquier banda o artista musical, listar sus álbumes con sus respectivas canciones y reproducir los temas directamente en streaming a través de un reproductor flotante incorporado.

La aplicación utiliza Python (Flask) en el backend para realizar el scraping y la extracción segura de flujos de audio, y un frontend moderno con HTML5, CSS3 y JavaScript asíncrono.

🚀 Características
🔍 Búsqueda Global: Encuentra perfiles de artistas y bandas gracias a la integración con el catálogo de YouTube Music.

📂 Discografías Completas: Despliega álbumes organizados con año de lanzamiento, número de canciones, duración total y portadas en alta resolución.

🎼 Listas Desplegables: Interfaz limpia que permite expandir y colapsar las canciones de cada disco de forma independiente.

🎵 Streaming de Audio Crudo: Extrae de manera dinámica el enlace directo del flujo de audio (bestaudio) alojado en los servidores de Google para una reproducción nativa, rápida y sin anuncios.

📱 Reproductor Flotante: Widget de reproducción integrado con controles multimedia nativos, persistencia visual, metadatos del tema y carátula del disco en reproducción.

🛠️ Tecnologías Utilizadas
Backend
Python 3

Flask: Framework web ágil para la creación de la API REST.

Flask-CORS: Manejo de intercambio de recursos de origen cruzado para la comunicación con el frontend.

ytmusicapi: Biblioteca para interactuar de forma oficial/interna con los endpoints de YouTube Music.

yt-dlp: Extractor avanzado de flujos multimedia para obtener los enlaces de audio directo (.googlevideo.com).

Frontend
HTML5 & CSS3: Maquetación estructurada y diseño responsivo con variables CSS nativas, temas oscuros (Dark Mode) inspirados en plataformas de streaming modernas y animaciones fluidas.

JavaScript (Vanilla JS): Lógica asíncrona mediante async/await y consumo de servicios a través de la API fetch.

📂 Estructura del Proyecto
Plaintext
├── app.py           # Servidor Backend en Flask y endpoints de la API
├── index.html       # Estructura principal de la interfaz de usuario
├── script.js        # Lógica del frontend, peticiones HTTP y control del reproductor
└── styles.css       # Estilos visuales, grillas, diseño oscuro y componentes
🔧 Requisitos e Instalación
1. Clonar el repositorio o guardar los archivos
Asegúrate de tener todos los archivos en una misma carpeta local.

2. Instalar las dependencias de Python
Abre tu terminal (o Git Bash) en la raíz del proyecto e instala los paquetes necesarios mediante pip:

Bash
pip install flask flask-cors ytmusicapi yt-dlp
🏁 Modo de Uso
Paso 1: Iniciar el Servidor Backend
Ejecuta el script del backend para levantar la API REST. Por defecto correrá en el puerto 5000.

Bash
python app.py
Verás un mensaje indicando que el servidor está activo en [http://127.0.0.1:5000](http://127.0.0.1:5000).

Paso 2: Abrir la Aplicación Web
No necesitas montar un servidor para el frontend. Simplemente haz doble clic sobre el archivo index.html para abrirlo en cualquier navegador web moderno (Chrome, Edge, Firefox, Brave, etc.).

Paso 3: Buscar y Reproducir
En la barra de búsqueda superior, escribe el nombre de tu banda favorita (por defecto viene Daft Punk como ejemplo).

Haz clic en "Buscar Discografía".

Expande cualquier álbum haciendo clic en el botón de "Canciones".

Presiona el botón de Play (▶) al lado de cualquier tema. El reproductor flotante aparecerá en la esquina inferior derecha e iniciará la música automáticamente.

📡 Endpoints de la API (Backend)
El servidor Flask expone dos rutas principales de libre acceso local:

GET /api/banda/<nombre_banda>

Descripción: Busca al artista, extrae su perfil, su fotografía y mapea recursivamente cada álbum con sus metadatos detallados y la lista interna de canciones (incluyendo sus títulos, duraciones e IDs de vídeo).

GET /api/stream/<video_id>

Descripción: Recibe el ID plano de transmisión y utiliza yt-dlp en modo de no-descarga (download=False) para resolver y devolver la URL directa del flujo de audio crudo en formato optimizado.
