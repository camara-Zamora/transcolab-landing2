# Revisión modular de la landing TransCoLab Plus

## Estado general

Landing completa diseñada y revisada por módulos. Cada bloque funciona de forma independiente y mantiene coherencia con el resto del recorrido.

## Módulos revisados

1. **Hero** — CTA visible en la primera pantalla, mensaje emocional, datos esenciales e imagen sectorial. Corregido el desbordamiento móvil del H1 y de las etiquetas visuales.
2. **Transformación 3D** — Canvas pseudo-3D integrado, cinco etapas, navegación, pausa, fallback y reduced motion. Refinada la forma inicial para que se lea como cereal.
3. **Beneficios** — Beneficios concretos y conectados con los módulos, evitando promesas genéricas.
4. **40 horas** — Distribución visual 24 + 16, aclaración de materiales, ausencia de evaluación y asistencia flexible.
5. **Programa** — Arquitectura editorial con seis módulos, fechas, docentes, contenido y formato por sesión.
6. **Obrador** — Narrativa práctica, presencia de Florindo Fierro y transparencia sobre los productos concretos.
7. **Docentes** — Seis perfiles vinculados a su ámbito y módulo correspondiente.
8. **Público** — Segmentación por necesidades reales, sin exigir nivel técnico avanzado.
9. **Información práctica** — Calendario agrupado por meses, horario, ubicación y enlace a Google Maps.
10. **Valor y financiación** — Comparación transparente entre valor aproximado y coste 0 €, sin precio tachado ni urgencia artificial.
11. **Modalidades** — Itinerario completo y módulos individuales con diferencias claras.
12. **FAQ** — Siete preguntas sobre coste, asistencia, formato, Moodle, práctica, nivel y ubicación.
13. **CTA y footer** — Cierre claro, sin lenguaje de plazas limitadas, más navegación de apoyo y CTA móvil.

## Resultado QA

- Comprobaciones superadas: **28/28**
- Un único H1
- IDs y anclas válidas
- Recursos locales presentes
- Fechas, docentes y ubicación completos
- Sin urgencia falsa ni certificación inventada
- Canvas, fallback, pausa y reduced motion presentes
- JavaScript válido
- CSS equilibrado
- JSON-LD válido

## Archivos principales

- `index.html`: versión para publicar
- `preview.html`: versión autocontenida para revisar en móvil
- `modules/`: 13 módulos editables
- `assets/styles.css`: sistema visual responsive
- `assets/app.js`: interacción, canvas, acordeones y CTA móvil
- `docs/qa-results.json`: resultado detallado de QA
