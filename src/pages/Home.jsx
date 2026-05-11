import { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone, Star, CheckCircle, Wrench, Droplets, Flame, AlertTriangle, Mail, MapPin, Clock, Send, Loader2, ArrowRight, Zap } from 'lucide-react'
import { saveLead } from '../utils/storage'
import { sendConfirmationEmail, sendOwnerNotification } from '../utils/email'

const SERVICES = [
  { icon: Wrench,       title: 'Plumbing Repair',      desc: 'Leaky pipes, broken fixtures, running toilets, low water pressure — we diagnose and fix all residential plumbing problems fast.' },
  { icon: Droplets,     title: 'Drain Cleaning',        desc: 'Clogged drains cleared with hydro-jetting and professional snaking. Kitchen, bathroom, main sewer line — we handle it all.' },
  { icon: Flame,        title: 'Water Heater Service',  desc: 'Water heater repair, replacement, and installation. Tank and tankless units. Same-day service available for cold water emergencies.' },
  { icon: AlertTriangle,title: 'Emergency Plumbing',    desc: '24/7 emergency response for burst pipes, sewage backups, major leaks, and flooding. We\'re on call when you need us most.' },
]

const REVIEWS = [
  { name: 'Sandra K.',  loc: 'Henderson',  stars: 5, text: "Burst pipe at 11pm on a Sunday. FlowRight was at my house within 45 minutes. Had everything fixed by 1am. Saved my floors from major water damage. Absolute heroes." },
  { name: 'Mike P.',    loc: 'Summerlin',  stars: 5, text: "Had them replace our water heater. Gave us a straight quote, showed up on time, cleaned up after themselves. No games, no surprise fees. Will use them for everything going forward." },
  { name: 'Vanessa L.', loc: 'Las Vegas',  stars: 5, text: "Our kitchen drain was completely blocked and another company wanted to charge triple. FlowRight came out same day and cleared it in under an hour for a very fair price." },
]

const TIME_SLOTS = ['Any Time (Emergency)','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'', preferredDate:'', preferredTime:'', notes:'' })
  const [status, setStatus] = useState('idle')

  const statsRef     = useRef(null)
  const statsStarted = useRef(false)
  const [statVals, setStatVals] = useState({ years: 0 })

  useEffect(() => {
    const revealObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el))

    const statsObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsStarted.current) {
        statsStarted.current = true
        const steps = 80; let i = 0
        const t = setInterval(() => {
          i++
          const p = 1 - Math.pow(1 - i / steps, 3)
          setStatVals({ years: Math.round(20 * p) })
          if (i >= steps) clearInterval(t)
        }, 1800 / steps)
      }
    }, { threshold: 0.3 })
    if (statsRef.current) statsObs.observe(statsRef.current)

    return () => { revealObs.disconnect(); statsObs.disconnect() }
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }
  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }
  async function handleSubmit(e) {
    e.preventDefault(); setStatus('loading')
    try {
      saveLead(form)
      await Promise.all([sendConfirmationEmail(form), sendOwnerNotification(form)])
      setStatus('success')
      setForm({ name:'', phone:'', email:'', service:'', preferredDate:'', preferredTime:'', notes:'' })
    } catch { setStatus('error') }
  }

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/95 backdrop-blur-md shadow-lg anim-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-brand-navy anim-float" />
              </div>
              <span className="text-white font-bold font-display text-lg">Flow<span className="text-brand-gold">Right</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['services','about','reviews','booking'].map(s => (
                <button key={s} onClick={() => scrollTo(s)} className="text-gray-300 hover:text-white capitalize text-sm font-medium transition-colors">
                  {s === 'booking' ? 'Contact' : s}
                </button>
              ))}
              <a href="tel:+17025550563" className="flex items-center gap-2 bg-brand-gold text-brand-navy font-bold text-sm px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                <Zap className="w-4 h-4" /> 24/7 Emergency
              </a>
            </div>
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden text-white p-2">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-brand-navy border-t border-white/10 px-4 py-4 space-y-3">
            {['services','about','reviews','booking'].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="block w-full text-left text-gray-300 hover:text-white capitalize py-2 text-sm font-medium">
                {s === 'booking' ? 'Contact' : s}
              </button>
            ))}
            <a href="tel:+17025550563" className="btn-primary w-full justify-center mt-2 text-sm">24/7 Emergency Call</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="bg-brand-navy pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #FFC300 1px, transparent 1px), linear-gradient(-45deg, #FFC300 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold text-sm font-bold px-4 py-2 rounded-full mb-6 border border-brand-gold/40 anim-fade-in delay-1">
            <Zap className="w-4 h-4 anim-float" /> 24/7 Emergency Plumbing Available
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight anim-fade-up delay-2">
            Vegas's Most Reliable<br /><span className="text-brand-gold">Plumbers On Call</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 anim-fade-up delay-3">
            Emergency repairs, drain cleaning, water heaters, and more. Licensed Las Vegas plumbers with upfront pricing and a satisfaction guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 anim-fade-up delay-4">
            <a href="tel:+17025550563" className="btn-primary text-base px-8 py-4">
              <Phone className="w-5 h-5" /> Call Now — (702) 555-0563
            </a>
            <button onClick={() => scrollTo('booking')} className="btn-outline text-base px-8 py-4">
              Schedule Service <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div ref={statsRef} className="grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md anim-fade-up delay-5">
            {[
              ['24/7', 'Emergency Service'],
              [`${statVals.years}+`, 'Years Experience'],
              ['$0', 'Dispatch Fees'],
            ].map(([n,l]) => (
              <div key={l} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <p className="text-brand-gold font-bold font-display text-2xl">{n}</p>
                <p className="text-gray-300 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <p className="section-label mb-3">Our Services</p>
            <h2 className="font-display text-4xl font-bold text-brand-navy">Complete Plumbing Solutions</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">From routine repairs to urgent emergencies, we handle every plumbing need in Las Vegas.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card group cursor-pointer reveal hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-navy/15 hover:border-brand-gold/40"
                style={{ transitionDelay: `${i * 0.12}s` }}
                onClick={() => { setForm(f => ({ ...f, service: title })); scrollTo('booking') }}
              >
                <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-navy transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand-navy group-hover:text-brand-gold transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-brand-navy text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <p className="mt-4 text-brand-gold text-sm font-semibold flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Book Now <ArrowRight className="w-3.5 h-3.5" />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <p className="section-label mb-3">Why FlowRight</p>
              <h2 className="font-display text-4xl font-bold text-brand-navy mb-6">Las Vegas Plumbers You Can Trust</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                FlowRight Plumbing has been serving Las Vegas and Henderson homeowners since 2004. We're state-licensed, background-checked, and committed to upfront pricing with no surprise charges.
              </p>
              <ul className="space-y-3">
                {['Nevada Master Plumber licensed & insured','Upfront flat-rate pricing — no hourly surprises','Background-checked technicians on every job','Same-day service for non-emergency repairs','1-year parts and labor warranty on all work'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Upfront Pricing', desc: 'We quote before we start — the price we give you is the price you pay, period' },
                { label: '24/7 Emergency',  desc: 'Burst pipe at 3am? We answer the phone and dispatch immediately, every time' },
                { label: 'Master Licensed', desc: 'Nevada Master Plumber license #PL-047831 — full residential and commercial capability' },
                { label: '1-Year Warranty', desc: 'Every repair and installation is backed by a full 1-year parts and labor warranty' },
              ].map((f, i) => (
                <div key={f.label} className="bg-brand-navy rounded-2xl p-5 text-white reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <h4 className="font-display font-bold text-brand-gold mb-2">{f.label}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <p className="section-label mb-3">Customer Reviews</p>
            <h2 className="font-display text-4xl font-bold text-brand-navy">What Las Vegas Homeowners Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={r.name} className="card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-navy/10 rounded-full flex items-center justify-center">
                    <span className="text-brand-navy font-bold text-sm">{r.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.loc}, NV</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 text-white reveal">
              <p className="section-label mb-3">Book a Plumber</p>
              <h2 className="font-display text-4xl font-bold mb-6">Schedule Service or Get Emergency Help</h2>
              <p className="text-gray-300 leading-relaxed mb-10">Fill out the form for scheduled service, or call us now for immediate 24/7 emergency response.</p>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Call / Text',  val: '(702) 555-0563' },
                  { icon: Mail,  label: 'Email Us',     val: 'demo@flowrightplumbing.com' },
                  { icon: MapPin,label: 'Service Area', val: 'Las Vegas, Henderson & Valley' },
                  { icon: Clock, label: 'Availability', val: '24/7 — Including Holidays' },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-gold/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-white font-medium">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-5">
                <p className="text-brand-gold font-bold text-sm mb-1">🚨 Plumbing Emergency?</p>
                <p className="text-gray-300 text-sm">Don't wait — call us directly at <strong className="text-white">(702) 555-0563</strong> for immediate dispatch.</p>
              </div>
            </div>
            <div className="lg:col-span-3 reveal" style={{ transitionDelay: '0.18s' }}>
              {status === 'success' ? (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-brand-navy mb-2">Request Received!</h3>
                  <p className="text-gray-500 mb-6">We'll call to confirm your appointment within 30 minutes. For emergencies, call us directly.</p>
                  <button onClick={() => setStatus('idle')} className="btn-primary">Submit Another Request</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="John Smith" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="input-field" placeholder="(702) 000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Needed *</label>
                    <select name="service" value={form.service} onChange={handleChange} required className="input-field">
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
                      <input name="preferredDate" type="date" value={form.preferredDate} onChange={handleChange} className="input-field" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
                      <select name="preferredTime" value={form.preferredTime} onChange={handleChange} className="input-field">
                        <option value="">Select time...</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the Issue</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="What's happening? Where is the problem located in your home?" />
                  </div>
                  {status === 'error' && <p className="text-red-600 text-sm">Something went wrong. For immediate help call (702) 555-0563.</p>}
                  <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-70">
                    {status === 'loading' ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> Schedule Service</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-navy border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-brand-navy" />
                </div>
                <span className="text-white font-bold font-display">FlowRight Plumbing</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Las Vegas's trusted plumbers since 2004. Licensed, insured, and available 24/7.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {SERVICES.map(s => <li key={s.title}><button onClick={() => scrollTo('services')} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{s.title}</button></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-gold" /> (702) 555-0563</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-gold" /> demo@flowrightplumbing.com</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-gold" /> 24/7 — Always Available</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FlowRight Plumbing. All rights reserved. NV License #PL-047831
          </div>
        </div>
      </footer>
    </div>
  )
}
