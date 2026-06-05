async function buscarBanda() {
    const nombre = document.getElementById('busqueda').value;
    const contenedor = document.getElementById('resultado');
    contenedor.innerHTML = "<p style='text-align:center; color:#b3b3b3;'>Cargando discografía completa (esto puede tomar unos segundos)...</p>";

    try {
        const response = await fetch(`http://localhost:5000/api/banda/${encodeURIComponent(nombre)}`);
        const data = await response.json();

        if (data.error) {
            contenedor.innerHTML = `<p style='text-align:center; color:#ff0055;'>Error: ${data.error}</p>`;
            return;
        }

        let html = `
            <div class="banda-header">
                <img class="banda-foto" src="${data.foto_banda ? data.foto_banda : 'https://via.placeholder.com/150'}" alt="${data.nombre_banda}">
                <h1>${data.nombre_banda}</h1>
            </div>
            <div class="grid-albumes">
        `;

        data.albumes.forEach((album, index) => {
            html += `
                <div class="card-album">
                    <img class="foto-album" src="${album.foto_disco ? album.foto_disco : 'https://via.placeholder.com/300'}" alt="${album.titulo_disco}">
                    <div class="album-info">
                        <h3>${album.titulo_disco}</h3>
                        <p>Año: ${album.anio_disco} | Duración: ${album.duracion_total_disco}</p>
                    </div>
                    
                    <button class="btn-desplegar" onclick="conmutarLista(${index})">
                        <span>Canciones (${album.cantidad_canciones})</span>
                        <span id="flecha-${index}">▼</span>
                    </button>
                    
                    <div id="lista-${index}" class="lista-canciones">
                        <ul>
            `;

            album.canciones.forEach(cancion => {
                // Limpiamos comillas por seguridad en los textos
                const tituloLimpio = cancion.nombre_cancion.replace(/'/g, "\\'");
                const bandaLimpia = data.nombre_banda.replace(/'/g, "\\'");
                const fotoDisco = album.foto_disco ? album.foto_disco : 'https://via.placeholder.com/150';

                html += `
                    <li>
                        <div class="cancion-izquierda">
                        <button class="btn-play" onclick="reproducirCancion('${cancion.video_id}', '${tituloLimpio}', '${bandaLimpia}', '${fotoDisco}')">▶</button>
                        <span class="cancion-nombre" title="${cancion.nombre_cancion}">${cancion.nombre_cancion}</span>
                        </div>
                        <span class="cancion-duracion">${cancion.duracion_cancion ? cancion.duracion_cancion : '--:--'}</span>
                    </li>
            `;
            });

            html += `</ul></div></div>`;
        });

        html += `</div>`;
        contenedor.innerHTML = html;

    } catch (error) {
        contenedor.innerHTML = "<p style='text-align:center; color:#ff0055;'>Error de conexión con el servidor Python. Asegúrate de que app.py esté corriendo.</p>";
        console.error(error);
    }
}

function conmutarLista(index) {
    const lista = document.getElementById(`lista-${index}`);
    const flecha = document.getElementById(`flecha-${index}`);
    
    if (lista.classList.contains('activo')) {
        lista.classList.remove('activo');
        flecha.innerText = "▼";
    } else {
        lista.classList.add('activo');
        flecha.innerText = "▲";
    }
}

async function reproducirCancion(videoId, titulo, banda, portada) {
    if (!videoId || videoId === "null" || videoId === "undefined") {
        alert("Esta canción no tiene un ID de transmisión válido.");
        return;
    }
    
    const widget = document.getElementById('reproductorWidget');
    const player = document.getElementById('audioPlayer');
    const txtTitulo = document.getElementById('reproductorTitulo');
    const txtBanda = document.getElementById('reproductorBanda');
    const imgPortada = document.getElementById('reproductorPortada');

    // Estado de carga inicial
    txtTitulo.innerText = "Cargando audio...";
    txtBanda.innerText = banda;
    imgPortada.src = portada;
    widget.style.display = "block";

    try {
        // Consumimos la ruta de Flask en Python
        const response = await fetch(`http://localhost:5000/api/stream/${videoId}`);
        const data = await response.json();

        if (data.error) {
            txtTitulo.innerText = "Error de carga";
            alert("No se pudo extraer el audio de este servidor.");
            return;
        }

        // Asignamos los datos reales una vez obtenido el stream
        txtTitulo.innerText = titulo;
        player.src = data.url_audio;
        player.play();

    } catch (error) {
        console.error(error);
        txtTitulo.innerText = "Error de conexión";
    }
}

function cerrarReproductor() {
    const widget = document.getElementById('reproductorWidget');
    const player = document.getElementById('audioPlayer');
    player.pause();
    player.src = "";
    widget.style.display = "none";
}