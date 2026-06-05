from flask import Flask, jsonify, request
from flask_cors import CORS
from ytmusicapi import YTMusic
import yt_dlp

app = Flask(__name__)
CORS(app)

yt = YTMusic()

@app.route('/api/banda/<nombre_banda>', methods=['GET'])
def obtener_info_banda(nombre_banda):
    try:
        resultados = yt.search(query=nombre_banda, filter="artists")
        if not resultados:
            return jsonify({"error": "Artista no encontrado"}), 404
        
        artista = resultados[0]
        id_artista = artista['browseId']
        
        perfil_artista = yt.get_artist(channelId=id_artista)
        foto_banda = perfil_artista['thumbnails'][-1]['url'] if 'thumbnails' in perfil_artista else ""
        
        datos_finales = {
            "nombre_banda": perfil_artista['name'],
            "foto_banda": foto_banda,
            "albumes": []
        }
        
        if 'albums' in perfil_artista and 'params' in perfil_artista['albums']:
            id_seccion = perfil_artista['albums']['browseId']
            params = perfil_artista['albums']['params']
            
            todos_los_lanzamientos = yt.get_artist_albums(channelId=id_seccion, params=params)
            
            for lanzamiento in todos_los_lanzamientos:
                album_id = lanzamiento['browseId']
                detalle_album = yt.get_album(browseId=album_id)
                
                canciones = []
                for track in detalle_album.get('tracks', []):
                    v_id = track.get('videoId')
                    canciones.append({
                        "nombre_cancion": track.get('title'),
                        "duracion_cancion": track.get('duration'),
                        "video_id": v_id  # Mandamos solo el ID plano al JS
                    })
                
                foto_disco = detalle_album['thumbnails'][-1]['url'] if 'thumbnails' in detalle_album else ""
                
                datos_finales["albumes"].append({
                    "titulo_disco": detalle_album.get('title'),
                    "anio_disco": detalle_album.get('year', 'N/A'),
                    "foto_disco": foto_disco,
                    "cantidad_canciones": detalle_album.get('trackCount', len(canciones)),
                    "duracion_total_disco": detalle_album.get('duration', 'N/A'),
                    "canciones": canciones
                })
                
        return jsonify(datos_finales)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === NUEVA RUTA: EXTRAE EL LINK DEL AUDIO CRUDO ===
@app.route('/api/stream/<video_id>', methods=['GET'])
def obtener_stream_audio(video_id):
    try:
        url_youtube = f"https://www.youtube.com/watch?v={video_id}"
        
        # Configuración de yt-dlp para buscar solo el mejor formato de audio disponible
        ydl_opts = {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url_youtube, download=False)
            # Retornamos la URL directa del flujo de audio que aloja el servidor de Google
            return jsonify({"url_audio": info['url']})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)