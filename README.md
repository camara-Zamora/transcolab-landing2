# Landing TransCoLab Plus

Paquete completo de la landing estática de TransCoLab Plus. Versión sin la sección “Recorrido”.

## Publicación directa

Para publicar en GitHub Pages, Netlify o cualquier hosting estático, utiliza estos elementos de la raíz:

- `index.html`
- `assets/`
- `netlify.toml` (solo necesario en Netlify)

No necesita npm, compilación ni servidor.

## Código fuente editable

La carpeta `source/` incluye:

- `modules/`: los 13 módulos HTML de la landing.
- `build.py`: reconstruye `index.html` desde los módulos.
- `qa_check.py`: ejecuta la validación automática.
- `docs/`: arquitectura, revisión de módulos y resultados de QA.

Para editar modularmente, copia temporalmente `index.html`, `assets/` y `netlify.toml` dentro de `source/`, modifica los módulos y ejecuta:

```bash
python3 build.py
python3 qa_check.py
```


## Formulario de inscripción

Todos los CTA apuntan a:

`https://camarazamora.formaloo.me/5of92q`


## Ajuste v4

Corregido el recorte de fotografías en el acordeón de equipo docente: en escritorio las fotos activas se desplazan a la zona derecha y el texto queda en una columna limpia a la izquierda.
