# Arquitectura de la landing

## Principio rector

La landing debe convertir incluso sin animación. El recorrido visual y el futuro 3D refuerzan el mensaje, pero no sustituyen la comprensión, las fechas, el programa ni el CTA.

## Orden narrativo

1. **Hero:** emoción, especificidad y CTA antes del primer scroll.
2. **Transformación:** explica visualmente el cambio de materia prima a valor.
3. **Resultados:** aterriza cuatro beneficios concretos.
4. **40 horas:** explica la modalidad sin ambigüedad.
5. **Programa:** presenta los seis módulos y docentes.
6. **Obrador:** conecta teoría y aplicación práctica.
7. **Docentes:** refuerza autoridad sin depender de fotografías.
8. **Público:** ayuda al visitante a reconocerse.
9. **Información práctica:** fechas, horario, lugar y materiales.
10. **Valor:** explica el coste 0 € y el valor aproximado.
11. **Modalidades:** diferencia itinerario completo y sesiones sueltas.
12. **FAQ:** elimina objeciones.
13. **CTA final:** cierra el recorrido y conduce al formulario.

## Decisiones visuales

- Estética editorial agroindustrial, no plantilla SaaS.
- Tipografía condensada para impacto, serif para emoción y sans para interfaz.
- Verde profundo, ámbar y crema como sistema cromático.
- Bordes, líneas y grandes números en lugar de tarjetas repetitivas.
- El contenido real del programa se convierte en recursos visuales.
- El hero usa `100svh`/`100dvh` como mínimo flexible, no una altura rígida.

## Criterios de conversión

- CTA principal visible en la primera pantalla móvil.
- CTA fijo móvil solo después de abandonar el hero.
- Inscripción repetida en momentos de alta intención.
- Sin urgencia falsa ni escasez inventada.
- El valor aproximado de 2.000 € se presenta como refuerzo, no como reclamo agresivo.

## Criterios técnicos

- HTML semántico.
- Un único H1.
- Acordeones nativos con `details`/`summary`.
- Animaciones progresivas y desactivables.
- Safe areas para móvil.
- Recursos WebP optimizados.
- Sin dependencias JavaScript externas.
- JSON-LD de tipo `Course`.
