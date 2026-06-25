# Landing TransCoLab Plus

Paquete completo de la landing estática de TransCoLab Plus.

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

## Sección 3D

El módulo de transformación utiliza Canvas 2D con profundidad, morphing entre cinco estados, control por scroll, navegación manual, pausa, fallback visual y soporte para reducción de movimiento.

## Formulario de inscripción

Todos los CTA apuntan a:

`https://camarazamora.formaloo.me/5of92q`
