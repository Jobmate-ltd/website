// ─────────────────────────────────────────────────────────────────────────────
// jobsafe academy — lesson data. SINGLE SOURCE OF TRUTH for /academy.
//
// Each lesson renders as a chapter on the academy page. `video.src` is null
// until the screen recording is produced; the page shows a composed
// "recording in production" state and switches to a real player the moment a
// src is set here. Nothing else needs to change to take a lesson live.
//
// A lesson can be backed either way:
//   * YouTube — set `video.youtubeId`. Preferred for anything already uploaded
//     to the jobmate channel; the page renders a click-to-play facade, so
//     nothing loads from youtube.com until the viewer presses play.
//   * Self-hosted — set `video.src`. MP4 (H.264), 16:9, silent, under ~60
//     seconds, dropped into /public/videos/academy/ and referenced as
//     '/videos/academy/<slug>.mp4'.
// ─────────────────────────────────────────────────────────────────────────────

export interface LessonStep {
  title: string
  detail: string
}

export interface LessonVideo {
  /** Path under /public, e.g. '/videos/academy/create-an-incident-report.mp4'. Null = not recorded yet. */
  src: string | null
  /** YouTube id, e.g. 'EWk11JQAjqA'. Takes precedence over `src` when both are set. */
  youtubeId?: string
  /** Optional poster frame shown before playback. */
  poster?: string
  /** Accessible description of what the recording shows. */
  caption: string
}

export interface AcademyLesson {
  slug: string
  number: string
  /** Full editorial title, used as the lesson heading. */
  title: string
  /** Short label for the chapter rail and anchors. */
  short: string
  /** One-line promise under the heading. */
  promise: string
  steps: readonly LessonStep[]
  video: LessonVideo
}

export interface FeaturedVideo {
  /** Small label above the heading. */
  eyebrow: string
  title: string
  /** One-line promise under the heading. */
  promise: string
  video: LessonVideo
  /** ISO-8601 publication date, for VideoObject structured data. */
  uploadDate: string
  /** ISO-8601 duration, e.g. 'PT1M51S'. */
  duration: string
  /** Longer description, used for structured data rather than on the page. */
  description: string
}

/**
 * The film that opens the academy. It is a product film rather than a how-to,
 * so it sits above the chapters instead of pretending to be one of them. To
 * retire it, delete this export and the <Featured /> block in app/academy/page.tsx;
 * to turn it into a lesson, move `video` onto the relevant entry in LESSONS.
 */
export const FEATURED_VIDEO: FeaturedVideo = {
  eyebrow: 'Start here',
  title: 'jobsafe on a window installation',
  promise:
    'The whole product on one real job: what a fitter sees on site, and what the office sees back at the desk.',
  video: {
    src: null,
    youtubeId: 'EWk11JQAjqA',
    caption:
      'Product film: jobsafe used across a window installation, from capture on site through to review in the office.',
  },
  uploadDate: '2026-08-25',
  duration: 'PT1M51S',
  description:
    'A short product film showing jobsafe on a window installation job: capturing HSSE and general incidents on site from a phone, and reviewing them from the desktop dashboard.',
}

export const LESSONS: readonly AcademyLesson[] = [
  {
    slug: 'create-an-incident-report',
    number: '01',
    title: 'How to create an incident report',
    short: 'Incident reports',
    promise:
      'From something happening on site to a logged, time-stamped report your supervisor has already seen.',
    steps: [
      {
        title: 'Start a report',
        detail:
          'One tap from the home screen. Works offline, and syncs the moment signal returns.',
      },
      {
        title: 'Follow the prompts',
        detail:
          'Describe what happened and attach photos. Location is tagged automatically.',
      },
      {
        title: 'Submit',
        detail:
          'The report reaches your supervisor instantly, alerted and ready to review.',
      },
    ],
    video: {
      src: null,
      caption:
        'Screen recording: creating an incident report in the jobsafe app, from home screen to submission.',
    },
  },
  {
    slug: 'create-a-hsse-report',
    number: '02',
    title: 'How to create a HSSE report',
    short: 'HSSE reports',
    promise:
      'Raise hazards, near misses and environmental concerns before they become incidents.',
    steps: [
      {
        title: 'Pick the report type',
        detail:
          'Health, safety, security or environment. The app asks only for what that type needs.',
      },
      {
        title: 'Add the evidence',
        detail:
          'A short description and a photo are usually enough. No paperwork, no forms to chase.',
      },
      {
        title: 'Send it for review',
        detail:
          'The right people are notified straight away, while the hazard is still just a hazard.',
      },
    ],
    video: {
      src: null,
      caption:
        'Screen recording: raising a HSSE report in the jobsafe app, from report type to submission.',
    },
  },
  {
    slug: 'resolve-a-report',
    number: '03',
    title: 'How to resolve a report',
    short: 'Resolving reports',
    promise:
      'Take a live report from open to closed, with every action recorded along the way.',
    steps: [
      {
        title: 'Review the detail',
        detail:
          'Photos, location and description arrive together, so you can verify without a site visit.',
      },
      {
        title: 'Assign and act',
        detail:
          'Forward it to the relevant department. Automated reminders keep it from going quiet.',
      },
      {
        title: 'Close it out',
        detail:
          'Record the resolution and the reporter is updated. The full history stays on the report.',
      },
    ],
    video: {
      src: null,
      caption:
        'Screen recording: resolving a report in jobsafe, from review through assignment to closure.',
    },
  },
  {
    slug: 'explore-the-admin-dashboard',
    number: '04',
    title: 'Exploring the admin dashboard',
    short: 'Admin dashboard',
    promise:
      'Where individual reports become a picture of what is actually happening across your sites.',
    steps: [
      {
        title: 'Reports by category',
        detail:
          'See what your teams are reporting most, across every site, at a glance.',
      },
      {
        title: 'Drill into a site',
        detail:
          'Weekly breakdowns per site and depot show exactly where attention is needed.',
      },
      {
        title: 'Spot the trend early',
        detail:
          'Patterns surface before they become incidents, so you can act first.',
      },
    ],
    video: {
      src: null,
      caption:
        'Screen recording: a tour of the jobsafe admin dashboard, categories, site breakdowns and trends.',
    },
  },
] as const
