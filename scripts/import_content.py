"""Import supplied article exports into the static redesign. Run from the project root."""
from pathlib import Path
from urllib.parse import urljoin, urlparse
import json, plistlib, re
from bs4 import BeautifulSoup, Comment
ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'studiesandarticles'
entries = [
 ('article',5,"Is Renting Really",'blog/is-renting-dead-money-uk.html'),
 ('article',1,'Which Jobs Is AI','blog/which-jobs-is-ai-actually-replacing.html'),
 ('article',2,'Statistical Significance','blog/statistical-significance-ab-testing.html'),
 ('article',3,'How to Select','blog/how-to-select-machine-learning-model.html'),
 ('project',0,'Can a Model','case-studies/detecting-ai-written-reviews.html'),
 ('project',1,None,'case-studies/rent-vs-buy-decision-model.html'),
 ('project',2,'Is AI Taking','case-studies/ai-and-jobs-causal-analysis.html'),
 ('project',3,'A:B Testing','case-studies/ab-testing-peeking-simulation.html'),
]
local_paths={path:f'#/{kind}/{ident}' for kind,ident,_,path in entries}
records={}
for kind, ident, prefix, path in entries:
 if prefix:
  source=next(p for p in SOURCE.glob('*.html') if p.name.startswith(prefix))
  raw=source.read_text()
 else:
  archive=plistlib.loads((SOURCE/'truthwithdata.com.webarchive').read_bytes())
  raw=archive['WebMainResource']['WebResourceData'].decode('utf-8')
 soup=BeautifulSoup(raw,'html.parser')
 body=soup.select_one('article.article-content, article.cs-body')
 if body is None: raise ValueError(f'Missing body: {path}')
 for comment in body.find_all(string=lambda text:isinstance(text,Comment)): comment.extract()
 for node in body.select('script, style, iframe, object, embed, form, button, .code-tabs, .toc, .cs-cta, .cs-more, .newsletter-band, .social-share, .share-buttons'):
  node.decompose()
 # Make every code example readable without the original tab scripts.
 for node in body.select('.tab-content'):
  node['class']=['imported-code-example']
 for node in body.find_all(True):
  for attr in list(node.attrs):
   if attr.lower().startswith('on') or attr in ('style','srcdoc','formaction'): del node[attr]
  if node.name=='a':
   href=node.get('href','')
   if href.startswith('#'):
    node['data-section']=href[1:];node['href']='#'
   elif href:
    url=urljoin('https://truthwithdata.com/'+path,href)
    parsed=urlparse(url)
    if parsed.scheme not in ('https','http','mailto'): node.attrs.pop('href',None); continue
    target=parsed.path.strip('/')
    node['href']=local_paths.get(target,local_paths.get(target+'.html',url))
    if node['href'].startswith('#/') and 'Read the full analysis' in node.get_text():
     node.clear();node.string='Explore the related article →'
    if not node['href'].startswith('#/'):
     node['target']='_blank';node['rel']='noopener noreferrer'
  if node.name=='img':
   node['src']=urljoin('https://truthwithdata.com/'+path,node.get('src',''))
   node['loading']='lazy';node.attrs.pop('style',None)
  if node.name in ('input','select','textarea'): node.decompose()
 # The source demo depends on its original scripts/backend: keep its explanation and explicit destination.
 demo=body.select_one('#demo')
 if demo:
  demo_link=soup.new_tag('a',href='https://truthwithdata.com/'+path+'#demo',target='_blank',rel='noopener noreferrer')
  demo_link['class']='button';demo_link.string='Open the interactive demo ↗';demo.append(demo_link)
 toc=[]
 for i,h in enumerate(body.select('h2')):
  section=h.get('id') or (h.parent.get('id') if h.parent.name=='section' else None) or f'section-{i+1}'
  h['id']=section
  # Avoid two identical IDs when an enclosing source section carried the anchor.
  if h.parent.get('id')==section: del h.parent['id']
  toc.append({'id':section,'title':h.get_text(' ',strip=True)})
 records[f'{kind}/{ident}']={'html':body.decode_contents(),'toc':toc,'source':'https://truthwithdata.com/'+path,'words':len(body.get_text(' ',strip=True).split())}
(ROOT/'article-content.js').write_text('window.ARTICLE_CONTENT = '+json.dumps(records,ensure_ascii=False)+';\n')
print('Imported',len(records),'complete article/study bodies:',sum(r['words'] for r in records.values()),'words')
