'use client'

/**
 * ChatWidget — a lightweight, self-contained help widget shown bottom-right on
 * every route. No third-party dependency, no API key, no network calls and no
 * cookies: it answers common prospect questions from a local knowledge base
 * via simple keyword matching, and routes anything it cannot answer to a
 * human. Prices and trial terms come from lib/brand.ts — never typed here.
 */

import * as React from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import {
  ADMIN_PRICE_EX_VAT_LABEL,
  ANNUAL_TERMS,
  DEMO_BOOKING_URL,
  DEMO_DURATION_LABEL,
  EMAIL_SALES,
  EMAIL_SUPPORT,
  ENTRY_PRICE_EX_VAT_LABEL,
  PHONE_DISPLAY,
  PHONE_HREF,
  PRICING_TIERS,
  SIGNUP_TRIAL_URL,
  VAT_SUFFIX,
  VOLUME_PRICE_LABEL,
  trialSentence,
} from '@/lib/brand'
import { trackDemoClick } from '@/components/ui/book-demo-button'

type QuickAction = { label: string; href: string }
type Message = { id: number; role: 'bot' | 'user'; text: string; actions?: QuickAction[] }

const START_TRIAL: QuickAction = { label: 'Start free trial', href: SIGNUP_TRIAL_URL }
const BOOK_DEMO: QuickAction = { label: 'Book a demo', href: DEMO_BOOKING_URL }
const CALL_US: QuickAction = { label: `Call ${PHONE_DISPLAY}`, href: PHONE_HREF }
const EMAIL_US: QuickAction = { label: 'Email sales', href: `mailto:${EMAIL_SALES}` }
const SEE_PRICING: QuickAction = { label: 'See pricing', href: '/#pricing' }
const VISIT_ACADEMY: QuickAction = { label: 'Visit the academy', href: '/academy' }

type KbEntry = { keywords: string[]; answer: string; actions?: QuickAction[] }

const KNOWLEDGE_BASE: KbEntry[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'licence', 'license', 'per user', 'plan', 'plans', 'expensive', 'fee', 'quote', 'vat'],
    answer:
      `Worker licences are ${ENTRY_PRICE_EX_VAT_LABEL} per licence per month (${VOLUME_PRICE_LABEL} ${VAT_SUFFIX} for ${PRICING_TIERS[1].threshold.toLowerCase()}, bespoke above 1,000). ` +
      `Admin licences are ${ADMIN_PRICE_EX_VAT_LABEL} per licence per month. Annual billing: ${ANNUAL_TERMS}. Every plan includes the full platform.`,
    actions: [SEE_PRICING, START_TRIAL],
  },
  {
    keywords: ['trial', 'free', 'try', 'demo', 'test', 'evaluate', 'card'],
    answer: `${trialSentence()} You can start straight away, or book a ${DEMO_DURATION_LABEL} demo and we will walk you through it on your own sites.`,
    actions: [BOOK_DEMO, START_TRIAL],
  },
  {
    keywords: ['incident report', 'report an incident', 'log an incident', 'record an incident', 'create a report', 'new report', 'submit a report'],
    answer:
      'Creating an incident report takes a few taps: open the app, follow the guided prompts, attach photos, and the location is tagged automatically. There is a short lesson showing it done in the jobsafe academy.',
    actions: [VISIT_ACADEMY, START_TRIAL],
  },
  {
    keywords: ['hsse report', 'near miss', 'near-miss', 'hazard', 'observation', 'environmental concern'],
    answer:
      'Near misses and hazards are raised as HSSE reports: pick the report type, add a photo and a short description, and the right people are notified straight away.',
    actions: [VISIT_ACADEMY, START_TRIAL],
  },
  {
    keywords: ['resolve', 'close a report', 'closing a report', 'assign', 'follow up on a report'],
    answer:
      'Supervisors review each report, forward it to the relevant department, and close it with resolution notes. The full history stays on the report.',
    actions: [VISIT_ACADEMY],
  },
  {
    keywords: ['dashboard', 'analytics', 'trends', 'admin'],
    answer:
      'The admin dashboard turns individual reports into a picture of what is happening across your sites: reports by category, weekly site breakdowns, and trends you can act on early.',
    actions: [VISIT_ACADEMY, START_TRIAL],
  },
  {
    keywords: ['mobile', 'android', 'ios', 'iphone', 'app store', 'play store', 'tablet', 'download the app'],
    answer:
      'jobsafe is available for iOS and Android. Your team reports from their phones, even with no signal, and everything syncs automatically when they are back online.',
    actions: [START_TRIAL],
  },
  {
    keywords: ['feature', 'features', 'what is', 'what does', 'capabilities', 'include', 'included', 'offer', 'do you'],
    answer:
      'jobsafe is workplace incident reporting for field and transport teams: unlimited incident reports, dashboard analytics, offline mode with GPS tagging, photo, video and voice attachments, real-time supervisor alerts, a full audit trail, and HSSE compliance tools. Every plan gets the full platform.',
    actions: [SEE_PRICING, START_TRIAL],
  },
  {
    keywords: ['offline', 'no signal', 'connection', 'connectivity', 'internet', 'sync', 'gps'],
    answer: 'Yes — jobsafe works offline. Reports are captured with GPS tagging even with no signal, then sync automatically once you are back online.',
    actions: [START_TRIAL],
  },
  {
    keywords: ['compliance', 'hsse', 'iso', '45001', 'riddor', 'audit', 'regulation', 'legal', 'standard', 'hse'],
    answer:
      'jobsafe gives you a full audit trail and captures the detail you need for RIDDOR reporting and safety reviews. Submitting to the HSE remains your decision; our free toolkit includes a RIDDOR decision flowchart.',
    actions: [START_TRIAL, EMAIL_US],
  },
  {
    keywords: ['support', 'help', 'contact', 'phone', 'call', 'email', 'reach', 'speak', 'talk', 'human'],
    answer: `You can reach us on ${PHONE_DISPLAY}, or email ${EMAIL_SUPPORT} (sales: ${EMAIL_SALES}). Every plan includes email support.`,
    actions: [CALL_US, EMAIL_US],
  },
  {
    keywords: ['enterprise', 'large', '1000', '1,000', 'big team', 'sla', 'account manager', 'dpa'],
    answer:
      'For 1,000 or more Worker licences we price bespoke: a dedicated account manager, a custom SLA, a GDPR data-processing agreement, and priority support. Book a demo and we will size a rollout around your sites.',
    actions: [BOOK_DEMO, EMAIL_US],
  },
  {
    keywords: ['data', 'security', 'gdpr', 'privacy', 'secure', 'store', 'storage', 'hosted', 'hosting'],
    answer: `Your data is hosted in UK-based AWS infrastructure and handled under UK GDPR. A data-processing agreement is available on request. Any questions, email ${EMAIL_SUPPORT}.`,
    actions: [EMAIL_US],
  },
  {
    keywords: ['industry', 'industries', 'sector', 'who', 'suitable', 'construction', 'transport', 'field service', 'care'],
    answer:
      'jobsafe is built for construction, field service, care and transport operators — any team that needs fast, reliable incident and near-miss reporting.',
    actions: [START_TRIAL, SEE_PRICING],
  },
  {
    keywords: ['start', 'sign up', 'signup', 'get started', 'begin', 'register', 'onboard', 'set up'],
    answer: `Getting started is quick: start your free trial and invite your team by email. ${trialSentence()} Prefer a walkthrough first? Book a demo and we will show you.`,
    actions: [START_TRIAL, BOOK_DEMO],
  },
  {
    keywords: ['how do i', 'how to', 'how does it work', 'tutorial', 'guide', 'learn', 'training', 'walkthrough', 'show me', 'video', 'lesson', 'academy'],
    answer:
      'The quickest way to learn jobsafe is the academy: a product film and short lessons on creating incident and HSSE reports, resolving them, and reading the admin dashboard.',
    actions: [VISIT_ACADEMY, START_TRIAL],
  },
]

const FALLBACK_ACTIONS: QuickAction[] = [BOOK_DEMO, VISIT_ACADEMY, EMAIL_US]

const SUGGESTIONS = ['How much does it cost?', 'Is there a free trial?', 'Can I book a demo?', 'How do I create a report?', 'Does it work offline?', 'How do I get support?']

const GREETING = 'Hello. I am the jobsafe assistant. Ask me about pricing, features, compliance, or how to do something in the app, or pick a question below.'

function findAnswer(query: string): { text: string; actions: QuickAction[] } {
  const q = query.toLowerCase()
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((k) => q.includes(k))) return { text: entry.answer, actions: entry.actions ?? [] }
  }
  return {
    text: `I am not certain about that one, but a human can help. Book a demo and ask us directly, or email ${EMAIL_SALES}. If you are wondering how to do something in the app, the academy probably covers it.`,
    actions: FALLBACK_ACTIONS,
  }
}

function ActionLink({ action, onNavigate }: { action: QuickAction; onNavigate: () => void }) {
  const external = action.href.startsWith('http')
  return (
    <a
      href={action.href}
      onClick={() => {
        if (action.href === DEMO_BOOKING_URL) trackDemoClick('chat-widget')
        onNavigate()
      }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex min-h-8 items-center rounded-pill border border-brand-tint-18 bg-brand-tint-04 px-3 text-xs font-bold text-brand-strong transition-colors hover:bg-brand-tint-08"
    >
      {action.label}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState<Message[]>([{ id: 0, role: 'bot', text: GREETING }])
  const nextId = React.useRef(1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const fabRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  React.useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    const reply = findAnswer(text)
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: 'user', text },
      { id: nextId.current++, role: 'bot', text: reply.text, actions: reply.actions },
    ])
    setInput('')
  }

  const closePanel = () => {
    setOpen(false)
    fabRef.current?.focus()
  }

  return (
    <div className="fixed right-4 bottom-24 z-[60] flex flex-col items-end gap-3 print:hidden sm:right-5 lg:bottom-5">
      {open ? (
        <div
          role="dialog"
          aria-label="jobsafe assistant"
          className="flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-frame border border-line-1 bg-canvas shadow-frame sm:w-[380px]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line-1 bg-bg px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-pill bg-brand-strong text-canvas">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-ink-1">jobsafe assistant</p>
                <p className="text-[11px] text-ink-5">Answers from the site, no waiting</p>
              </div>
            </div>
            <button type="button" onClick={closePanel} aria-label="Close chat" className="flex size-9 items-center justify-center rounded-control text-ink-4 transition-colors hover:bg-line-3 hover:text-ink-1">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user' ? 'max-w-[85%] rounded-frame rounded-br-[2px] bg-ink-1 px-3.5 py-2.5 text-sm text-canvas' : 'max-w-[90%] rounded-frame rounded-bl-[2px] border border-line-1 bg-bg px-3.5 py-2.5 text-sm text-ink-2'}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.actions && m.actions.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <ActionLink key={a.label} action={a} onNavigate={closePanel} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="min-h-8 rounded-pill border border-line-1 bg-canvas px-3 text-xs font-semibold text-ink-3 transition-colors hover:border-grey-400 hover:text-ink-1">
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-line-1 bg-canvas px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Type your question"
              className="min-h-11 min-w-0 flex-1 rounded-control border border-line-1 bg-canvas px-4 text-sm text-ink-1 placeholder:text-ink-5 focus:border-brand focus:outline-none"
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim()} className="flex size-11 shrink-0 items-center justify-center rounded-control bg-brand-strong text-canvas transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat and ask a question'}
        className="flex size-14 items-center justify-center rounded-pill bg-brand-strong text-canvas shadow-hover transition-colors hover:bg-brand-dark"
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
      </button>
    </div>
  )
}

export default ChatWidget
