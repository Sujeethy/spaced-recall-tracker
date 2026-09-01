import type { Topic, Category, Tag, TopicTag, RecallSession, Settings } from '../types'
import { generateRecallSessions, getTodayDateString, addDaysToDateString } from '../services/spacedRecall'

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
    title: 'PostgreSQL Index Types (B-Tree, GIN, BRIN) & EXPLAIN ANALYZE',
    description: 'Deep dive into when to pick B-Tree vs GIN for JSONB and how to interpret execution plans.',
    notes: 'B-Tree is default for scalar comparisons. GIN is inverted index best for array and JSONB containment (@>). BRIN is for physically sorted append-only time series.',
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

  // Topic 2: Learned 3 days ago (Day 3 recall is due today!)
  const topic2Learned = addDaysToDateString(today, -3)
  const topic2Id = 'seed-topic-2'
  const topic2: Topic = {
    id: topic2Id,
    title: 'React 19 Server Components & Actions Architecture',
    description: 'How RSC payload streaming works and how Server Actions serialize forms without client JS.',
    notes: 'RSCs render exclusively on the server to a JSON-like stream graph. Client Components are leaves with interactivity. useActionState manages pending states.',
    learnedAt: topic2Learned,
    categoryId: 'cat-fe',
    difficulty: 'medium',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q2-1', question: 'Do React Server Components ship their dependency bundle to the client browser?', answer: 'No, RSC dependencies stay 100% on the server, zero client bundle cost.', correctCount: 1, incorrectCount: 0 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  // Topic 3: Learned 6 days ago (Day 5 recall is 1 day OVERDUE to demonstrate overdue workflow)
  const topic3Learned = addDaysToDateString(today, -6)
  const topic3Id = 'seed-topic-3'
  const topic3: Topic = {
    id: topic3Id,
    title: 'Distributed Consensus: Raft Protocol vs Paxos',
    description: 'Leader election, log replication, and split-brain resolution in Raft clusters.',
    notes: 'Raft divides consensus into Leader Election, Log Replication, and Safety. Heartbeats enforce terms. Quorum requires (N/2) + 1 nodes.',
    learnedAt: topic3Learned,
    categoryId: 'cat-ds',
    difficulty: 'hard',
    chatgptUrl: 'https://chatgpt.com',
    questions: [
      { id: 'q3-1', question: 'What mechanism prevents split-vote deadlocks during Raft leader election?', answer: 'Randomized election timeouts (e.g. 150ms to 300ms) for each candidate node.', correctCount: 0, incorrectCount: 1 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  }

  // Topic 4: Learned Today (Day 0 recall completed today!)
  const topic4Learned = today
  const topic4Id = 'seed-topic-4'
  const topic4: Topic = {
    id: topic4Id,
    title: 'WebSockets vs Server-Sent Events (SSE) for Real-Time Sync',
    description: 'Unidirectional vs bidirectional protocol differences, HTTP/2 multiplexing, and reconnection.',
    notes: 'SSE runs over HTTP/2 with built-in automatic reconnect and text streaming (great for AI chatbots and notification feeds). WebSockets provides full-duplex binary frames over TCP.',
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
    topics,
    categories: SEED_CATEGORIES,
    tags: SEED_TAGS,
    topicTags,
    sessions: allSessions,
    settings: DEFAULT_SETTINGS,
  }
}