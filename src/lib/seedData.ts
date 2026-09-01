import type { Topic, Category, Course, Tag, TopicTag, RecallSession, Settings } from '../types'
import { generateRecallSessions, getTodayDateString } from '../services/spacedRecall'

const today = getTodayDateString()
const nowIso = new Date().toISOString()

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-frontend', name: 'Frontend & JavaScript', color: '#f59e0b', order: 1, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-backend', name: 'Node.js & Backend', color: '#10b981', order: 2, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-database', name: 'Databases & Storage', color: '#3b82f6', order: 3, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-sysdesign', name: 'System Design & Arch', color: '#8b5cf6', order: 4, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-machinecoding', name: 'Machine Coding & Polyfills', color: '#ec4899', order: 5, createdAt: nowIso, updatedAt: nowIso },
]

export const SEED_COURSES: Course[] = [
  {
    id: 'course-domain-1',
    title: 'Domain 1: Core JavaScript & Frontend Internals',
    description: 'Execution context, hoisting, scope, closures, prototypal inheritance, event loop, promises, UI performance, and React Fiber internals.',
    color: '#f59e0b',
    icon: 'Code',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-2',
    title: 'Domain 2: Node.js & Backend Architecture',
    description: 'Node.js event loop phases, Libuv concurrency, streams & backpressure, worker threads, JWT/OAuth security, and API architecture trade-offs.',
    color: '#10b981',
    icon: 'Server',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-3',
    title: 'Domain 3: Databases (SQL & NoSQL)',
    description: 'Relational vs Document stores, B-Tree index mechanics, ACID transactions, isolation levels, MongoDB aggregation pipeline, and query plans.',
    color: '#3b82f6',
    icon: 'Database',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-4',
    title: 'Domain 4: System Design & High Availability',
    description: 'Caching strategies, L4/L7 load balancers, message queues, CAP & PACELC theorems, horizontal scaling, and rate-limiting algorithms.',
    color: '#8b5cf6',
    icon: 'Layers',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-5',
    title: 'Domain 5: Machine Coding & Polyfills (Night Desk Sprints)',
    description: 'Handcrafted polyfills, utility functions (debounce, throttle, deepClone), LRU cache, Event Emitter, and React UI components from scratch.',
    color: '#ec4899',
    icon: 'Sparkles',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
]

export const SEED_TAGS: Tag[] = [
  { id: 'tag-js', name: 'javascript' },
  { id: 'tag-react', name: 'react' },
  { id: 'tag-node', name: 'nodejs' },
  { id: 'tag-sql', name: 'sql' },
  { id: 'tag-mongodb', name: 'mongodb' },
  { id: 'tag-sysdesign', name: 'system-design' },
  { id: 'tag-machine-coding', name: 'machine-coding' },
]

export const SEED_TOPICS: Topic[] = [
  // ==========================================
  // Domain 1: Core JavaScript & Frontend Internals (9 Topics)
  // ==========================================
  {
    id: 'd1-t1',
    courseId: 'course-domain-1',
    orderIndex: 0,
    title: 'Execution Context & Memory: Call Stack, Creation vs Execution phase, Memory Heap',
    description: 'Deep dive into Global vs Function Execution Contexts, Variable Environment, and Garbage Collection.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# Execution Context & Memory

### Core Concepts
- **Execution Context**: An abstract environment where JavaScript code is evaluated and executed.
- **Phases**:
  1. **Creation Phase**: Memory allocation for variables (\`undefined\` for \`var\`, uninitialized for \`let\`/\`const\`) and function declarations (placed entirely in memory).
  2. **Execution Phase**: Line-by-line code evaluation and value assignment.
- **Call Stack**: LIFO structure tracking active execution frames.
- **Memory Heap**: Unstructured memory space for dynamic object/reference allocations.

\`\`\`javascript
// Creation phase allocates 'a' as undefined, 'foo' as function reference
var a = 10;
function foo() {
  var b = 20;
  console.log(a + b);
}
foo(); // Pushes foo's Execution Context onto Call Stack
\`\`\`
`,
    questions: [
      {
        id: 'd1-t1-q1',
        question: 'What happens during the Creation Phase of an Execution Context?',
        answer: 'Memory is allocated for variable declarations and function declarations before executing any line of code.',
        correctCount: 0,
        incorrectCount: 0,
      }
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t2',
    courseId: 'course-domain-1',
    orderIndex: 1,
    title: 'Hoisting & Scope: var vs let/const, Scope Chain, Lexical Scope, Temporal Dead Zone (TDZ)',
    description: 'Lexical scoping rules, identifier resolution across parent environments, and TDZ mechanics.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# Hoisting, Scope & Temporal Dead Zone (TDZ)

### Summary Table
| Declaration | Hoisted? | Initialized? | Scope |
| :--- | :--- | :--- | :--- |
| \`var\` | Yes | \`undefined\` | Function / Global |
| \`let\` / \`const\` | Yes | Uninitialized (TDZ) | Block |
| \`function\` | Yes | Function body | Block / Function |

### Temporal Dead Zone (TDZ)
The period between entering the scope and the actual declaration line where accessing the variable throws a \`ReferenceError\`.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t3',
    courseId: 'course-domain-1',
    orderIndex: 2,
    title: 'Closures & Encapsulation: Private variables, Module pattern, Memory retention, Stale closures',
    description: 'Function bundled with its lexical environment references, module patterns, and stale closure pitfalls in React.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    markdownNotes: `# Closures & Encapsulation

A closure is the combination of a function bundled together with references to its surrounding lexical state.

### Module Pattern with Private State
\`\`\`javascript
function createCounter() {
  let count = 0; // Private encapsulated variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
\`\`\`
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t4',
    courseId: 'course-domain-1',
    orderIndex: 3,
    title: 'The this Keyword & Functions: Implicit, Explicit (call/apply/bind), Default binding, Arrow functions vs Regular functions',
    description: 'Dynamic execution context binding rules, explicit invocation, and lexical this binding in arrow functions.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# The \`this\` Keyword & Function Binding

### 4 Binding Rules
1. **Default Binding**: Global object (or \`undefined\` in strict mode).
2. **Implicit Binding**: Object preceding the dot (\`obj.method()\`).
3. **Explicit Binding**: \`call()\`, \`apply()\`, \`bind()\`.
4. **\`new\` Binding**: Newly created object instance.

### Arrow Functions
- Arrow functions **do not** have their own \`this\`, \`arguments\`, or \`prototype\`. They inherit \`this\` lexically from the enclosing scope.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t5',
    courseId: 'course-domain-1',
    orderIndex: 4,
    title: 'Prototypal Inheritance: Prototype Chain, prototype vs __proto__, Object creation',
    description: 'Object delegation model, Object.create(), class syntax desugaring, and prototype pollution.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# Prototypal Inheritance

JavaScript objects inherit properties directly from other objects via the prototype chain.

- \`Function.prototype\`: The blueprint object attached to constructor functions.
- \`__proto__\` / \`Object.getPrototypeOf(obj)\`: Pointer on the instance referencing its prototype.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t6',
    courseId: 'course-domain-1',
    orderIndex: 5,
    title: 'Event Loop & Asynchronous JS: Microtask Queue (Promises, queueMicrotask) vs Macrotask Queue (setTimeout), Event Loop phases',
    description: 'Browser event loop lifecycle, microtask draining priority, and UI render steps.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    markdownNotes: `# Browser Event Loop & Tasks

### Priority Order
1. **Synchronous Call Stack Execution**
2. **Microtask Queue Drain**: \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\` (drained completely before next task or render).
3. **Render Step**: RequestAnimationFrame, Style/Layout/Paint.
4. **Macrotask Queue (Task Queue)**: \`setTimeout\`, \`setInterval\`, I/O, UI events (picks 1 task per tick).
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t7',
    courseId: 'course-domain-1',
    orderIndex: 6,
    title: 'Promises & Async/Await: Promise states, Chaining, Combinators (Promise.all, allSettled, race, any), Error handling',
    description: 'Promise lifecycle, rejection handling, and all 4 standard Promise combinators.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# Promises & Async Combinators

### Combinators Cheat-sheet
- \`Promise.all\`: Fails fast if any rejects; resolves array when all resolve.
- \`Promise.allSettled\`: Never short-circuits; returns array of status objects.
- \`Promise.race\`: Settles with first promise to settle (fulfill or reject).
- \`Promise.any\`: Resolves with first fulfillment; rejects only with \`AggregateError\` if all reject.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t8',
    courseId: 'course-domain-1',
    orderIndex: 7,
    title: 'UI Performance & Events: Debouncing vs Throttling, Event Bubbling, Event Capturing, Event Delegation',
    description: 'DOM event propagation phases and high-frequency event rate control.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    markdownNotes: `# UI Performance & DOM Events

### Debounce vs Throttle
- **Debounce**: Delays execution until $N$ ms have elapsed since last invocation (e.g. Search input auto-complete).
- **Throttle**: Enforces a maximum execution rate of once per $N$ ms (e.g. Scroll / Window resize listeners).

### Event Delegation
Attach a single listener to a parent container exploiting Event Bubbling instead of attaching individual listeners to 1,000 items.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t9',
    courseId: 'course-domain-1',
    orderIndex: 8,
    title: 'React Internals: Virtual DOM, Fiber Architecture, Reconciliation algorithm, Automatic Batching, Custom Hooks, useMemo/useCallback under the hood',
    description: 'React 18 concurrent render phases, Fiber nodes, diffing heuristics, and hook state preservation.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    markdownNotes: `# React Fiber Architecture & Reconciliation

### Key Concepts
- **Fiber Node**: JavaScript object representing a unit of work (doubly-linked tree with \`child\`, \`sibling\`, \`return\`).
- **Render Phase (Asynchronous / Interruptible)**: Builds work-in-progress tree and computes diffs.
- **Commit Phase (Synchronous)**: Applies DOM mutations and runs layout effects.
- **Automatic Batching**: Groups multiple state updates across timeouts, promises, and native handlers into 1 re-render.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },

  // ==========================================
  // Domain 2: Node.js & Backend Architecture (6 Topics)
  // ==========================================
  {
    id: 'd2-t1',
    courseId: 'course-domain-2',
    orderIndex: 0,
    title: 'Node.js Event Loop: The 6 Phases (Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close)',
    description: 'Libuv phase lifecycle, process.nextTick vs setImmediate, and poll phase mechanics.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    markdownNotes: `# Node.js Event Loop (Libuv 6 Phases)

1. **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).
3. **Idle, Prepare**: Used internally only.
4. **Poll**: Retrieves new I/O events; calculates how long it should block and wait for I/O.
5. **Check**: Executes \`setImmediate()\` callbacks.
6. **Close Callbacks**: Handles socket/handle closures (e.g. \`socket.on('close')\`).

*Note*: \`process.nextTick()\` fires immediately after the current operation finishes, before the event loop continues to the next phase.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t2',
    courseId: 'course-domain-2',
    orderIndex: 1,
    title: 'Libuv & Concurrency: Libuv Thread Pool, Non-blocking I/O vs Blocking I/O, Event-driven architecture',
    description: 'Epoll/Kqueue OS hooks, UV_THREADPOOL_SIZE, and CPU vs I/O intensive workload handling.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    markdownNotes: `# Libuv & Concurrency Model

- **OS Asynchronous primitives**: Network I/O is handled non-blocking by the OS kernel (\`epoll\` on Linux, \`kqueue\` on macOS, \`IOCP\` on Windows).
- **Thread Pool**: File system operations (\`fs\`), DNS lookups (\`dns.lookup\`), and cryptographic hashing (\`crypto.pbkdf2\`) are delegated to Libuv's thread pool (default 4 threads).
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t3',
    courseId: 'course-domain-2',
    orderIndex: 2,
    title: 'Streams & Buffers: Readable, Writable, Duplex, Transform streams, Backpressure, Buffer memory',
    description: 'Chunked data processing, pipeline utility, backpressure handling, and raw byte buffers.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'medium',
    markdownNotes: `# Streams, Backpressure & Buffers

### Backpressure
Occurs when the data producer (Readable stream) emits chunks faster than the consumer (Writable stream) can process them.

\`\`\`javascript
import { pipeline } from 'stream/promises';
import fs from 'fs';
import zlib from 'zlib';

await pipeline(
  fs.createReadStream('source.csv'),
  zlib.createGzip(),
  fs.createWriteStream('dest.csv.gz')
);
\`\`\`
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t4',
    courseId: 'course-domain-2',
    orderIndex: 3,
    title: 'Scaling Node.js: Cluster Module, Worker Threads, Child Processes (fork, exec, spawn)',
    description: 'Multi-process vs multi-thread parallelism, IPC communication, and CPU-bound work offloading.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    markdownNotes: `# Scaling Node.js

- **Cluster Module**: Spawns multiple instances of the Node.js process sharing server ports via master-worker architecture.
- **Worker Threads (\`worker_threads\`)**: Shares memory using \`SharedArrayBuffer\` for CPU-bound computations without spawning separate processes.
- **Child Processes (\`child_process\`)**: Executes shell commands and binaries (\`spawn\` for streams, \`fork\` for node modules with IPC).
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t5',
    courseId: 'course-domain-2',
    orderIndex: 4,
    title: 'Security & Auth: JWT vs Session-based auth, OAuth 2.0 flow, Rate Limiting, CORS, CSRF, XSS prevention',
    description: 'Stateless vs stateful auth, token revocation, OAuth authorization code grant, and web attack vectors.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    markdownNotes: `# Backend Security & Authentication

### JWT vs Session-Based Auth
- **Session Auth**: Stateful, stored in Redis/DB on server, revoked instantly via session ID in HTTP-only cookie.
- **JWT**: Stateless, self-contained claims signed by secret/asymmetric key, difficult to revoke without token blocklists.

### Essential Defenses
- **XSS**: Sanitize input, set \`Content-Security-Policy\` header, store tokens in \`httpOnly\` cookies.
- **CSRF**: SameSite cookie attribute (\`SameSite=Lax/Strict\`), CSRF anti-forgery tokens.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t6',
    courseId: 'course-domain-2',
    orderIndex: 5,
    title: 'API Architectures: REST best practices, GraphQL vs REST trade-offs, WebSockets (real-time communication)',
    description: 'Resource design, over/under-fetching, n+1 query problem, GraphQL schema federation, and persistent TCP sockets.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'medium',
    markdownNotes: `# API Architectures & Real-Time

- **REST**: Standard HTTP verbs, idempotent endpoints (\`GET\`, \`PUT\`, \`DELETE\`), caching at CDN layer.
- **GraphQL**: Solves over-fetching and under-fetching; requires DataLoader to mitigate the $N+1$ query problem.
- **WebSockets**: Bi-directional, full-duplex persistent TCP connection for sub-millisecond real-time streaming.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },

  // ==========================================
  // Domain 3: Databases (SQL & NoSQL) (5 Topics)
  // ==========================================
  {
    id: 'd3-t1',
    courseId: 'course-domain-3',
    orderIndex: 0,
    title: 'Database Types & Trade-offs: Relational (PostgreSQL/MySQL) vs Document-based (MongoDB), Schema design',
    description: 'Relational integrity vs document flexibility, access pattern driven design, and polyglot persistence.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-database',
    difficulty: 'medium',
    markdownNotes: `# SQL vs NoSQL Trade-offs

- **Relational (PostgreSQL)**: Strong ACID guarantees, strict schemas, normalized data, efficient join operations.
- **Document (MongoDB)**: Flexible JSON-like schemas, embeds for high read performance, optimized for horizontal sharding.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t2',
    courseId: 'course-domain-3',
    orderIndex: 1,
    title: 'Indexing Mechanics: B-Tree vs Hash Indexes, Compound Indexes, Index Seek vs Index Scan, Clustered vs Non-Clustered',
    description: 'B-Tree node balancing, Leftmost Prefix Rule for composite indexes, and index selectivity.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-database',
    difficulty: 'hard',
    markdownNotes: `# Indexing Mechanics

### Index Seek vs Index Scan
- **Index Seek**: Traverses the B-Tree directly to find the matching keys in $\\mathcal{O}(\\log N)$ time.
- **Index Scan**: Scans the entire leaf level of the index in $\\mathcal{O}(N)$ time.

### Compound Index: Leftmost Prefix Rule
For an index on \`(tenant_id, created_at, status)\`:
- Queries filtering by \`tenant_id\` or \`tenant_id + created_at\` can use the index.
- Queries filtering only by \`status\` cannot leverage the B-Tree index.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t3',
    courseId: 'course-domain-3',
    orderIndex: 2,
    title: 'Transactions & Concurrency: ACID Properties, Isolation levels, Database Locking (Pessimistic vs Optimistic)',
    description: 'Dirty reads, Non-repeatable reads, Phantom reads, MVCC (Multi-Version Concurrency Control), and distributed locks.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-database',
    difficulty: 'hard',
    markdownNotes: `# ACID & Isolation Levels

### SQL Isolation Levels
1. **Read Uncommitted**: Allows Dirty Reads.
2. **Read Committed** (PostgreSQL Default): Prevents Dirty Reads.
3. **Repeatable Read**: Prevents Non-repeatable reads.
4. **Serializable**: Strict serial order; prevents Phantom Reads and Write Skew.

### Locking Strategies
- **Pessimistic**: \`SELECT ... FOR UPDATE\` locks rows explicitly.
- **Optimistic**: Uses a version column (\`UPDATE ... WHERE version = 1\`).
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t4',
    courseId: 'course-domain-3',
    orderIndex: 3,
    title: 'MongoDB Architecture: Aggregation Pipeline stages, Indexing strategies, Sharding, Replica Sets & Write Concern',
    description: 'Aggregation pipeline stages ($match, $group, $lookup), shard keys, and raft election failover.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-database',
    difficulty: 'hard',
    markdownNotes: `# MongoDB Architecture & Aggregation

### Aggregation Pipeline Optimization
Place \`$match\` and \`$project\` as early as possible in the pipeline to filter and strip documents before memory-heavy \`$group\` or \`$lookup\` operations.

### Write Concern (\`w: "majority", j: true\`)
Ensures writes are committed to the majority of replica nodes and written to on-disk journal before sending success response.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t5',
    courseId: 'course-domain-3',
    orderIndex: 4,
    title: 'Optimization & Scaling: Query execution plans (EXPLAIN), Normalization vs Denormalization, Connection Pooling',
    description: 'EXPLAIN ANALYZE reading, buffer cache hits, connection pool sizing (PgBouncer), and read replicas.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-database',
    difficulty: 'medium',
    markdownNotes: `# Database Optimization & Query Plans

- **EXPLAIN (ANALYZE, BUFFERS)**: Shows actual execution time vs planner estimates, index usage, and disk buffer hits.
- **Connection Pooling**: Reuses open TCP connections to eliminate TLS handshake latency during traffic spikes.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },

  // ==========================================
  // Domain 4: System Design & High Availability (5 Topics)
  // ==========================================
  {
    id: 'd4-t1',
    courseId: 'course-domain-4',
    orderIndex: 0,
    title: 'Caching Strategies: Cache-Aside, Write-Through, Write-Back, Eviction Policies (LRU, LFU), Redis data structures',
    description: 'Cache invalidation patterns, cache stampede mitigation, Redis strings, hashes, sorted sets, and TTL.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'medium',
    markdownNotes: `# Caching Patterns & Redis

### Patterns
- **Cache-Aside**: Application reads from cache; on cache miss, queries DB and populates cache.
- **Write-Through**: Application writes to cache, which synchronously writes to DB.
- **Write-Back (Write-Behind)**: Writes to cache instantly; async worker flushes writes in batch to DB.

### Cache Stampede Prevention
Use distributed mutex locks or probabilistic early expiration (XFetch algorithm) to prevent 10,000 requests hitting DB on key expiration.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t2',
    courseId: 'course-domain-4',
    orderIndex: 1,
    title: 'Load Balancing & Proxies: Round Robin, Least Connections, L4 vs L7 Load Balancers, Nginx Reverse Proxy',
    description: 'Layer 4 TCP vs Layer 7 HTTP load balancing, SSL termination, sticky sessions, and health checks.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'medium',
    markdownNotes: `# Load Balancing & Reverse Proxies

- **Layer 4 (Transport Layer)**: Routes traffic based on IP and Port without inspecting HTTP payload (High throughput, ultra low latency).
- **Layer 7 (Application Layer)**: Routes based on HTTP headers, cookies, URL paths, and query params (Content-based routing).
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t3',
    courseId: 'course-domain-4',
    orderIndex: 2,
    title: 'Asynchronous Processing: Message Queues (Kafka, RabbitMQ), Publisher/Subscriber pattern, Idempotency',
    description: 'Log-based streaming vs AMQP brokers, at-least-once delivery, dead letter queues (DLQ), and idempotent consumers.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    markdownNotes: `# Message Queues & Event Streaming

### Kafka vs RabbitMQ
- **Kafka**: Append-only distributed commit log, partitioned topics, consumer groups manage offsets, high throughput.
- **RabbitMQ**: Smart broker with flexible routing exchanges, pushes messages to consumers, deletes upon ack.

### Idempotency Keys
Store processed transaction IDs in Redis/DB with unique constraints to ensure re-delivered messages do not double-charge users.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t4',
    courseId: 'course-domain-4',
    orderIndex: 3,
    title: 'System Design Core Theorems: CAP Theorem, PACELC Theorem, Horizontal vs Vertical Scaling, Database Sharding strategies',
    description: 'Consistency vs Availability during network partitions, latency vs consistency during normal execution, and consistent hashing.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    markdownNotes: `# CAP & PACELC Theorems

### PACELC Theorem
If there is a **Partition (P)**, trade off **Availability (A)** and **Consistency (C)**;
**Else (E)**, trade off **Latency (L)** and **Consistency (C)**.

### Sharding & Consistent Hashing
Distribute keys across $N$ nodes on a hash ring to minimize key relocation when nodes join or leave.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t5',
    courseId: 'course-domain-4',
    orderIndex: 4,
    title: 'API Gateway & Rate Limiting: Token Bucket, Leaky Bucket, Sliding Window algorithms',
    description: 'Rate limiting algorithms in distributed systems, Redis sliding window counter, and API gateway routing.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'medium',
    markdownNotes: `# Rate Limiting Algorithms

1. **Token Bucket**: Tokens added at constant rate; burst capacity allowed up to bucket size.
2. **Leaky Bucket**: Requests enter queue and are processed at fixed smooth rate.
3. **Sliding Window Log**: Stores timestamps in Redis Sorted Set; highly accurate, memory intensive.
4. **Sliding Window Counter**: Interpolates counts from previous and current window.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },

  // ==========================================
  // Domain 5: Machine Coding & Polyfills (4 Topics)
  // ==========================================
  {
    id: 'd5-t1',
    courseId: 'course-domain-5',
    orderIndex: 0,
    title: 'Core Polyfills: Promise.all, Function.prototype.bind, Array.prototype.map/filter/reduce',
    description: 'Writing rock-solid standard JavaScript polyfills from scratch handle edge cases.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machinecoding',
    difficulty: 'medium',
    markdownNotes: `# Core JavaScript Polyfills

### 1. \`Promise.all\` Polyfill
\`\`\`javascript
function promiseAllPolyfill(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    const results = [];
    let completedCount = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          results[index] = val;
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
\`\`\`
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t2',
    courseId: 'course-domain-5',
    orderIndex: 1,
    title: 'Utility Functions: Custom debounce() with leading/trailing options, custom throttle(), deepClone(), memoize()',
    description: 'Advanced utility function implementations with immediate execution and circular reference handling.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machinecoding',
    difficulty: 'hard',
    markdownNotes: `# Advanced Debounce & DeepClone

### Custom Debounce with Leading & Trailing Options
\`\`\`javascript
function debounce(fn, wait, { leading = false, trailing = true } = {}) {
  let timerId = null;
  let lastArgs = null;

  return function (...args) {
    lastArgs = args;
    const isInvokingLeading = leading && !timerId;

    clearTimeout(timerId);

    if (isInvokingLeading) {
      fn.apply(this, args);
    }

    timerId = setTimeout(() => {
      if (trailing && (!leading || lastArgs !== null)) {
        fn.apply(this, lastArgs);
      }
      timerId = null;
      lastArgs = null;
    }, wait);
  };
}
\`\`\`
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t3',
    courseId: 'course-domain-5',
    orderIndex: 2,
    title: 'Design Patterns: Event Emitter (Pub/Sub), LRU Cache class, Async Queue/Task Runner',
    description: 'Object-oriented and functional data structures for real-world engineering sprints.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machinecoding',
    difficulty: 'hard',
    markdownNotes: `# Event Emitter & LRU Cache

### LRU Cache with Map (O(1) Get and Put)
\`\`\`javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // Refresh order
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used key (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
\`\`\`
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t4',
    courseId: 'course-domain-5',
    orderIndex: 3,
    title: 'React Machine Coding: Custom Autocomplete / Search with debounce, Infinite Scroll hook, Star Rating, File Explorer tree',
    description: 'Component architecture, accessibility (ARIA), keyboard navigation, and recursive rendering.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machinecoding',
    difficulty: 'hard',
    markdownNotes: `# React UI Machine Coding Patterns

### Key Patterns to Review
1. **Custom Autocomplete**: Keyboard navigation (\`ArrowUp\`, \`ArrowDown\`, \`Enter\`, \`Escape\`), debounced network query, outside click listener.
2. **Infinite Scroll Hook**: \`IntersectionObserver\` on sentinel ref, aborting stale fetch requests with \`AbortController\`.
3. **File Explorer**: Recursive component rendering, collapsible directory state, and nested folder creation.
`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
]

export const SEED_TOPIC_TAGS: TopicTag[] = [
  { topicId: 'd1-t1', tagId: 'tag-js' },
  { topicId: 'd1-t9', tagId: 'tag-react' },
  { topicId: 'd2-t1', tagId: 'tag-node' },
  { topicId: 'd3-t1', tagId: 'tag-sql' },
  { topicId: 'd3-t4', tagId: 'tag-mongodb' },
  { topicId: 'd4-t1', tagId: 'tag-sysdesign' },
  { topicId: 'd5-t1', tagId: 'tag-machine-coding' },
]

export const SEED_SESSIONS: RecallSession[] = SEED_TOPICS.flatMap((topic) =>
  generateRecallSessions(topic.id, topic.learnedAt, [0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365], today)
)

export const SEED_SETTINGS: Settings = {
  recallIntervals: [0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365],
  notificationEnabled: true,
  notificationTime: '10:00',
  notificationFrequency: 'daily',
  remindOverdue: true,
  remindDueToday: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  theme: 'system',
  weekStartDay: 1,
}

export const DEFAULT_SETTINGS = SEED_SETTINGS

export function generateSeedData() {
  return {
    courses: SEED_COURSES,
    topics: SEED_TOPICS,
    categories: SEED_CATEGORIES,
    tags: SEED_TAGS,
    topicTags: SEED_TOPIC_TAGS,
    sessions: SEED_SESSIONS,
    settings: SEED_SETTINGS,
  }
}