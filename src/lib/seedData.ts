import type { Topic, Category, Course, Tag, TopicTag, RecallSession, Settings } from '../types'
import { getTodayDateString } from '../services/spacedRecall'

const today = getTodayDateString()
const nowIso = new Date().toISOString()

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-frontend', name: 'Frontend Internals', color: '#f59e0b', order: 0, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-backend', name: 'Backend & Node.js', color: '#10b981', order: 1, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-db', name: 'Databases & Storage', color: '#3b82f6', order: 2, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-sysdesign', name: 'System Design', color: '#8b5cf6', order: 3, createdAt: nowIso, updatedAt: nowIso },
  { id: 'cat-machine-coding', name: 'Machine Coding', color: '#ec4899', order: 4, createdAt: nowIso, updatedAt: nowIso },
]

export const SEED_COURSES: Course[] = [
  {
    id: 'course-domain-1',
    title: 'Domain 1: Core JavaScript & Frontend Internals',
    description: 'Execution Context, Hoisting, Closures, Event Loop, Prototypal Inheritance, and React Fiber internals.',
    color: '#f59e0b',
    icon: 'Code',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-2',
    title: 'Domain 2: Node.js & Backend Architecture',
    description: 'Libuv 6 Event Loop Phases, Streams & Backpressure, Worker Threads, and Security/Auth.',
    color: '#10b981',
    icon: 'Server',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-3',
    title: 'Domain 3: Databases (SQL & NoSQL)',
    description: 'SQL vs Document DBs, B-Tree Indexing, ACID & Isolation Levels, MongoDB Sharding, and Query Optimization.',
    color: '#3b82f6',
    icon: 'Database',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-4',
    title: 'Domain 4: System Design & High Availability',
    description: 'Caching Strategies, Load Balancing, Message Queues, CAP/PACELC Theorems, and Rate Limiting.',
    color: '#8b5cf6',
    icon: 'Layers',
    status: 'active',
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: 'course-domain-5',
    title: 'Domain 5: Machine Coding & Polyfills (Night Desk Sprints)',
    description: 'Core JavaScript Polyfills, Utility Helpers (Debounce/Throttle/DeepClone), and React UI widgets.',
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
    definitions: `### Key Definitions & Terminology

- **Execution Context (EC)**: The internal environment created by the JS engine that wraps and executes code.
- **Call Stack**: LIFO data structure storing active execution contexts.
- **Creation Phase**: Memory allocation step where variables are assigned \`undefined\` and function declarations are fully stored.
- **Execution Phase**: Step where JavaScript interprets and assigns values line by line.
- **Memory Heap**: Unstructured memory area for dynamic reference object allocations.`,
    keyNotes: `### Key Takeaways & Mental Models

- **Every JS function call creates its own Execution Context** pushed onto the Call Stack.
- **Creation precedes execution**: Memory is already mapped before line 1 runs.
- Primitive types live on the Stack; reference objects live in the Heap.
- Garbage collector uses **Mark-and-Sweep** to clean objects unreachable from roots.`,
    fullTopic: `# Execution Context & Memory Deep Dive

### Execution Context Lifecycle
When JavaScript executes, it boots in the **Global Execution Context (GEC)**. Each function call pushes a new **Function Execution Context (FEC)** onto the Call Stack.

\`\`\`javascript
var a = 10;
function calculateSum(x, y) {
  var total = x + y;
  return total;
}
var result = calculateSum(a, 20);
\`\`\`

### Step-by-Step Execution:
1. **Creation Phase**:
   - Creates global object (\`window\` or \`global\`) and binds \`this\`.
   - Allocates memory: \`a = undefined\`, \`calculateSum = function reference\`, \`result = undefined\`.
2. **Execution Phase**:
   - Assigns \`a = 10\`.
   - Invokes \`calculateSum(10, 20)\` → pushes new FEC to Call Stack.
   - Computes \`total = 30\`, pops FEC off stack, assigns \`result = 30\`.`,
    markdownNotes: `# Execution Context & Memory Deep Dive

### Execution Context Lifecycle
When JavaScript executes, it boots in the **Global Execution Context (GEC)**. Each function call pushes a new **Function Execution Context (FEC)** onto the Call Stack.

\`\`\`javascript
var a = 10;
function calculateSum(x, y) {
  var total = x + y;
  return total;
}
var result = calculateSum(a, 20);
\`\`\``,
    questionsMarkdown: `### Top Interview Questions & Code Challenges

1. **What is the difference between Call Stack overflow and Memory Leak?**
   - *Stack Overflow*: Exceeding maximum recursion/frame limits.
   - *Memory Leak*: Unused heap objects retaining reachable root references.

2. **Predict Output:**
   \`\`\`javascript
   function test() {
     console.log(a);
     console.log(foo());
     var a = 1;
     function foo() { return 2; }
   }
   test();
   \`\`\`
   - *Output*: \`undefined\` then \`2\`.`,
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
    description: 'Lexical scoping mechanics, TDZ behavior, block scope vs function scope.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **Hoisting**: Moving variable/function declarations to top of scope at compilation.
- **Lexical Scope**: Scope defined by source code structure at authoring time.
- **Temporal Dead Zone (TDZ)**: Period from block entry until variable initialization where access throws \`ReferenceError\`.
- **Scope Chain**: Chain of parent lexical environments searched when resolving identifiers.`,
    keyNotes: `### Key Takeaways & Mental Models

- \`var\` is **function-scoped** and hoisted initialized as \`undefined\`.
- \`let\` / \`const\` are **block-scoped** and hoisted in an **uninitialized** state (TDZ).
- Outer scope cannot access inner variables; inner scope accesses outer variables via the Scope Chain.`,
    fullTopic: `# Hoisting & Temporal Dead Zone (TDZ)

### var vs let/const Comparison
| Feature | \`var\` | \`let\` / \`const\` |
| :--- | :--- | :--- |
| **Scope** | Function | Block \`{ ... }\` |
| **Hoisted as** | \`undefined\` | Uninitialized (TDZ) |
| **Re-declaration** | Permitted | SyntaxError |

\`\`\`javascript
{
  // TDZ for 'score'
  // console.log(score); // ReferenceError
  let score = 100; // TDZ ends
  console.log(score); // 100
}
\`\`\``,
    markdownNotes: `# Hoisting & Temporal Dead Zone (TDZ)

### var vs let/const Comparison
| Feature | \`var\` | \`let\` / \`const\` |
| :--- | :--- | :--- |
| **Scope** | Function | Block \`{ ... }\` |
| **Hoisted as** | \`undefined\` | Uninitialized (TDZ) |
| **Re-declaration** | Permitted | SyntaxError |`,
    questionsMarkdown: `### Top Interview Questions

1. **Why does TDZ exist in JS?**
   - Prevents accessing variables before initialization and makes \`const\` truly immutable from declaration point.`,
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
    description: 'Lexical environment bundling, memory trade-offs, practical closure patterns in React hooks.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Closure**: Function bundled with its lexical environment references.
- **Encapsulation**: Restricting direct access to object internals and state.
- **Stale Closure**: Closure holding an outdated snapshot of variables from previous renders.`,
    keyNotes: `### Key Takeaways & Mental Models

- Closures let functions maintain state across invocations without global pollution.
- In React \`useEffect\` / \`useCallback\`, stale closures happen if dependency arrays are omitted.
- Fix React stale closures using functional state updaters: \`setCount(c => c + 1)\`.`,
    fullTopic: `# Closures & Encapsulation

\`\`\`javascript
function createCounter() {
  let count = 0; // Private encapsulated state
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.count); // undefined (cannot be tampered with)
\`\`\``,
    markdownNotes: `# Closures & Encapsulation`,
    questionsMarkdown: `### Top Interview Questions

1. **How to fix a Stale Closure in \`setInterval\` within \`useEffect\`?**
   - Pass functional updater \`setState(prev => prev + 1)\` or list state in dependency array.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t4',
    courseId: 'course-domain-1',
    orderIndex: 3,
    title: 'The this Keyword & Functions: Implicit, Explicit (call/apply/bind), Default binding, Arrow functions',
    description: 'Runtime binding rules, arrow function lexical binding, call/apply/bind polyfills.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **\`this\`**: Execution context determined at call-site (invocation time).
- **Implicit Binding**: \`obj.fn()\` binds \`this\` to \`obj\`.
- **Explicit Binding**: \`fn.call(ctx)\`, \`fn.apply(ctx)\`, \`fn.bind(ctx)\`.
- **Lexical Binding**: Arrow functions inherit \`this\` from enclosing scope.`,
    keyNotes: `### Key Takeaways & Mental Models

- 4 Binding Rules: \`new\` > Explicit (\`call/apply/bind\`) > Implicit (\`obj.fn\`) > Default (\`window\` / \`undefined\`).
- Arrow functions **never** have their own \`this\`, \`arguments\`, or \`super\`.`,
    fullTopic: `# The \`this\` Keyword in JavaScript

### Priority Order:
1. \`new Foo()\` → New object instance.
2. \`foo.call(ctx)\` / \`bind(ctx)\` → Specified context.
3. \`user.greet()\` → \`user\` object.
4. \`foo()\` → Global object (\`undefined\` in strict mode).`,
    markdownNotes: `# The \`this\` Keyword in JavaScript`,
    questionsMarkdown: `### Top Interview Questions

1. **Can you rebind an arrow function using \`.bind()\`?**
   - No, arrow functions ignore explicit binding calls.`,
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
    description: 'Object delegation, [[Prototype]], Object.create vs class syntax under the hood.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Prototype Chain**: Linked delegation where missing properties look up \`__proto__\` hierarchy.
- **\`prototype\`**: Object blueprint attached to constructor functions.
- **\`__proto__\`**: Pointer on object instances to their prototype delegate.`,
    keyNotes: `### Key Takeaways & Mental Models

- JS objects **delegate** to prototypes rather than copy class definitions.
- End of prototype chain is \`Object.prototype.__proto__ === null\`.`,
    fullTopic: `# Prototypal Inheritance Mechanics

\`\`\`javascript
const proto = { greet() { return "Hello!"; } };
const obj = Object.create(proto);
console.log(obj.greet()); // "Hello!" resolved via Prototype Chain
\`\`\``,
    markdownNotes: `# Prototypal Inheritance Mechanics`,
    questionsMarkdown: `### Top Interview Questions

1. **Difference between \`__proto__\` and \`prototype\`?**
   - \`prototype\` exists on constructors; \`__proto__\` exists on created instances.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t6',
    courseId: 'course-domain-1',
    orderIndex: 5,
    title: 'Event Loop & Asynchronous JS: Microtask Queue (Promises) vs Macrotask Queue (setTimeout)',
    description: 'Browser event loop execution order, microtask starvation, rendering pipeline coordination.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Event Loop**: Coordinator between Call Stack and task queues.
- **Microtask Queue**: High priority queue (Promises, \`queueMicrotask\`) drained to completion every tick.
- **Macrotask Queue**: Task queue (\`setTimeout\`, \`setInterval\`, I/O) processed 1 item per tick.`,
    keyNotes: `### Key Takeaways & Mental Models

- Microtasks **always** run before UI rendering and before next macrotask.
- Starving microtasks freezes browser rendering.`,
    fullTopic: `# Browser Event Loop Architecture

### Execution Priority:
1. Sync Call Stack.
2. All Microtasks (Queue drained completely).
3. UI Render pipeline.
4. One Macrotask from Queue.`,
    markdownNotes: `# Browser Event Loop Architecture`,
    questionsMarkdown: `### Top Interview Questions

1. **Predict output of \`setTimeout(0)\` vs \`Promise.resolve().then()\`:**
   - Promise (microtask) always prints before \`setTimeout\` (macrotask).`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t7',
    courseId: 'course-domain-1',
    orderIndex: 6,
    title: 'Promises & Async/Await: Promise states, Chaining, Combinators (all, allSettled, race, any)',
    description: 'Internal states, unhandled rejections, Promise combinator algorithms and async error patterns.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **Promise**: Future value with 3 states: \`pending\`, \`fulfilled\`, \`rejected\`.
- **\`Promise.all\`**: Fails-fast on first rejection.
- **\`Promise.allSettled\`**: Never rejects early; returns status array.
- **\`Promise.race\`**: Returns first settled promise.
- **\`Promise.any\`**: Returns first fulfilled promise.`,
    keyNotes: `### Key Takeaways & Mental Models

- \`async/await\` is syntactic sugar for generator coroutines + promises.
- Always handle rejections with \`try/catch\` or \`.catch()\`.`,
    fullTopic: `# Promises & Combinators Deep Dive

| Combinator | Short-circuits on | Result |
| :--- | :--- | :--- |
| \`Promise.all\` | First Rejection | Array of resolved values |
| \`Promise.allSettled\` | Never | Array of \`{status, value/reason}\` |
| \`Promise.race\` | First Settle | First settled value |
| \`Promise.any\` | First Fulfillment | First fulfilled value |`,
    markdownNotes: `# Promises & Combinators Deep Dive`,
    questionsMarkdown: `### Top Interview Questions

1. **Difference between \`Promise.all\` and \`Promise.allSettled\`?**
   - \`all\` aborts on first failure; \`allSettled\` collects outcomes of all promises.`,
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
    description: 'DOM event dispatch phases, high-frequency event optimization, event delegation patterns.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **Debounce**: Delays execution until pause in event triggers.
- **Throttle**: Caps execution rate to once per time window.
- **Event Delegation**: Single listener on parent handling events from child elements.
- **Event Bubbling**: Events propagate up from target to \`window\`.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use **Debounce** for search autocomplete and window resize.
- Use **Throttle** for scroll listeners and game loops.
- Use **Event Delegation** for dynamic lists to avoid 1000s of event listeners.`,
    fullTopic: `# DOM Events & Frequency Optimization

\`\`\`
Window → Document → <body> → <div> (1. Capture)
                               ↓
                        [ Button ] (2. Target)
                               ↓
Window ← Document ← <body> ← <div> (3. Bubble)
\`\`\``,
    markdownNotes: `# DOM Events & Frequency Optimization`,
    questionsMarkdown: `### Top Interview Questions

1. **\`e.target\` vs \`e.currentTarget\`:**
   - \`target\` is element clicked; \`currentTarget\` is element listener is attached to.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd1-t9',
    courseId: 'course-domain-1',
    orderIndex: 8,
    title: 'React Internals: Virtual DOM, Fiber Architecture, Reconciliation, Diffing Algorithm',
    description: 'Fiber node data structures, concurrent rendering, work loops, and render vs commit phases.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-frontend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Fiber Architecture**: Linked list data structure supporting interruptible rendering.
- **Reconciliation**: Algorithm diffing Virtual DOM trees.
- **Render Phase**: Interruptible computation of side-effect flags.
- **Commit Phase**: Synchronous application of DOM mutations.`,
    keyNotes: `### Key Takeaways & Mental Models

- Fiber enables Concurrent Mode and prioritization of user interactions over background updates.
- Keys provide stable identities for \(O(n)\) list diffing.`,
    fullTopic: `# React Fiber Architecture & Diffing

\`\`\`javascript
const fiberNode = {
  type: 'div',
  child: firstChildFiber,
  sibling: nextSiblingFiber,
  return: parentFiber,
  alternate: currentFiber, // Double buffering
};
\`\`\``,
    markdownNotes: `# React Fiber Architecture & Diffing`,
    questionsMarkdown: `### Top Interview Questions

1. **Why are keys essential in React lists?**
   - To match children across renders in \(O(n)\) time rather than destroying subtrees.`,
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
    title: 'Node.js Event Loop: 6 Libuv Phases (Timers, Pending I/O, Idle/Prepare, Poll, Check, Close)',
    description: 'Detailed analysis of Libuv event loop ticks, nextTickQueue vs microtaskQueue priority.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Libuv**: C library providing async I/O and thread pooling for Node.js.
- **Timers Phase**: Executes \`setTimeout\` and \`setInterval\` callbacks.
- **Poll Phase**: Polls for incoming I/O connections and events.
- **Check Phase**: Executes \`setImmediate\` callbacks.
- **\`process.nextTick\`**: Runs immediately after current operation, before event loop moves.`,
    keyNotes: `### Key Takeaways & Mental Models

- Node event loop has 6 distinct phases in Libuv.
- \`process.nextTick\` is prioritized before microtasks and before the next phase.`,
    fullTopic: `# Node.js Libuv 6 Phases

1. **Timers**: \`setTimeout\`, \`setInterval\`.
2. **Pending Callbacks**: Deferred I/O callbacks.
3. **Idle, Prepare**: Internal.
4. **Poll**: Retrieve new I/O events.
5. **Check**: \`setImmediate\` callbacks.
6. **Close Callbacks**: \`socket.on('close')\`.`,
    markdownNotes: `# Node.js Libuv 6 Phases`,
    questionsMarkdown: `### Top Interview Questions

1. **\`setImmediate\` vs \`process.nextTick\`:**
   - \`nextTick\` runs immediately in current tick; \`setImmediate\` runs in Check Phase.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t2',
    courseId: 'course-domain-2',
    orderIndex: 1,
    title: 'Libuv & Concurrency: Thread Pool (UV_THREADPOOL_SIZE), Non-blocking I/O vs CPU bound tasks',
    description: 'System calls (epoll/kqueue) vs Thread Pool offloading for fs, crypto, zlib, dns.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Thread Pool**: Worker pool (default: 4) for tasks lacking OS async support (\`fs\`, \`crypto\`, \`zlib\`, \`dns\`).
- **Non-blocking I/O**: Direct kernel notifications (\`epoll\`/\`kqueue\`) with 0 thread pool overhead.`,
    keyNotes: `### Key Takeaways & Mental Models

- Network sockets never use the Thread Pool (they use kernel non-blocking sockets).
- Scale thread pool via \`UV_THREADPOOL_SIZE=16\` for heavy crypto workloads.`,
    fullTopic: `# Libuv Concurrency & Thread Pool Architecture`,
    markdownNotes: `# Libuv Concurrency & Thread Pool Architecture`,
    questionsMarkdown: `### Top Interview Questions

1. **What operations utilize Libuv thread pool?**
   - \`fs\`, \`crypto.pbkdf2\`, \`zlib\`, and \`dns.lookup\`.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t3',
    courseId: 'course-domain-2',
    orderIndex: 2,
    title: 'Streams, Buffers & Backpressure: Readable, Writable, Duplex, Transform, pipeline()',
    description: 'Memory-safe chunk streaming, highWaterMark limits, and automatic backpressure with pipeline.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Buffer**: Fixed-size raw binary memory allocation outside V8.
- **Stream**: Chunk-by-chunk processing interface for large data.
- **Backpressure**: Flow-control signal when consumer is slower than producer.`,
    keyNotes: `### Key Takeaways & Mental Models

- Always use \`pipeline()\` over \`.pipe()\` for automatic error handling and resource cleanup.
- Prevents loading gigabytes into RAM.`,
    fullTopic: `# Streams & Backpressure

\`\`\`javascript
const { pipeline } = require('stream/promises');
await pipeline(fs.createReadStream('src.log'), zlib.createGzip(), fs.createWriteStream('out.gz'));
\`\`\``,
    markdownNotes: `# Streams & Backpressure`,
    questionsMarkdown: `### Top Interview Questions

1. **Why is \`pipeline()\` preferred over \`.pipe()\`?**
   - Automatically cleans up file descriptors and prevents memory leaks on error.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t4',
    courseId: 'course-domain-2',
    orderIndex: 3,
    title: 'Scaling Node.js: Cluster Module, Child Processes (fork/exec/spawn), Worker Threads (Piscina)',
    description: 'Multi-core scaling patterns, IPC communication, shared ArrayBuffers for CPU intensive tasks.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Cluster Module**: Forking multiple processes sharing one server port.
- **Worker Threads**: Lightweight threads sharing memory via \`SharedArrayBuffer\`.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use **Cluster** for scaling HTTP servers across CPU cores.
- Use **Worker Threads** for CPU-intensive data transformations.`,
    fullTopic: `# Scaling Node.js: Processes vs Worker Threads`,
    markdownNotes: `# Scaling Node.js: Processes vs Worker Threads`,
    questionsMarkdown: `### Top Interview Questions

1. **When to use Worker Threads vs Cluster?**
   - Worker Threads for shared memory CPU tasks; Cluster for network request balancing.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t5',
    courseId: 'course-domain-2',
    orderIndex: 4,
    title: 'Security & Auth: JWT (Access vs Refresh token), Sessions/Redis, CORS, CSRF, XSS, Rate Limiting',
    description: 'Authentication architecture, cookie security (HttpOnly, SameSite), helmet headers, sanitization.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **JWT**: Stateless cryptographically signed token.
- **XSS**: Malicious scripts executed in browser.
- **CSRF**: Forged unauthorized cross-origin requests.
- **SameSite Cookie**: Blocks cookie from being sent on cross-site requests.`,
    keyNotes: `### Key Takeaways & Mental Models

- Store Refresh Token in \`HttpOnly, Secure, SameSite=Strict\` cookie.
- Never store JWT access tokens in \`localStorage\` due to XSS vulnerability.`,
    fullTopic: `# Security & Authentication Architecture`,
    markdownNotes: `# Security & Authentication Architecture`,
    questionsMarkdown: `### Top Interview Questions

1. **How to protect cookies against CSRF?**
   - Set \`SameSite=Strict\` or \`SameSite=Lax\` and validate anti-CSRF tokens.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd2-t6',
    courseId: 'course-domain-2',
    orderIndex: 5,
    title: 'API Architectures: REST vs GraphQL vs WebSockets vs gRPC (HTTP/2 Protocol)',
    description: 'Protocol trade-offs, over/under-fetching, bidirectional streaming, Protocol Buffers.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-backend',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **REST**: Resource-oriented HTTP API.
- **GraphQL**: Client-defined query language.
- **WebSocket**: Bidirectional persistent TCP socket.
- **gRPC**: Binary Protocol Buffer RPC over HTTP/2.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use **gRPC** for internal microservice communication.
- Use **WebSockets** for live trading/chat feeds.
- Use **REST** for public consumer APIs.`,
    fullTopic: `# API Protocol Comparison Matrix`,
    markdownNotes: `# API Protocol Comparison Matrix`,
    questionsMarkdown: `### Top Interview Questions

1. **Why is gRPC faster than REST?**
   - Binary Protobuf serialization + HTTP/2 multiplexing.`,
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
    title: 'Database Types & Trade-offs: Relational (Postgres/MySQL) vs Document (MongoDB) vs Key-Value (Redis)',
    description: 'Schema flexibility, relational joins, normalization vs denormalization patterns.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-db',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **RDBMS**: Relational SQL database with strict schemas and ACID.
- **Document DB**: Semi-structured JSON/BSON documents.
- **Key-Value DB**: In-memory high throughput store (\(O(1)\)).`,
    keyNotes: `### Key Takeaways & Mental Models

- Choose SQL for financial transactions and complex joins.
- Choose MongoDB for dynamic schemas and hierarchical documents.
- Choose Redis for session caching and rate limits.`,
    fullTopic: `# Database Selection & Trade-offs`,
    markdownNotes: `# Database Selection & Trade-offs`,
    questionsMarkdown: `### Top Interview Questions

1. **When to denormalize in SQL?**
   - When join bottlenecks dominate high-frequency read queries.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t2',
    courseId: 'course-domain-3',
    orderIndex: 1,
    title: 'Indexing Mechanics: B-Tree vs Hash Index, Clustered vs Non-Clustered, Composite Indices',
    description: 'Index selectivity, Leftmost Prefix Rule, index scan vs index seek.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-db',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **B-Tree Index**: Balanced tree supporting range and equality queries in \(O(\log N)\).
- **Clustered Index**: Physical row ordering on disk (1 per table).
- **Leftmost Prefix Rule**: Composite index \`(A, B)\` only accelerates queries filtering by \`A\` or \`A, B\`.`,
    keyNotes: `### Key Takeaways & Mental Models

- Indexes speed up reads but add disk write overhead on INSERT/UPDATE.
- Ensure composite index order matches query WHERE and ORDER BY clauses.`,
    fullTopic: `# Database Indexing Mechanics

\`\`\`sql
CREATE INDEX idx_user_status ON users(org_id, status);
\`\`\``,
    markdownNotes: `# Database Indexing Mechanics`,
    questionsMarkdown: `### Top Interview Questions

1. **Why can't composite index on \`(A, B)\` accelerate \`WHERE B = 5\`?**
   - Violates the Leftmost Prefix Rule because tree is ordered by \`A\` first.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t3',
    courseId: 'course-domain-3',
    orderIndex: 2,
    title: 'ACID & Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable, Locking',
    description: 'Dirty reads, Non-repeatable reads, Phantom reads, MVCC (Multi-Version Concurrency Control).',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-db',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **ACID**: Atomicity, Consistency, Isolation, Durability.
- **Dirty Read**: Reading uncommitted transient data.
- **Non-Repeatable Read**: Row value changes between 2 reads in same transaction.
- **Phantom Read**: New rows appear in range query on re-read.`,
    keyNotes: `### Key Takeaways & Mental Models

- Postgres default is **Read Committed** with MVCC.
- Higher isolation levels reduce concurrency and increase transaction retry rates.`,
    fullTopic: `# Transaction Isolation Levels & MVCC`,
    markdownNotes: `# Transaction Isolation Levels & MVCC`,
    questionsMarkdown: `### Top Interview Questions

1. **How does MVCC prevent read locks?**
   - Stores multiple row versions (\`xmin\`/\`xmax\`) so readers never block writers.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t4',
    courseId: 'course-domain-3',
    orderIndex: 3,
    title: 'MongoDB Architecture: Aggregation Pipeline, Sharding, Replica Sets, Write Concerns',
    description: 'Replica set elections, Oplog replication, Shard Keys, $match / $group / $lookup optimization.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-db',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **Replica Set**: Primary + Secondary nodes for failover.
- **Sharding**: Horizontal partitioning across machines via Shard Key.
- **Write Concern**: Confirmation level (\`w: "majority"\`) before write acknowledgment.`,
    keyNotes: `### Key Takeaways & Mental Models

- Never use monotonically increasing shard keys (avoids write hotspotting).
- Always place \`$match\` as early as possible in Aggregation Pipelines.`,
    fullTopic: `# MongoDB Architecture & Sharding`,
    markdownNotes: `# MongoDB Architecture & Sharding`,
    questionsMarkdown: `### Top Interview Questions

1. **What causes hotspotting in MongoDB sharding?**
   - Monotonic shard keys (like timestamps) sending all writes to one shard.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd3-t5',
    courseId: 'course-domain-3',
    orderIndex: 4,
    title: 'Query Optimization & Performance: EXPLAIN ANALYZE, Connection Pooling, N+1 Problem',
    description: 'Diagnosing slow queries, Index condition pushdown, PgBouncer pooling, batch fetching.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-db',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **EXPLAIN ANALYZE**: Runs query and prints actual execution node timings.
- **N+1 Problem**: 1 parent query + N individual child queries.
- **Connection Pool**: Reusable TCP/DB connection manager (e.g. PgBouncer).`,
    keyNotes: `### Key Takeaways & Mental Models

- Fix N+1 problems via JOINs, batch \`WHERE IN (...)\`, or DataLoader.
- Keep connection pool sized close to available CPU cores.`,
    fullTopic: `# SQL Query Tuning & Optimization`,
    markdownNotes: `# SQL Query Tuning & Optimization`,
    questionsMarkdown: `### Top Interview Questions

1. **Index Scan vs Seq Scan:**
   - Index Scan traverses B-Tree; Seq Scan reads entire table disk blocks sequentially.`,
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
    title: 'Caching Patterns & Redis: Cache-Aside, Write-Through, Write-Back, Cache Stampede, Eviction Policies',
    description: 'Distributed caching strategies, LRU/LFU eviction, probabilistic early expiration (XFetch).',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Cache-Aside**: Read cache → on miss read DB and write cache.
- **Write-Through**: Synchronous cache + DB write.
- **Cache Stampede**: Mass concurrent DB queries when high-traffic key expires.`,
    keyNotes: `### Key Takeaways & Mental Models

- Add jitter to TTLs to prevent simultaneous cache stampede expiration.
- Use Bloom filters to protect against Cache Penetration.`,
    fullTopic: `# Distributed Caching Architectures`,
    markdownNotes: `# Distributed Caching Architectures`,
    questionsMarkdown: `### Top Interview Questions

1. **How to protect cache from non-existent key requests?**
   - Use Bloom filter or cache null values with short TTL.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t2',
    courseId: 'course-domain-4',
    orderIndex: 1,
    title: 'Load Balancing & Traffic Distribution: L4 vs L7, Consistent Hashing, Algorithms (Round Robin, Least Conn)',
    description: 'Transport layer vs Application layer routing, TLS termination, virtual nodes in consistent hashing.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'medium',
    definitions: `### Key Definitions & Terminology

- **L4 Load Balancer**: Layer 4 TCP/UDP load distribution.
- **L7 Load Balancer**: Layer 7 HTTP/HTTPS application routing.
- **Consistent Hashing**: Hash ring mapping keys to servers with minimal re-shuffling.`,
    keyNotes: `### Key Takeaways & Mental Models

- L4 has raw speed; L7 offers path routing, cookie affinity, and SSL termination.
- Virtual nodes ensure uniform key distribution in consistent hashing rings.`,
    fullTopic: `# Load Balancing & Consistent Hashing`,
    markdownNotes: `# Load Balancing & Consistent Hashing`,
    questionsMarkdown: `### Top Interview Questions

1. **Why virtual nodes in consistent hashing?**
   - Prevents hotspots and ensures uniform key distribution.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t3',
    courseId: 'course-domain-4',
    orderIndex: 2,
    title: 'Asynchronous Queues & Event Streaming: Kafka vs RabbitMQ, Dead Letter Queues, Idempotency',
    description: 'Partitioning, consumer groups, AMQP message acknowledgements, deduplication keys.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Message Queue (RabbitMQ)**: Broker manages message delivery and deletes on ACK.
- **Event Log (Kafka)**: Partitioned append-only persistent commit log.
- **Dead Letter Queue (DLQ)**: Queue holding unprocessable poison messages.
- **Idempotency**: Processing same message repeatedly yields identical outcome.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use Kafka for high-throughput streaming event pipelines.
- Use RabbitMQ for complex task routing and work queues.
- Always use Idempotency Keys to prevent duplicate transactions.`,
    fullTopic: `# Message Queues & Event Streaming`,
    markdownNotes: `# Message Queues & Event Streaming`,
    questionsMarkdown: `### Top Interview Questions

1. **How to achieve exactly-once consumer semantics?**
   - Store processed message IDs in DB with unique constraints inside same transaction.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t4',
    courseId: 'course-domain-4',
    orderIndex: 3,
    title: 'CAP & PACELC Theorems: Consistency vs Availability, Partition Tolerance, Sharding Strategies',
    description: 'Distributed trade-offs, master-slave vs leaderless replication (Dynamo), split-brain scenarios.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **CAP**: Consistency, Availability, Partition Tolerance (choose 2 under partition).
- **PACELC**: If Partition (P): Availability (A) or Consistency (C); Else (E): Latency (L) or Consistency (C).
- **Split-Brain**: Cluster partitions causing multiple nodes to claim leadership.`,
    keyNotes: `### Key Takeaways & Mental Models

- Network partitions are inevitable; distributed systems choose CP or AP.`,
    fullTopic: `# CAP & PACELC Distributed Theorems`,
    markdownNotes: `# CAP & PACELC Distributed Theorems`,
    questionsMarkdown: `### Top Interview Questions

1. **Why CA systems are impossible over WAN?**
   - Network links will fail, forcing Partition Tolerance (P).`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd4-t5',
    courseId: 'course-domain-4',
    orderIndex: 4,
    title: 'API Gateway & Rate Limiting: Token Bucket, Leaky Bucket, Sliding Window Counter, Distributed Rate Limiter',
    description: 'Redis sliding window logs with Lua scripts, gateway authentication, request transformation.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-sysdesign',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Token Bucket**: Token fill rate with burst capacity allowance.
- **Leaky Bucket**: Smooth constant-rate processing queue.
- **Sliding Window Counter**: Redis-backed dynamic window request limiter.`,
    keyNotes: `### Key Takeaways & Mental Models

- Always execute Redis rate limiters via **Lua scripts** for atomic operation.`,
    fullTopic: `# API Gateway & Rate Limiting Algorithms`,
    markdownNotes: `# API Gateway & Rate Limiting Algorithms`,
    questionsMarkdown: `### Top Interview Questions

1. **Why use Lua scripts in Redis rate limiters?**
   - Guarantees atomic execution and avoids race conditions.`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },

  // ==========================================
  // Domain 5: Machine Coding & Polyfills (Night Desk Sprints) (4 Topics)
  // ==========================================
  {
    id: 'd5-t1',
    courseId: 'course-domain-5',
    orderIndex: 0,
    title: 'Core JavaScript Polyfills: Promise.all, Promise.allSettled, Function.prototype.bind/call/apply, Array methods',
    description: 'Production-ready polyfill implementations with edge-case handling and specification conformance.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machine-coding',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Polyfill**: Code providing modern features on older browser environments.
- **\`Promise.all\` Polyfill**: Tracks completion counter, rejects on first error.`,
    keyNotes: `### Key Takeaways & Mental Models

- Handle non-array inputs, empty arrays, and non-promise values using \`Promise.resolve()\`.`,
    fullTopic: `# Polyfills: Promise.all Implementation

\`\`\`javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('Array required'));
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};
\`\`\``,
    markdownNotes: `# Polyfills: Promise.all Implementation`,
    questionsMarkdown: `### Machine Coding Prompts

1. **Implement \`Function.prototype.myBind\`.**
2. **Implement \`Array.prototype.myReduce\`.**`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t2',
    courseId: 'course-domain-5',
    orderIndex: 1,
    title: 'Utility Functions: debounce (leading/trailing), throttle, deepClone (handling circular refs), memoize',
    description: 'Building robust utility functions with WeakMap circular reference tracking and timer cancel APIs.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machine-coding',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Deep Clone**: Complete recursive copy of objects and nested references.
- **WeakMap**: Key-value map holding weak object references to detect cycles.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use WeakMap to break infinite loops with circular object structures.`,
    fullTopic: `# Deep Clone with Circular References

\`\`\`javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);
  for (const k of Object.keys(obj)) {
    clone[k] = deepClone(obj[k], hash);
  }
  return clone;
}
\`\`\``,
    markdownNotes: `# Deep Clone with Circular References`,
    questionsMarkdown: `### Machine Coding Prompts

1. **Implement \`debounce\` supporting \`{ leading: true, trailing: true }\`.**`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t3',
    courseId: 'course-domain-5',
    orderIndex: 2,
    title: 'Design Patterns: Custom Event Emitter (pub/sub), LRU Cache with Doubly Linked List',
    description: 'Observer pattern with once() and unsubscribe methods; \(O(1)\) LRU Cache.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machine-coding',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **Event Emitter**: Pub/sub event broker pattern.
- **LRU Cache**: Least Recently Used cache with \(O(1)\) get/put operations.`,
    keyNotes: `### Key Takeaways & Mental Models

- Combine Hash Map + Doubly Linked List for \(O(1)\) LRU operations.`,
    fullTopic: `# Custom Event Emitter Pattern

\`\`\`javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(e, fn) {
    (this.events[e] = this.events[e] || []).push(fn);
    return () => this.off(e, fn);
  }
  emit(e, ...args) {
    (this.events[e] || []).forEach(fn => fn(...args));
  }
  off(e, fn) {
    this.events[e] = (this.events[e] || []).filter(f => f !== fn);
  }
}
\`\`\``,
    markdownNotes: `# Custom Event Emitter Pattern`,
    questionsMarkdown: `### Machine Coding Prompts

1. **Implement an LRU Cache with capacity limit.**`,
    questions: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    archived: false,
  },
  {
    id: 'd5-t4',
    courseId: 'course-domain-5',
    orderIndex: 3,
    title: 'React Machine Coding: Autocomplete / Typeahead, Infinite Scroll with IntersectionObserver, Star Rating, File Explorer',
    description: 'Component architecture, keyboard accessibility (a11y), virtualization, recursive folder trees.',
    status: 'yet_to_start',
    learnedAt: today,
    categoryId: 'cat-machine-coding',
    difficulty: 'hard',
    definitions: `### Key Definitions & Terminology

- **IntersectionObserver**: Browser API detecting when elements intersect viewport.
- **Recursive Component**: Component that renders itself for nested trees.`,
    keyNotes: `### Key Takeaways & Mental Models

- Use IntersectionObserver instead of scroll event listeners for infinite loading.`,
    fullTopic: `# React Machine Coding: Infinite Scroll

\`\`\`javascript
function InfiniteList({ loadMore, hasMore }) {
  const observerRef = useRef();
  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) loadMore();
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore, loadMore]);
  return <div ref={lastElementRef} className="h-4" />;
}
\`\`\``,
    markdownNotes: `# React Machine Coding: Infinite Scroll`,
    questionsMarkdown: `### Machine Coding Prompts

1. **Build a recursive File Explorer with create/delete folder actions.**`,
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

export const SEED_SESSIONS: RecallSession[] = []

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