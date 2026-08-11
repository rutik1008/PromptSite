import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Check, ChevronDown, Code2, Download, GitBranch, Globe2, Layers3, LoaderCircle, LogOut, Menu, Plus, Rocket, Sparkles, WandSparkles, X } from 'lucide-react'
import './styles.css'

const examples = [
  'A refined landing page for a sustainable skincare brand',
  'A bold portfolio for an independent architecture studio',
  'A warm, editorial website for a boutique coffee roaster'
]

function makeSite(prompt) {
  const isDark = /dark|tech|saas|ai|developer/i.test(prompt)
  const subject = prompt.replace(/^a\s+/i, '').replace(/[.!]$/, '') || 'a remarkable new brand'
  const bg = isDark ? '#111317' : '#f5f1e9'
  const ink = isDark ? '#f7f5f0' : '#1b211c'
  const accent = isDark ? '#d7ff52' : '#dd5f3d'
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Studio Noma</title>
<style>*{box-sizing:border-box}body{margin:0;background:${bg};color:${ink};font-family:Arial,sans-serif}nav{display:flex;justify-content:space-between;padding:28px 5%;font-weight:700}.pill{border:1px solid currentColor;border-radius:99px;padding:10px 16px;font-size:13px}main{padding:80px 5% 48px;min-height:76vh}h1{max-width:900px;font:600 clamp(48px,8vw,112px)/.96 Georgia,serif;letter-spacing:-.06em;margin:0 0 32px}.tag{color:${accent};font-weight:700;text-transform:uppercase;font-size:12px;letter-spacing:.12em}.intro{max-width:520px;font-size:19px;line-height:1.55;margin:0 0 40px}.cta{display:inline-block;background:${accent};color:#111;padding:17px 24px;border-radius:4px;text-decoration:none;font-weight:700}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:20px 5% 64px}.card{min-height:210px;background:${isDark ? '#20252b' : '#ded5c7'};padding:22px;border-radius:4px;display:flex;align-items:end;font:600 27px Georgia,serif}@media(max-width:650px){.grid{grid-template-columns:1fr}main{padding-top:45px}}</style></head>
<body><nav><span>STUDIO NOMA</span><span class="pill">Menu</span></nav><main><p class="tag">Designed with intention</p><h1>${subject}</h1><p class="intro">A considered digital home for curious people and meaningful ideas. Simple, distinct, and made to be remembered.</p><a class="cta" href="#work">Explore our world →</a></main><section id="work" class="grid"><div class="card">01 / Story</div><div class="card">02 / Objects</div><div class="card">03 / Contact</div></section></body></html>`
}

function App() {
  const [prompt, setPrompt] = useState('A refined landing page for a sustainable skincare brand')
  const [site, setSite] = useState(() => makeSite('A refined landing page for a sustainable skincare brand'))
  const [projectName, setProjectName] = useState('flora-studio')
  const [view, setView] = useState('preview')
  const [generating, setGenerating] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState(() => localStorage.getItem('promptsite-user') || '')
  const [toast, setToast] = useState('')
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('promptsite-projects') || '[]'))

  useEffect(() => { localStorage.setItem('promptsite-projects', JSON.stringify(projects)) }, [projects])
  const code = useMemo(() => site.replace(/</g, '&lt;').replace(/>/g, '&gt;'), [site])
  const notify = (message) => { setToast(message); setTimeout(() => setToast(''), 3000) }
  const generate = () => {
    if (!prompt.trim()) return notify('Tell us what you want to create first.')
    setGenerating(true)
    setTimeout(() => {
      const next = makeSite(prompt)
      setSite(next); setProjectName(prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 28) || 'untitled-site')
      setProjects(p => [{ name: prompt.slice(0, 42), updated: 'Just now', prompt }, ...p.filter(x => x.prompt !== prompt)].slice(0, 6))
      setGenerating(false); setView('preview')
    }, 850)
  }
  const download = () => {
    const blob = new Blob([site], { type: 'text/html' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${projectName || 'promptsite'}.html`; a.click(); URL.revokeObjectURL(url)
  }
  const deploy = () => {
    download(); notify('Your site downloaded — drag it into Vercel to deploy.'); window.open('https://vercel.com/new', '_blank', 'noopener,noreferrer')
  }
  const connectGithub = () => notify('Connect GitHub in production to create a repository automatically.')
  return <div className="app">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">P</span><span>promptsite</span></div><button className="new-project" onClick={() => { setPrompt(''); setProjectName('untitled-site') }}><Plus size={17}/> New project</button><div className="side-label">Your projects</div><div className="project-list">{projects.length ? projects.map((p, i) => <button key={i} className="project" onClick={() => {setPrompt(p.prompt); setSite(makeSite(p.prompt))}}><Layers3 size={15}/><span>{p.name}</span></button>) : <p className="empty">Your creations will live here.</p>}</div><div className="side-bottom"><button className="github" onClick={connectGithub}><GitBranch size={17}/> Connect GitHub <ArrowUpRight size={14}/></button><div className="account">{user ? <><span className="avatar">{user[0].toUpperCase()}</span><span>{user}</span><button onClick={() => {localStorage.removeItem('promptsite-user');setUser('')}} aria-label="Sign out"><LogOut size={16}/></button></> : <button onClick={() => setAuthOpen(true)}><span className="avatar">?</span> Sign in</button>}</div></div></aside>
    <main className="workspace"><header><button className="mobile-menu"><Menu/></button><div className="crumb"><span>Projects</span><span>/</span><input value={projectName} onChange={e => setProjectName(e.target.value)} /></div><div className="header-actions"><button className="icon-button" onClick={download} title="Download code"><Download size={18}/></button><button className="deploy" onClick={deploy}><Rocket size={16}/> Deploy <ChevronDown size={14}/></button></div></header>
      <section className="builder"><div className="eyebrow"><Sparkles size={15}/> AI website builder</div><h1>What would you like to <em>create?</em></h1><div className="prompt-box"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => {if(e.metaKey || e.ctrlKey) if(e.key === 'Enter') generate()}} placeholder="Describe your website..."/><button className="generate" onClick={generate} disabled={generating}>{generating ? <LoaderCircle className="spin" size={19}/> : <WandSparkles size={19}/>} {generating ? 'Creating' : 'Generate'}</button></div><div className="examples">{examples.map(x => <button key={x} onClick={() => setPrompt(x)}>{x}</button>)}</div></section>
      <section className="result"><div className="result-bar"><div className="tabs"><button className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}><Globe2 size={15}/> Preview</button><button className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}><Code2 size={15}/> Code</button></div><span className="saved"><Check size={14}/> Saved</span></div><div className="canvas">{view === 'preview' ? <iframe title="Website preview" srcDoc={site}/> : <pre><code dangerouslySetInnerHTML={{__html: code}} /></pre>}</div></section>
    </main>
    {authOpen && <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}><div className="modal" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setAuthOpen(false)}><X size={19}/></button><span className="brand-mark">P</span><h2>Welcome to PromptSite</h2><p>Sign in to save projects and publish your work.</p><button className="oauth" onClick={() => notify('OAuth provider setup is ready for your production credentials.')}><GitBranch size={18}/> Continue with GitHub</button><div className="or">or continue with email</div><form onSubmit={e => {e.preventDefault(); const email = new FormData(e.currentTarget).get('email'); localStorage.setItem('promptsite-user', email); setUser(email); setAuthOpen(false); notify('You’re signed in.')}}><input name="email" required type="email" placeholder="you@example.com"/><button className="email-submit">Continue with email</button></form><small>By continuing, you agree to our Terms and Privacy Policy.</small></div></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}
createRoot(document.getElementById('root')).render(<App />)
