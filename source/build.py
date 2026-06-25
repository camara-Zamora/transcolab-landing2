from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODULES = sorted((ROOT / "modules").glob("*.html"))

head = '''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#063b2c">
  <title>Economía circular en la industria cerealista | Formación gratuita en Zamora</title>
  <meta name="description" content="Formación presencial gratuita de 40 horas en Zamora sobre desperdicio alimentario, subproductos, calidad, normativa, financiación e innovación cerealista.">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Economía circular en la industria cerealista">
  <meta property="og:description" content="40 horas, seis módulos y demostraciones prácticas en obrador. Formación gratuita en Zamora.">
  <meta property="og:image" content="assets/og-transcolab.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/cereal-portrait.webp" as="image" type="image/webp" fetchpriority="high">
  <link rel="stylesheet" href="assets/styles.css">
  <script>document.documentElement.className='js';</script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Plan de formación en economía circular en la industria cerealista",
    "description": "Formación presencial gratuita de 40 horas sobre economía circular aplicada al sector cerealista.",
    "provider": {"@type": "Organization", "name": "TransCoLab Plus"},
    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR", "availability": "https://schema.org/InStock"},
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "onsite",
      "location": {"@type": "Place", "name": "Harinera Eventos", "address": "Carretera de Villalpando, km 2, 49023 Zamora, España"},
      "startDate": "2026-07-07",
      "endDate": "2026-09-29"
    }
  }
  </script>
</head>
<body>
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<main id="contenido">
'''

foot = '''\n</main>\n<script src="assets/app.js" defer></script>\n</body>\n</html>\n'''

body = "\n".join(module.read_text(encoding="utf-8") for module in MODULES)
(ROOT / "index.html").write_text(head + body + foot, encoding="utf-8")
print(f"Built index.html from {len(MODULES)} modules")
