"""Render the independent portfolio. Python 3, no dependencies."""
from pathlib import Path
import json, html
BASE=Path(__file__).parent
OUT=BASE/'dist'
DATA=json.loads((BASE/'content.json').read_text(encoding='utf-8-sig'))
MEDIA=json.loads((BASE/'media-map.json').read_text(encoding='utf-8-sig'))
FILMS=DATA['films']; RECOGNITION=DATA['writingRecognition']; E=html.escape
def url(p,root=''): return root+'projects/'+p['id']+'/index.html'
def pic(still,root='',lazy=True,cls=''):
    m=MEDIA[still['url']]
    return f'<img class="{cls}" src="{root}media/{m["path"]}" alt="{E(still["alt"])}" width="{m["width"]}" height="{m["height"]}" loading="{"lazy" if lazy else "eager"}" decoding="async">'
def outside(href,label): return f'<a href="{E(href)}" target="_blank" rel="noopener noreferrer">{E(label)}<span aria-hidden="true"> ↗</span></a>'
def head(title,root='',world='film',home=False,page_path='',description='Lakaaysha van Ewijk. Film director, visual artist and author. Amsterdam.'):
    canonical='https://lakaaysha.com/'+page_path
    metadata=f'<link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(description)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="https://lakaaysha.com/media/heron-4.webp"><meta name="twitter:card" content="summary_large_image">'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)}</title><meta name="description" content="{E(description)}">{metadata}<meta name="robots" content="{'noindex' if page_path=='404.html' else 'index,follow'}"><meta name="portfolio-version" content="2026-09-11-cursor"><meta name="theme-color" content="{'#96254f' if world=='ink' else '#211425'}"><link rel="icon" href="{root}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{root}fonts.css"><link rel="stylesheet" href="{root}style.css"><script src="{root}app.js" defer></script></head><body class="world-{world}{' homepage' if home else ''}" data-root="{root}"><a class="skip" href="#main">Skip to content</a><header class="site-header" id="top"><a class="identity" href="{root}index.html">Lakaaysha van Ewijk</a><nav aria-label="Main navigation"><a href="{root}index.html#films" {'aria-current="page"' if world=='film' else ''}>Films</a><a href="{root}ink/index.html" {'aria-current="page"' if world=='ink' else ''}>Writing</a><a href="#contact">Contact</a></nav></header>'''
def contact(root='',compact=False):
    social=''.join(outside(x['url'],x['label']) for x in DATA['social'])
    return f'''<section class="contact" id="contact"><div class="contact-top"><h2>Contact</h2><p>Amsterdam, NL</p></div><a class="email" href="mailto:{DATA['email']}">{DATA['email']}<span aria-hidden="true">↗</span></a><div class="contact-bottom"><div class="socials">{social}</div><a href="{root}{'index.html' if compact else 'ink/index.html'}">{'Films' if compact else 'Writing'} <span aria-hidden="true">↗</span></a></div></section>'''
def footer(root='',dialog=True):
    s='<footer class="footer"><span>© 2026 Lakaaysha van Ewijk</span><button class="cursor-toggle" type="button" aria-pressed="true" hidden>Cursor animation on</button><a href="#top">Back to top ↑</a></footer>'
    if dialog:
        s+='''<dialog class="viewer" aria-label="Image and showreel viewer"><div class="viewer-bar"><span class="viewer-label"></span><button class="viewer-close" aria-label="Close viewer">Close ×</button></div><div class="viewer-media"></div><div class="viewer-bottom"><button class="viewer-prev" aria-label="Previous still">← Previous</button><span class="viewer-count" aria-live="polite"></span><button class="viewer-next" aria-label="Next still">Next →</button></div></dialog>'''
    return s+'</body></html>'
def write(path,s):
    p=OUT/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8')
def details(p): return f'<span>{E(p["format"])}</span><span>{p["year"]}</span>'
def titlelink(p): return f'<a class="title-link" href="{url(p)}"><h3>{E(p["title"])}</h3><span class="project-arrow" aria-hidden="true">↗</span></a>'

genc,seven,paint,human,dutch,herons,breakfast=FILMS[1:]
home=head('Lakaaysha van Ewijk | Film, art & writing',home=True)
home+=f'''<main id="main"><section class="cinema" aria-label="Film portfolio"><img class="cinema-poster" src="media/heron-4.webp" alt="A surreal landscape with birds from The herons are back." fetchpriority="high"><div class="cinema-shade"></div><div class="cinema-top"><p>Film director<br>Visual artist &amp; author</p><p>Amsterdam, NL</p></div><h1>Lakaaysha</h1><div class="cinema-bottom"><a href="{url(herons)}">The herons are back <span>2021 ↗</span></a><button class="reel-open">Showreel <span aria-hidden="true">▶</span></button><a href="#films" aria-label="Scroll to films">↓</a></div></section><section class="film-index" id="films"><div class="section-heading"><h2>Films</h2><span>2020—2026 / 08</span></div>'''
home+=f'''<article class="film-spread gen-spread"><div class="spread-caption"><div class="project-meta">{details(genc)}</div>{titlelink(genc)}<p>{E(genc['commissioner'])}</p></div><a class="gen-images" href="{url(genc)}" aria-label="View Gen C">{pic(genc['stills'][0])}{pic(genc['stills'][2])}{pic(genc['stills'][3])}</a></article>'''
home+=f'''<article class="film-spread seven-spread"><a class="screen-image" href="{url(seven)}" aria-label="View 7+1">{pic(seven['stills'][1],cls='base-frame')}{pic(seven['stills'][0],cls='alternate-frame')}</a><div class="spread-caption"><div class="project-meta">{details(seven)}</div>{titlelink(seven)}<p>{E(seven['commissioner'])}</p></div></article>'''
home+=f'''<article class="film-spread painted-spread"><div class="painted-images"><a href="{url(paint)}" aria-label="View No love, no mountains, living horizontally">{pic(paint['stills'][2])}</a><a href="{url(paint)}" aria-label="View another still from No love, no mountains, living horizontally">{pic(paint['stills'][3])}</a></div><div class="spread-caption"><div class="project-meta">{details(paint)}</div>{titlelink(paint)}</div></article>'''
home+='<div class="archive-grid">'
for p,index in [(herons,4),(human,1),(dutch,3),(breakfast,4)]:
    home+=f'<article class="archive-project"><a class="archive-image" href="{url(p)}" aria-label="View {E(p["title"])}">{pic(p["stills"][index])}</a><div class="project-meta">{details(p)}</div>{titlelink(p)}</article>'
home+='</div>'; p=FILMS[0]
home+=f'''<a class="development" href="{url(p)}"><span>{p['year']} / {E(p['status'])}</span><h3>{E(p['title'])}</h3><span>{E(p['commissioner'])}</span><span aria-hidden="true">↗</span></a></section>'''
recognition_label=f'{RECOGNITION["title"]} — {RECOGNITION["award"]} {RECOGNITION["category"]} shortlist'
home+='<section class="press" id="press"><h2>Press &amp; recognition</h2><div>'+outside(RECOGNITION['shortlistUrl'],recognition_label)+''.join(outside(p['url'],p['label']) for p in DATA['press'])+'</div></section>'+contact()+'</main>'+footer()
write(Path('index.html'),home)
writing=head('Lakaaysha van Ewijk | Writing','../','ink',page_path='ink/',description='Writing by Lakaaysha van Ewijk. '+RECOGNITION['announcement'])
writing+='''<main id="main"><section class="writing-portrait"><div class="writing-meta"><span>Writing</span><span>Amsterdam, NL</span></div><h1><span>Lakaaysha</span><span>van Ewijk</span></h1><div class="writing-bottom" id="contact"><span>Author</span><a href="mailto:lakaaysha@gmail.com">lakaaysha@gmail.com ↗</a></div></section>'''
writing+=f'''<section class="writing-recognition" id="{E(RECOGNITION['id'])}" aria-labelledby="recognition-title"><div class="recognition-meta"><p>{E(RECOGNITION['award'])}</p><p>{E(RECOGNITION['category'])} category · {E(RECOGNITION['status'])}</p></div><div class="recognition-story"><h2 id="recognition-title">{E(RECOGNITION['title'])}</h2><p>{E(RECOGNITION['announcement'])}</p><div class="recognition-links">{outside(RECOGNITION['shortlistUrl'],'View the official shortlist')}{outside(RECOGNITION['storyUrl'],'Read Queerantine on Wattpad')}</div></div></section>'''
writing+='<div class="writing-socials">'+''.join(outside(x['url'],x['label']) for x in DATA['social'])+'</div></main>'+footer('../',False)
write(Path('ink/index.html'),writing)
for n,p in enumerate(FILMS):
    root='../../';page=head(p['title']+' | Lakaaysha van Ewijk',root,page_path='projects/'+p['id']+'/')
    page+=f'''<main id="main"><section class="project-heading"><a class="back-link" href="{root}index.html#films">← Films</a><div class="project-meta">{details(p)}</div><h1>{E(p['title'])}</h1><div class="project-credit"><p>{E(p['crew'])}</p><p>{E(p.get('commissioner',''))}</p></div></section>'''
    stills=p['stills']
    if stills:
        if p['id']=='gen-c':
            page+='<div class="project-triptych">'+''.join(f'<button class="still-trigger" data-index="{i}" aria-label="Open still {i+1} from {E(p["title"])}">{pic(stills[i],root,False)}</button>' for i in [0,2,3])+'</div>'
        else:
            page+=f'<div class="project-screen"><button class="still-trigger" data-index="0" aria-label="Open still 1 from {E(p["title"])}">{pic(stills[0],root,False)}</button></div>'
        page+=f'<section class="stills-section"><div class="stills-heading"><h2>Stills</h2><span>{len(stills):02}</span></div><div class="stills-grid {"portrait-stills" if stills[0]["orientation"]=="portrait" else "landscape-stills"}">'
        for i,still in enumerate(stills): page+=f'<button class="still-trigger" data-index="{i}" aria-label="Open still {i+1} from {E(p["title"])}">{pic(still,root)}<span>{i+1:02}<span aria-hidden="true">↗</span></span></button>'
        page+='</div></section>'
        gallery=[{'src':root+'media/'+MEDIA[x['url']]['path'],'alt':x['alt']} for x in stills]
        page+='<script type="application/json" id="gallery-data">'+json.dumps(gallery,ensure_ascii=False).replace('</',r'<\/')+'</script>'
    else: page+=f'<div class="project-development"><span>{E(p["status"])}</span><p>{E(p["commissioner"])}</p></div>'
    relevant=[x for x in DATA['press'] if x.get('project')==p['id']]
    if relevant: page+='<section class="project-sources"><h2>Press &amp; programmes</h2><div>'+''.join(outside(x['url'],x['label']) for x in relevant)+'</div></section>'
    nextp=FILMS[(n+1)%len(FILMS)]
    page+=f'<a class="next-project" href="{url(nextp,root)}"><span>Next project</span><span>{E(nextp["title"])}</span><span aria-hidden="true">↗</span></a>'+contact(root)+'</main>'+footer(root)
    write(Path('projects')/p['id']/'index.html',page)
page=head('Page not found | Lakaaysha van Ewijk','/',page_path='404.html')+'<main id="main" class="not-found"><p>404</p><h1>Page not found</h1><a href="/">Return to home</a></main>'+contact('/')+footer('/',False)
write(Path('404.html'),page)
write(Path('robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://lakaaysha.com/sitemap.xml\n')
routes=['','ink/']+['projects/'+p['id']+'/' for p in FILMS]
write(Path('sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>https://lakaaysha.com/'+p+'</loc></url>' for p in routes)+'</urlset>')
write(Path('_redirects'),'/books /ink/ 301\n/books/ /ink/ 301\n'+'\n'.join(path+' /media/'+asset['path']+' 301' for path,asset in MEDIA.items())+'\n')
print('Built 11 pages.')
