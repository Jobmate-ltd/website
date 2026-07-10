'use client'

/**
 * ChatWidget — a lightweight, self-contained help widget shown bottom-right on
 * every route. No third-party dependency, no API key, no network calls: it
 * answers common prospect questions from a local knowledge base via simple
 * keyword matching, and routes anything it can't answer to a human (call/email)
 * or a free trial. Designed to be swapped for a hosted chat (Crisp/Intercom) or
 * an LLM-backed endpoint later without touching the rest of the site.
 */

import { useEffect, useRef, useState } from 'react'
import { SIGNUP_TRIAL_URL } from '@/lib/links'
import { EMAIL_SALES as SALES_EMAIL_ADDRESS, ENTRY_PRICE_LABEL, PHONE_DISPLAY, TRIAL, VOLUME_PRICE_LABEL } from '@/lib/brand'

type QuickAction = { label: string; href: string }
type Message = { id: number; role: 'bot' | 'user'; text: string; actions?: QuickAction[] }

const PHONE_LABEL = PHONE_DISPLAY
const PHONE_HREF = 'tel:03338000883'
const SALES_HREF = `mailto:${SALES_EMAIL_ADDRESS}`

const START_TRIAL: QuickAction = { label: 'Start free trial', href: SIGNUP_TRIAL_URL }
const CALL_US: QuickAction = { label: `Call ${PHONE_LABEL}`, href: PHONE_HREF }
const EMAIL_SALES: QuickAction = { label: 'Email sales', href: SALES_HREF }
const SEE_PRICING: QuickAction = { label: 'See pricing', href: '/#pricing' }

type KbEntry = { keywords: string[]; answer: string; actions?: QuickAction[] }

// Answers are curated from real site facts. Prices come from `lib/brand.ts`,
// which is the single source of truth — never hard-code a figure here.
const KNOWLEDGE_BASE: KbEntry[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'how much', 'licence', 'license', 'per user', 'plan', 'plans', 'expensive', 'fee', 'quote'],
    answer:
      `Licences are ${ENTRY_PRICE_LABEL} per licence per month for teams up to 500 users, ${VOLUME_PRICE_LABEL} for 500–1,000, and bespoke above that — just get in touch. Every plan includes the full platform.`,
    actions: [SEE_PRICING, START_TRIAL],
  },
  {
    keywords: ['trial', 'free', 'try', 'demo', 'test', 'evaluate', 'card'],
    answer:
      `Every plan comes with a ${TRIAL.days}-day free trial${TRIAL.cardRequired ? '' : ', and no credit card is required'}. You can start straight away, or book a quick demo with our team.`,
    actions: [START_TRIAL, CALL_US],
  },
  {
    keywords: ['feature', 'features', 'what is', 'what does', 'capabilities', 'include', 'included', 'offer', 'do you'],
    answer:
      'jobsafe is workplace incident reporting for field and transport teams: unlimited incident reports, dashboard analytics, offline mode with GPS tagging, photo, video and voice attachments, real-time supervisor alerts, a full audit trail, and HSSE compliance tools. Every plan gets the full platform.',
    actions: [SEE_PRICING, START_TRIAL],
  },
  {
    keywords: ['offline', 'no signal', 'connection', 'connectivity', 'internet', 'sync', 'gps'],
    answer:
      'Yes — jobsafe works offline. Reports are captured with GPS tagging even with no signal, then sync automatically once you are back online.',
    actions: [START_TRIAL],
  },
  {
    keywords: ['compliance', 'hsse', 'iso', '45001', 'riddor', 'audit', 'regulation', 'legal', 'standard', 'hse'],
    answer:
      'jobsafe is HSSE-compliant and ISO 45001-aligned, with a full audit trail. It captures the detail you need for RIDDOR reporting and safety reviews.',
    actions: [START_TRIAL, EMAIL_SALES],
  },
  {
    keywords: ['support', 'help', 'contact', 'phone', 'call', 'email', 'reach', 'speak', 'talk', 'human'],
    answer:
      `You can reach us on ${PHONE_LABEL}, or email support@jobsafe.cloud (sales: sales@jobsafe.cloud). Every plan includes email support.`,
    actions: [CALL_US, EMAIL_SALES],
  },
  {
    keywords: ['enterprise', 'large', '1000', '1,000', 'big team', 'sla', 'account manager', 'dpa'],
    answer:
      'For 1,000+ users we offer Enterprise: a dedicated account manager, a custom SLA, a GDPR data-processing agreement, and priority support. Tell us about your team and we will tailor it to you.',
    actions: [EMAIL_SALES, CALL_US],
  },
  {
    keywords: ['data', 'security', 'gdpr', 'privacy', 'secure', 'store', 'storage'],
    answer:
      'Your data is handled under UK GDPR. Enterprise plans include a GDPR data-processing agreement and SLA guarantees. Any questions, email support@jobsafe.cloud.',
    actions: [EMAIL_SALES],
  },
  {
    keywords: ['industry', 'industries', 'sector', 'who', 'suitable', 'construction', 'transport', 'field service'],
    answer:
      'jobsafe is built for construction, field service, and transport operators — any team that needs fast, reliable incident and near-miss reporting.',
    actions: [START_TRIAL, SEE_PRICING],
  },
  {
    keywords: ['start', 'sign up', 'signup', 'get started', 'begin', 'register', 'onboard', 'set up'],
    answer:
      'Getting started is quick — start your free trial (no card required) and you can be reporting in minutes. Prefer a walkthrough? Give us a call.',
    actions: [START_TRIAL, CALL_US],
  },
]

const FALLBACK_ACTIONS: QuickAction[] = [CALL_US, EMAIL_SALES, START_TRIAL]

const SUGGESTIONS = [
  'How much does it cost?',
  'Is there a free trial?',
  'Does it work offline?',
  'What features are included?',
  'How do I get support?',
]

const GREETING =
  "Hi 👋 I'm the jobsafe assistant. Ask me about pricing, features, offline mode, compliance, or getting started — or pick a question below."

function findAnswer(query: string): { text: string; actions: QuickAction[] } {
  const q = query.toLowerCase()
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((k) => q.includes(k))) {
      return { text: entry.answer, actions: entry.actions ?? [] }
    }
  }
  return {
    text:
      "I'm not certain about that one — but a human can help. Give us a call, email sales@jobsafe.cloud, or start a free trial to explore jobsafe yourself.",
    actions: FALLBACK_ACTIONS,
  }
}

const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

function ActionLink({ action, onNavigate }: { action: QuickAction; onNavigate: () => void }) {
  const external = action.href.startsWith('http')
  return (
    <a
      href={action.href}
      onClick={onNavigate}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand/20"
    >
      {action.label}
    </a>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: 'bot', text: GREETING }])
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  // Focus the input on open; close on Escape and return focus to the trigger.
  useEffect(() => {
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
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label="jobsafe assistant"
          className="flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] sm:w-[380px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-surface-0 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                <ChatIcon />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">jobsafe assistant</p>
                <p className="text-[11px] text-white/50">Typically answers in seconds</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-3.5 py-2.5 text-sm text-white'
                      : 'max-w-[90%] rounded-2xl rounded-bl-sm bg-white/5 px-3.5 py-2.5 text-sm text-white/85'
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <ActionLink key={a.label} action={a} onNavigate={closePanel} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Suggested questions — shown until the visitor asks something. */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-surface-0 px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Type your question"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-brand/50 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition active:scale-[0.97] hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* Floating trigger */}
      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat — ask a question'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_30px_rgb(var(--brand-rgb)_/_0.35)] transition active:scale-[0.97] hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  )
}
