from pathlib import Path
from bs4 import BeautifulSoup
import json, re, subprocess, sys

ROOT = Path(__file__).resolve().parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'assets/styles.css').read_text(encoding='utf-8')
js = (ROOT / 'assets/app.js').read_text(encoding='utf-8')
soup = BeautifulSoup(html, 'html.parser')

checks = []
def add(name, ok, detail=''):
    checks.append({'name': name, 'ok': bool(ok), 'detail': detail})

# Structure
h1s = soup.find_all('h1')
add('Un único H1', len(h1s) == 1, f'{len(h1s)} encontrados')
ids = [tag.get('id') for tag in soup.find_all(attrs={'id': True})]
add('IDs únicos', len(ids) == len(set(ids)), f'{len(ids)} ids, {len(set(ids))} únicos')
add('13 módulos fuente', len(list((ROOT/'modules').glob('*.html'))) == 13, f"{len(list((ROOT/'modules').glob('*.html')))} módulos")

# Anchors
broken = []
for a in soup.find_all('a', href=True):
    href = a['href']
    if href.startswith('#') and href != '#':
        if href[1:] not in set(ids): broken.append(href)
add('Anclas internas válidas', not broken, ', '.join(broken) if broken else 'todas resuelven')

# Assets and alt text
missing = []
for tag in soup.find_all(['img', 'script', 'link']):
    attr = 'src' if tag.name in ('img','script') else 'href'
    val = tag.get(attr)
    if val and val.startswith('assets/'):
        if not (ROOT/val).exists(): missing.append(val)
add('Recursos locales presentes', not missing, ', '.join(missing) if missing else 'todos presentes')
imgs = soup.find_all('img')
missing_alt = [img.get('src','') for img in imgs if img.get('alt') is None]
add('Todas las imágenes tienen alt', not missing_alt, f'{len(imgs)} imágenes')

# Content truthfulness guardrails
lower = html.lower()
forbidden = ['plazas limitadas', 'últimas plazas', 'fecha límite', 'certificado oficial', '40 horas certificadas', 'solicitar mi plaza', 'reservar el itinerario', 'reservar plaza']
found = [x for x in forbidden if x in lower]
add('Sin urgencia o certificación inventada', not found, ', '.join(found) if found else 'sin términos problemáticos')
add('Indica 24 h presenciales', '24' in html and 'horas presenciales' in lower)
add('Indica 16 h de materiales', '16' in html and 'horas de materiales' in lower)
add('Aclara ausencia de evaluación', 'sin ejercicios ni evaluación' in lower)
add('Permite módulos individuales', 'módulos individuales' in lower)

# Accessibility and responsive
add('Skip link presente', soup.select_one('.skip-link') is not None)
add('Reduced motion presente', 'prefers-reduced-motion' in css)
add('Safe area presente', 'safe-area-inset-bottom' in css)
add('Hero usa viewport seguro', '100svh' in css and '100dvh' in css)
add('CTA principal antes de la transformación', html.find('Inscribirme gratis') < html.find('id="recorrido"'))
add('Formulario de inscripción enlazado', html.count('https://camarazamora.formaloo.me/5of92q') >= 4)


# 3D / interaction module
add('Canvas de transformación presente', soup.select_one('[data-transform-canvas]') is not None)
add('Control de pausa presente', soup.select_one('[data-transform-pause][aria-pressed]') is not None)
add('Cinco etapas de transformación', len(soup.select('[data-transform-step]')) == 5, f"{len(soup.select('[data-transform-step]'))} etapas")
add('Fallback visual del 3D presente', soup.select_one('.transform-fallback-image') is not None)
add('CTA móvil presente', soup.select_one('[data-mobile-cta]') is not None)

# Semantic controls
invalid_buttons = [b for b in soup.find_all('button') if not b.get('type')]
add('Botones con type explícito', not invalid_buttons, f'{len(invalid_buttons)} sin type')
invalid_details = [d for d in soup.find_all('details') if d.find('summary') is None]
add('Todos los details tienen summary', not invalid_details, f'{len(invalid_details)} sin summary')

# CSS sanity
add('CSS con llaves equilibradas', css.count('{') == css.count('}'), f"{css.count('{')} abre / {css.count('}')} cierra")

# JS syntax
result = subprocess.run(['node','--check',str(ROOT/'assets/app.js')], capture_output=True, text=True)
add('JavaScript válido', result.returncode == 0, result.stderr.strip())

# JSON-LD parses
jsonld = soup.find('script', {'type':'application/ld+json'})
try:
    data = json.loads(jsonld.string)
    add('JSON-LD válido', data.get('@type') == 'Course', data.get('@type',''))
except Exception as exc:
    add('JSON-LD válido', False, str(exc))

# Required course data
required_strings = [
    '7 julio','8 julio','27 julio','28 julio','28 septiembre','29 septiembre',
    'Roberto Ruiz de Arcaute','Elena Fernández','Thomas Dietrich','Néstor Etxaleku','Aina Calafat','Lola Raigón',
    'Harinera Eventos','Carretera de Villalpando, km 2'
]
missing_content = [s for s in required_strings if s not in html]
add('Fechas, docentes y ubicación completos', not missing_content, ', '.join(missing_content) if missing_content else 'datos completos')

report = {
    'passed': sum(c['ok'] for c in checks),
    'total': len(checks),
    'checks': checks,
}
(ROOT/'docs/qa-results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
if report['passed'] != report['total']:
    sys.exit(1)
