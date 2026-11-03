from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent.parent
out=ROOT/'assets/tools';out.mkdir(parents=True,exist_ok=True)
entries=[('Descriptive','descriptive','descriptive-stats-calculator.html'),('Standard Deviation','variance','std-dev-variance-calculator.html'),('Percentile','percentile','percentile-quartile-calculator.html'),('Correlation','correlation','correlation-calculator.html'),('Covariance','covariance','covariance-calculator.html'),('Rent vs','rent-buy','rent-vs-buy-calculator.html'),('AI Job','ai-jobs','ai-job-exposure-checker.html')]
for prefix,slug,remote in entries:
 source=next(p for p in (ROOT/'studiesandarticles').glob('*.html') if p.name.startswith(prefix))
 soup=BeautifulSoup(source.read_text(),'html.parser')
 for node in soup.select('nav,footer,.newsletter-band,.tool-header,.breadcrumb,.tool-breadcrumb,.tool-related,.related-tools,.tool-faq,.faq-section,.ad-slot,.report-panel, .tool-intro'):
  node.decompose()
 for script in soup.find_all('script'):
  src=script.get('src','')
  if script.get('type')=='application/ld+json' or any(x in src for x in ['googlesyndication','navigation.js','report-download','rent-vs-buy-report']):
   script.decompose();continue
  if src:
   script['src']=urljoin('https://truthwithdata.com/tools/'+remote,src)
   script['onerror']="document.getElementById('dependency-status').hidden=false"
 for link in soup.select('link[rel="stylesheet"]'):
  link.decompose()
 for a in soup.find_all('a',href=True):
  if not a['href'].startswith('#'):
   a['href']=urljoin('https://truthwithdata.com/tools/'+remote,a['href']);a['target']='_blank';a['rel']='noopener noreferrer'
 style=soup.new_tag('style');style.string='''*{box-sizing:border-box}html,body{height:auto!important;min-height:0!important;margin:0!important;padding:0!important;background:white!important;color:#15202c;font-family:Arial,sans-serif;line-height:1.65}body{overflow-x:hidden}h1{font-size:25px!important;line-height:1.3!important;letter-spacing:-.035em}h2{font-size:21px!important;line-height:1.4}h3{font-size:17px!important}p{font-size:14px}.tool-page{min-height:0!important;height:auto!important;max-width:none!important;margin:0!important;padding:0!important}.tool-container{max-width:none!important;margin:0!important;padding:0!important;box-shadow:none!important;border:0!important}.tool-page>h1,.tool-page>.tool-subtitle{display:none}input,textarea,select{max-width:100%;font:inherit;border-radius:0!important;border:1px solid #c6d0df;padding:12px!important}textarea{width:100%;min-height:125px}button,.calculate-btn,.btn{font:inherit;border-radius:0!important;background:#2055eb!important;color:#fff!important;padding:11px 18px!important;border:0!important;cursor:pointer}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;padding:10px;border-bottom:1px solid #e0e6ef}img,canvas,svg{max-width:100%}.tool-actions,.tool-header,.breadcrumb,.newsletter-band,.tool-related,.report-panel{display:none!important}a{color:#2055eb}label{font-size:13px;font-weight:600}#dependency-status{background:#fff7e5;border:1px solid #e6ce99;padding:15px;font-size:13px;margin-bottom:20px}.tool-layout{grid-template-columns:1fr!important}.tool-grid{gap:20px!important}.info-box,.result-card,.stat-card{border-radius:0!important;box-shadow:none!important}.rvb-results{min-width:0}@media(max-width:600px){.calculator-grid,.input-grid,.tool-columns,.results-grid{grid-template-columns:1fr!important}}''';soup.head.append(style)
 status=soup.new_tag('p',id='dependency-status',hidden='');status.string='This tool needs its original model/data scripts. Connect to the internet and reload to load them.';soup.body.insert(0,status)
 resize=soup.new_tag('script');resize.string="""let lastSentHeight=0;function notifyHeight(){const height=Math.ceil(document.body.getBoundingClientRect().height);if(Math.abs(height-lastSentHeight)>2){lastSentHeight=height;parent.postMessage({type:'twd-tool-height',height},'*')}}window.addEventListener('load',notifyHeight);if(typeof ResizeObserver!=='undefined')new ResizeObserver(notifyHeight).observe(document.body);""";soup.body.append(resize)
 (out/(slug+'.html')).write_text(str(soup))
print('Imported 7 tools; five include local calculation code; housing/AI load original model/data scripts online.')
