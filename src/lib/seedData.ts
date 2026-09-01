import type { Topic, Category, Course, Tag, TopicTag, RecallSession, Settings } from '../types'
import { generateRecallSessions, getTodayDateString, addDaysToDateString } from '../services/spacedRecall'

export const SEED_COURSES: Course[] = [
  {
    id: 'course-db-eng',
    title: 'Production Database Engineering',
    description: 'Mastering storage engines, indexing strategies, query planners, and high-availability setups.',
    color: '#3b82f6',
    icon: 'Database',
    status: 'active',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'course-sys-arch',
    title: 'Distributed Systems & Web Architecture',
    description: 'Foundational distributed consensus, realtime streaming protocols, and resilient microservice architectures.',
    color: '#8b5cf6',
    icon: 'Layers',
    status: 'active',
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
]

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-db', name: 'Databases', color: '#3b82f6', order: 1, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
  { id: 'cat-fe', name: 'Frontend', color: '#10b981', order: 2, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
  { id: 'cat-ds', name: 'Distributed Systems', color: '#8b5cf6', order: 3, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
  { id: 'cat-arch', name: 'Web Architecture', color: '#f59e0b', order: 4, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z' },
]

export const SEED_TAGS: Tag[] = [
  { id: 'tag-postgres', name: 'PostgreSQL' },
  { id: 'tag-react', name: 'React' },
  { id: 'tag-raft', name: 'Consensus' },
  { id: 'tag-realtime', name: 'Realtime' },
  { id: 'tag-perf', name: 'Performance' },
]

export const DEFAULT_SETTINGS: Settings = {
  recallIntervals: [0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365],
  notificationEnabled: false,
  notificationTime: '10:00',
  notificationFrequency: 'daily',
  remindOverdue: true,
  remindDueToday: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  theme: 'system',
  weekStartDay: 1,
}

export function generateSeedData(): {
  courses: Course[]
  topics: Topic[]
  categories: Category[]
  tags: Tag[]
  topicTags: TopicTag[]
  sessions: RecallSession[]
  settings: Settings
} {
  const today = getTodayDateString()

  // Topic 1: Learned 9 days ago (Day 9 recall is due today!)
  const topic1Learned = addDaysToDateString(today, -9)
  const topic1Id = 'seed-topic-1'
  const topic1: Topic = {
    id: topic1Id,
    courseId: 'course-db-eng',
    orderIndex: 0,
    title: 'PostgreSQL Index Types (B-Tree, GIN, BRIN) & EXPLAIN ANALYZE',
    description: 'Deep dive into when to pick B-Tree vs GIN for JSONB and how to interpret execution plans.',
    notes: 'B-Tree is default for scalar comparisons. GIN is inverted index best for array and JSONB containment (@>). BRIN is for physically sorted append-only time series.',
    markdownNotes: `### 📌 Quick Recall Summary

**1. B-Tree (Balanced Tree)**
- Default index in Postgres.
- Best for equality and range queries (\`=\`, \`<\`, \`>\`, \`BETWEEN\`).
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
\`\`\`

**2. GIN (Generalized Inverted Index)**
- Indexes items that contain sub-elements (arrays, JSONB documents, full-text search).
\`\`\`sql
CREATE INDEX idx_events_payload ON events USING gin(payload jsonb_path_ops);
-- Fast querying with containment:
SELECT * FROM events WHERE payload @> '{"status": "completed"}';
\`\`\`

**3. BRIN (Block Range Index)**
- Stores summary min/max ranges per physical disk block (typically 128 pages).
- Takes **99% less disk space** than B-Tree for append-only timestamp or auto-incrementing ID columns.
\`\`\`sql
CREATE INDEX idx_logs_created_at ON server_logs USING brin(created_at);
\`\`\`

---
> 💡 **EXPLAIN ANALYZE Tip**: \`Index Scan\` reads heap pages individually; \`Index Only Scan\` fetches directly from the index without touching disk tables!`,
    learnedAt: topic1Learned,
    categoryId: 'cat-db',
    difficulty: 'hard',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q1-1', question: 'When is a BRIN index dramatically better than B-Tree in Postgres?', answer: 'For huge append-only tables where data is naturally clustered on disk by that column (e.g. created_at timestamps), BRIN uses virtually zero disk space.', correctCount: 2, incorrectCount: 0 },
      { id: 'q1-2', question: 'What operator requires a GIN index when querying JSONB columns?', answer: 'The containment operator (@>) or key existence operators (? , ?| , ?&).', correctCount: 1, incorrectCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  // Topic 2: Learned 4 days ago (Day 3 recall was yesterday -> Overdue!)
  const topic2Learned = addDaysToDateString(today, -4)
  const topic2Id = 'seed-topic-2'
  const topic2: Topic = {
    id: topic2Id,
    courseId: null,
    orderIndex: 0,
    title: 'React 19 Server Components (RSC) Architecture & Actions',
    description: 'Server vs Client component execution boundaries, async transitions, and server actions.',
    notes: 'Server components execute only on server with zero bundle footprint. Client components execute on client with "use client" directive.',
    markdownNotes: `### ⚛️ React 19 RSC Fundamentals

- **Server Components**: Run exclusively during build or per-request on the server. Never shipped to client bundle.
- **Client Components**: Declared with \`'use client'\` directive at top of file. Enable state (\`useState\`), effects, and browser event listeners.
- **Server Actions**: Asynchronous functions executed on the server, invokable from form submissions or client buttons.

\`\`\`tsx
// Server Action example
async function updateProfile(formData: FormData) {
  'use server'
  const name = formData.get('name')
  await db.user.update({ name })
}
\`\`\``,
    learnedAt: topic2Learned,
    categoryId: 'cat-fe',
    difficulty: 'medium',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q2-1', question: 'Can Server Components import and render Client Components in React 19?', answer: 'Yes! Server Components can freely import and render Client Components, passing serializable props.', correctCount: 1, incorrectCount: 0 },
      { id: 'q2-2', question: 'Do React Server Components ship their dependency JS code to browser bundles?', answer: 'No, RSC dependencies remain strictly on the server, resulting in 0kb client bundle cost.', correctCount: 0, incorrectCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  // Topic 3: Learned today (Day 0 recall is due today!)
  const topic3Learned = today
  const topic3Id = 'seed-topic-3'
  const topic3: Topic = {
    id: topic3Id,
    courseId: 'course-sys-arch',
    orderIndex: 0,
    title: 'Raft Consensus Algorithm: Leader Election & Log Replication',
    description: 'Decomposed consensus protocol understanding terms, heartbeat timeouts, and split votes.',
    notes: 'Raft divides state into Follower, Candidate, Leader. Uses randomized election timeouts (150-300ms) to prevent split votes.',
    markdownNotes: `### 🌐 Raft Consensus Overview

Raft achieves consensus by electing a distinguished leader, then giving the leader complete responsibility for managing the replicated log.

#### Three States:
1. **Follower**: Passive, responds to incoming RPCs from leaders and candidates.
2. **Candidate**: State entered when election timeout expires without heartbeats.
3. **Leader**: Handles client requests, manages log replication to quorum.

\`\`\`
[Follower] --(timeout)--> [Candidate] --(majority vote)--> [Leader]
    ^                         |                                 |
    |----(higher term seen)---|---------------------------------|
\`\`\`

> 🔑 **Randomized Election Timeouts (150–300ms)** ensure split votes are rare and resolved quickly!`,
    learnedAt: topic3Learned,
    categoryId: 'cat-ds',
    difficulty: 'hard',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q3-1', question: 'How does Raft solve split-vote situations where multiple candidates get equal votes?', answer: 'By using randomized election timeouts (e.g. 150ms-300ms), ensuring one candidate usually times out and begins election first.', correctCount: 0, incorrectCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  // Topic 4: Learned 2 days ago (Day 1 completed, Day 3 due tomorrow)
  const topic4Learned = addDaysToDateString(today, -2)
  const topic4Id = 'seed-topic-4'
  const topic4: Topic = {
    id: topic4Id,
    courseId: 'course-sys-arch',
    orderIndex: 1,
    title: 'WebSockets vs Server-Sent Events (SSE) vs Long Polling',
    description: 'Protocol trade-offs for bidirectional vs unidirectional realtime architectures.',
    notes: 'SSE is HTTP/2 multiplexed, unidirectional server-to-client with auto-reconnect. WebSockets is full-duplex TCP.',
    markdownNotes: `### ⚡ Realtime Protocol Comparison

| Feature | Server-Sent Events (SSE) | WebSockets | HTTP Long Polling |
| :--- | :--- | :--- | :--- |
| **Direction** | Unidirectional (Server → Client) | Full Duplex (Bidirectional) | Pseudo-Bidirectional |
| **Protocol** | Standard HTTP/1.1 or HTTP/2 | WS / WSS (TCP Upgrade) | Standard HTTP |
| **Auto-Reconnect** | Built-in by browser | Manual implementation | Handled in loop |
| **Firewall Friendly** | Extremely (Port 80/443) | Can be blocked by proxies | Yes |
| **Best For** | AI streaming, stock tickers, feeds | Multiplayer games, chat | Legacy fallbacks |`,
    learnedAt: topic4Learned,
    categoryId: 'cat-arch',
    difficulty: 'easy',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q4-1', question: 'Which protocol has native automatic reconnection and event IDs built-in: WebSockets or SSE?', answer: 'Server-Sent Events (SSE) natively supports Last-Event-ID and automatic browser reconnection.', correctCount: 1, incorrectCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  const topics = [topic1, topic2, topic3, topic4]

  // Generate sessions for each topic
  let allSessions: RecallSession[] = []
  topics.forEach((t) => {
    const sessions = generateRecallSessions(t.id, t.learnedAt, DEFAULT_SETTINGS.recallIntervals, today)
    allSessions = allSessions.concat(sessions)
  })

  // Mark historical completed sessions
  // For topic 1: Day 0, Day 1, Day 3 completed in the past
  allSessions = allSessions.map((s) => {
    if (s.topicId === topic1Id && [0, 1, 3].includes(s.intervalDays)) {
      return { ...s, status: 'completed' as const, completedAt: new Date().toISOString() }
    }
    if (s.topicId === topic2Id && [0, 1].includes(s.intervalDays)) {
      return { ...s, status: 'completed' as const, completedAt: new Date().toISOString() }
    }
    if (s.topicId === topic4Id && s.intervalDays === 0) {
      return { ...s, status: 'completed' as const, completedAt: new Date().toISOString() }
    }
    return s
  })

  const topicTags: TopicTag[] = [
    { topicId: topic1Id, tagId: 'tag-postgres' },
    { topicId: topic1Id, tagId: 'tag-perf' },
    { topicId: topic2Id, tagId: 'tag-react' },
    { topicId: topic3Id, tagId: 'tag-raft' },
    { topicId: topic4Id, tagId: 'tag-realtime' },
  ]

  return {
    courses: SEED_COURSES,
    topics,
    categories: SEED_CATEGORIES,
    tags: SEED_TAGS,
    topicTags,
    sessions: allSessions,
    settings: DEFAULT_SETTINGS,
  }
}