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
    definitions: `### Key Terminology & Definitions

- **Execution Context (EC)**: The internal wrapper created by the JS engine containing the code currently evaluated, its variable environment, scope chain, and \`this\` binding.
- **Call Stack**: A LIFO (Last-In-First-Out) data structure that records where in the program execution is currently happening.
- **Creation Phase**: The compile-step where the JS engine parses identifiers, allocates memory for variables (\`undefined\` for \`var\`, uninitialized for \`let\`/\`const\`), and hoists full function bodies.
- **Execution Phase**: The sequential line-by-line interpretation and assignment of evaluated expressions.
- **Memory Heap**: An unstructured region of memory used for dynamic memory allocation of reference types (Objects, Arrays, Closures).`,
    markdownNotes: `# Execution Context & Memory

### Execution Context Lifecycle
When a JavaScript script runs, the engine creates the **Global Execution Context (GEC)**. Every time a function is invoked, a new **Function Execution Context (FEC)** is pushed onto the Call Stack.

\`\`\`javascript
var a = 10;
function calculateSum(x, y) {
  var total = x + y;
  return total;
}
var result = calculateSum(a, 20);
\`\`\`

### Step-by-Step Breakdown:
1. **Global Creation Phase**:
   - \`window\` / \`global\` object created.
   - \`this\` bound to global object.
   - Variable \`a\` allocated with \`undefined\`.
   - Function \`calculateSum\` copied entirely into heap with pointer in lexical scope.
   - Variable \`result\` allocated with \`undefined\`.
2. **Global Execution Phase**:
   - \`a = 10\` assigned.
   - \`calculateSum(10, 20)\` invoked → pushes new FEC onto Call Stack.
3. **Function FEC Lifecycle**:
   - Creation phase: parameters \`x=10, y=20\`, \`total=undefined\`.
   - Execution phase: \`total = 30\`, returns \`30\`.
   - Stack frame popped off and cleaned up by Mark-and-Sweep Garbage Collector.`,
    questionsMarkdown: `### Top Interview Questions & Code Challenges

1. **What is the difference between Call Stack overflow and Memory Leak?**
   - *Call Stack Overflow*: Exceeding the maximum call frame depth (e.g. infinite un-terminated recursion).
   - *Memory Leak*: Unused objects in the Memory Heap that retain active references from the root (e.g. uncleared global timers or stale event listeners).

2. **Output Prediction Challenge:**
   \`\`\`javascript
   function test() {
     console.log(a);
     console.log(foo());
     var a = 1;
     function foo() { return 2; }
   }
   test();
   \`\`\`
   - *Output*: \`undefined\`, then \`2\`.`,
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
    definitions: `### Key Terminology & Definitions

- **Hoisting**: The behavior where variable and function declarations are moved to the top of their enclosing scope during the compilation/creation phase.
- **Lexical Scope**: Scope defined by the physical location of variables/functions in the source code at authoring time.
- **Temporal Dead Zone (TDZ)**: The period of execution between entering a block scope and the line where a \`let\` or \`const\` variable is initialized. Accessing it throws a \`ReferenceError\`.
- **Scope Chain**: The hierarchy of lexical environments searched from inner to outer when resolving an identifier.`,
    markdownNotes: `# Hoisting & Temporal Dead Zone (TDZ)

### var vs let / const
| Property | \`var\` | \`let\` / \`const\` |
| :--- | :--- | :--- |
| **Scope** | Function Scope | Block Scope \`{ ... }\` |
| **Hoisting** | Initialized as \`undefined\` | Hoisted in **uninitialized** state |
| **Re-declaration** | Allowed | SyntaxError |
| **Global Object Property** | Yes (\`window.x\`) | No |

\`\`\`javascript
{
  // TDZ for 'score' starts here
  // console.log(score); // Throws ReferenceError: Cannot access 'score' before initialization
  let score = 95; // TDZ ends here
  console.log(score); // 95
}
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Why does TDZ exist in JavaScript?**
   - To catch bugs where variables are read before their intended assignment and to make \`const\` truly immutable from its declaration point.
2. **Predict Output:**
   \`\`\`javascript
   var x = 10;
   function foo() {
     console.log(x);
     let x = 20;
   }
   foo();
   \`\`\`
   - *Result*: Throws \`ReferenceError\` because \`let x\` inside \`foo\` shadows the outer variable and creates an inner TDZ.`,
    questions: [
      {
        id: 'd1-t2-q1',
        question: 'What error occurs when accessing a `let` variable before declaration?',
        answer: 'ReferenceError due to the Temporal Dead Zone (TDZ).',
        correctCount: 0,
        incorrectCount: 0,
      }
    ],
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
    definitions: `### Key Terminology & Definitions

- **Closure**: A function bundled together with references to its surrounding lexical environment, allowing it to access outer variables even after the outer function has returned.
- **Encapsulation**: Hiding internal object details and exposing only a public API.
- **Stale Closure**: A bug where a closure captures an outdated variable snapshot from a previous render cycle (common in React \`useEffect\` / \`useCallback\`).`,
    markdownNotes: `# Closures & Encapsulation

### Practical Module Pattern
\`\`\`javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable hidden from outer scope

  return {
    deposit(amount) {
      if (amount > 0) balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50); // 150
console.log(account.balance); // undefined (cannot be tampered with)
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **How do you fix a Stale Closure in a React \`useEffect\` interval?**
   - Use the functional state updater \`setCount(prev => prev + 1)\` or pass dependencies properly in the dependency array.`,
    questions: [
      {
        id: 'd1-t3-q1',
        question: 'What is a closure in JavaScript?',
        answer: 'A function that retains access to its outer lexical scope variables even after the outer function execution has finished.',
        correctCount: 0,
        incorrectCount: 0,
      }
    ],
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
    definitions: `### Key Terminology & Definitions

- **\`this\` Keyword**: A reference determined by *how* a function is called (call-site) rather than where it is declared (except for arrow functions).
- **Implicit Binding**: When a function is called with a context object (\`obj.method()\`).
- **Explicit Binding**: Manually supplying context using \`.call()\`, \`.apply()\`, or \`.bind()\`.
- **Lexical Binding**: Arrow functions \`() => {}\` do not have their own \`this\`; they inherit \`this\` from their enclosing lexical scope.`,
    markdownNotes: `# The \`this\` Keyword in JavaScript

### 4 Rules of \`this\` Resolution:
1. **New Binding**: \`new Foo()\` → \`this\` points to the freshly created object.
2. **Explicit Binding**: \`foo.call(ctx, arg1)\` / \`foo.apply(ctx, [args])\` / \`foo.bind(ctx)\`.
3. **Implicit Binding**: \`user.greet()\` → \`this\` is \`user\`.
4. **Default Binding**: Standalone invocation \`foo()\` → \`window\` in non-strict mode, \`undefined\` in strict mode (\`"use strict"\`).`,
    questionsMarkdown: `### Interview Questions

1. **Can you re-bind an arrow function using \`.bind()\`?**
   - No, arrow functions inherit \`this\` lexically; calling \`.bind()\` on an arrow function has no effect on its context.`,
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
    definitions: `### Key Terminology & Definitions

- **Prototype Chain**: The delegation lookup mechanism where property lookups traverse up \`__proto__\` until found or reaching \`null\`.
- **\`prototype\`**: Property on constructor functions used to build \`__proto__\` on instances created via \`new\`.
- **\`__proto__\`**: Accessor property on instances pointing to their prototype delegate.`,
    markdownNotes: `# Prototypal Inheritance & Delegation

JavaScript uses **prototypal delegation** rather than classical class copying.

\`\`\`javascript
const animal = {
  eats: true,
  walk() { return "Walking..."; }
};

const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.walk()); // Found on animal via Prototype Chain delegation
console.log(Object.getPrototypeOf(rabbit) === animal); // true
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **What is the root of the prototype chain?**
   - \`Object.prototype.__proto__\` which is \`null\`.`,
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
    definitions: `### Key Terminology & Definitions

- **Event Loop**: Continuous loop checking if the Call Stack is empty to process queued asynchronous callbacks.
- **Microtask Queue**: High priority queue (Promises, \`queueMicrotask\`, \`MutationObserver\`) drained completely before any macrotask or UI render.
- **Macrotask Queue**: Task queue (\`setTimeout\`, \`setInterval\`, I/O, UI events) processed one per event loop turn.`,
    markdownNotes: `# Browser Event Loop & Priority Queues

### Priority Sequence:
1. Synchronous Call Stack execution.
2. **All Microtasks** (Queue drained to 0).
3. Browser UI Rendering & Animation Frames.
4. **One Macrotask** from Task Queue.
5. Repeat.

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2 (Macrotask)'), 0);
Promise.resolve().then(() => console.log('3 (Microtask)'));
queueMicrotask(() => console.log('4 (Microtask)'));
console.log('5');
// Output: 1, 5, 3, 4, 2
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **What happens if a microtask schedules another microtask recursively?**
   - It starves the event loop, completely blocking macrotasks and browser UI rendering (UI freeze).`,
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
    definitions: `### Key Terminology & Definitions

- **Promise**: An object representing eventual completion (or failure) of an asynchronous operation and its resulting value.
- **States**: \`pending\`, \`fulfilled\`, or \`rejected\`.
- **\`Promise.all\`**: Fails-fast on first rejection; resolves when all fulfill.
- **\`Promise.allSettled\`**: Never rejects early; returns status array of all promises.
- **\`Promise.race\`**: Settles with the first settled promise (fulfilled or rejected).
- **\`Promise.any\`**: Resolves with first fulfilled promise; rejects with AggregateError if all reject.`,
    markdownNotes: `# Promises & Combinators

### Combinators Comparison Table
| Combinator | Short-circuits on? | Return Value |
| :--- | :--- | :--- |
| \`Promise.all\` | First Rejection | Array of resolved values |
| \`Promise.allSettled\` | Never | Array of \`{status, value/reason}\` |
| \`Promise.race\` | First Settle | First value/reason |
| \`Promise.any\` | First Fulfillment | First fulfilled value |`,
    questionsMarkdown: `### Interview Questions

1. **How does \`async/await\` work under the hood?**
   - It is syntactic sugar over Promises combined with Generator functions (\`yield\`) run by an automated coroutine runner.`,
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
    definitions: `### Key Terminology & Definitions

- **Debounce**: Delays function execution until a specified quiet period has elapsed with no new triggers.
- **Throttle**: Enforces a maximum execution rate of once per time window regardless of invocation frequency.
- **Event Delegation**: Attaching a single event listener to a parent container to manage events from all current and future child elements using \`e.target\`.
- **Event Phases**: 1. Capturing Phase (window down to target) → 2. Target Phase → 3. Bubbling Phase (target up to window).`,
    markdownNotes: `# Event Propagation & Frequency Throttling

### 3 Phases of DOM Events
\`\`\`
Window → Document → <body> → <div> (1. Capturing Phase)
                               ↓
                        [ Button Target ] (2. Target Phase)
                               ↓
Window ← Document ← <body> ← <div> (3. Bubbling Phase)
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Difference between \`e.target\` and \`e.currentTarget\`?**
   - \`e.target\`: The actual DOM element that triggered the event.
   - \`e.currentTarget\`: The element that has the active event listener attached.`,
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
    definitions: `### Key Terminology & Definitions

- **Fiber Architecture**: React 16+ reimplementation of the reconciliation engine using an incremental, interruptible singly-linked list of work units (Fibers).
- **Reconciliation**: The algorithm React uses to diff two Virtual DOM trees and compute the minimal set of DOM mutations.
- **Render Phase**: Asynchronous, interruptible phase computing side effects (flags).
- **Commit Phase**: Synchronous phase applying mutations to the real DOM and running layout effects.`,
    markdownNotes: `# React Fiber & Reconciliation

### Fiber Linked-List Pointers
Each Fiber node contains 3 structural pointers:
- \`child\`: Points to its first direct child.
- \`sibling\`: Points to its next sibling.
- \`return\`: Points back to its parent Fiber.

\`\`\`javascript
// Simplified Fiber unit structure
const fiberNode = {
  type: 'div',
  props: { className: 'card' },
  child: childFiber,
  sibling: nextSiblingFiber,
  return: parentFiber,
  alternate: currentFiber, // Double buffering
  flags: Placement | Update,
};
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Why does React need \`key\` prop in lists?**
   - Keys provide stable identity across renders, allowing React to match children in \(O(n)\) time instead of tearing down and recreating entire subtrees.`,
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
    definitions: `### Key Terminology & Definitions

- **Libuv**: Multi-platform C library providing asynchronous I/O based on event loops and thread pools.
- **Timers Phase**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
- **Poll Phase**: Retrieves new I/O events; blocks for incoming connections if no other tasks are queued.
- **Check Phase**: Executes callbacks scheduled specifically by \`setImmediate\`.
- **\`process.nextTick\`**: Runs immediately after the current operation finishes, before the event loop advances.`,
    markdownNotes: `# Node.js Libuv Event Loop Phases

### The 6 Execution Phases:
\`\`\`
┌───────────────────────────┐
│          Timers           │ ─── setTimeout, setInterval
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│     Pending Callbacks     │ ─── I/O callbacks deferred to next loop iteration
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│       Idle, Prepare       │ ─── Internal Libuv only
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│           Poll            │ ─── Retrieve new I/O events; execute I/O callbacks
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│           Check           │ ─── setImmediate callbacks
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│      Close Callbacks      │ ─── e.g. socket.on('close', ...)
└───────────────────────────┘
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **\`process.nextTick()\` vs \`setImmediate()\`?**
   - \`process.nextTick()\` fires immediately before the event loop continues (microtask level).
   - \`setImmediate()\` fires on the upcoming **Check Phase** of the Libuv cycle.`,
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
    definitions: `### Key Terminology & Definitions

- **Thread Pool**: A pool of worker threads (default: 4) used by Libuv for tasks where OS async primitives do not exist (fs, crypto, zlib, dns lookup).
- **Non-blocking Sockets**: Network I/O handled directly by the OS kernel event notification system (\`epoll\` on Linux, \`kqueue\` on macOS, \`IOCP\` on Windows) with 0 thread pool overhead.`,
    markdownNotes: `# Libuv Concurrency & Thread Pool

### What uses the Libuv Thread Pool?
1. **File System (\`fs\`)**: All synchronous and asynchronous file system operations.
2. **Crypto**: \`crypto.pbkdf2\`, \`crypto.scrypt\`, \`crypto.randomBytes\`.
3. **Compression**: \`zlib\` asynchronous APIs.
4. **DNS**: \`dns.lookup\` (which resolves via system \`getaddrinfo\`).`,
    questionsMarkdown: `### Interview Questions

1. **How do you scale thread pool size for high-crypto workloads?**
   - Set environment variable \`UV_THREADPOOL_SIZE=16\` before the Node process boots.`,
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
    definitions: `### Key Terminology & Definitions

- **Buffer**: Fixed-size raw memory allocation outside the V8 heap for binary data.
- **Stream**: An abstract interface for working with streaming data sequentially chunk-by-chunk.
- **Backpressure**: The flow-control mechanism signaled when a consumer is slower than a producer, preventing memory exhaustion.
- **\`highWaterMark\`**: The threshold buffer size (default 16KB for object mode, 64KB for byte streams) before \`stream.write()\` returns \`false\`.`,
    markdownNotes: `# Node.js Streams & Backpressure

### Safe Pipeline Pattern:
\`\`\`javascript
const { pipeline } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

async function compressFile(source, target) {
  await pipeline(
    fs.createReadStream(source),
    zlib.createGzip(),
    fs.createWriteStream(target)
  );
  console.log('Stream completed with automatic backpressure & error cleanup.');
}
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Why is \`pipeline()\` preferred over \`.pipe()\`?**
   - \`pipeline()\` properly destroys streams and cleans up file descriptors on error, whereas \`.pipe()\` leaks memory on unexpected stream closure.`,
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
    definitions: `### Key Terminology & Definitions

- **Cluster Module**: Enables creating child processes that share server ports across multi-core CPUs.
- **Child Process (\`spawn\` / \`fork\`)**: Spawns isolated OS processes with independent memory and IPC channels.
- **Worker Threads**: Spawns lightweight OS threads that can share memory using \`SharedArrayBuffer\`.`,
    markdownNotes: `# Scaling Node.js: Multi-Processing vs Multi-Threading

| Technology | Memory Model | Best Use Case |
| :--- | :--- | :--- |
| **Cluster Module** | Isolated V8 instances per core | Horizontal scale of HTTP servers |
| **Worker Threads** | Shared memory (\`SharedArrayBuffer\`) | CPU-heavy data parsing, image processing |
| **\`child_process.spawn\`** | Independent OS process | Executing shell commands / external binaries |`,
    questionsMarkdown: `### Interview Questions

1. **When should you use Worker Threads over Cluster module?**
   - Use Worker Threads for shared-memory CPU computation (e.g. video transcode, AI tokenization); use Cluster for network request distribution.`,
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
    definitions: `### Key Terminology & Definitions

- **JWT (JSON Web Token)**: Stateless, cryptographically signed token containing claims.
- **XSS (Cross-Site Scripting)**: Injecting malicious client-side scripts executed in a user's browser.
- **CSRF (Cross-Site Request Forgery)**: Tricking an authenticated user's browser into sending unauthorized requests.
- **SameSite Cookie**: Attribute (\`Strict\` / \`Lax\`) preventing cookies from being sent in cross-site requests.`,
    markdownNotes: `# Backend Security & Authentication

### Modern Dual-Token Auth Architecture
1. **Short-lived Access Token** (5-15 mins): Kept in memory.
2. **Long-lived Refresh Token** (7-30 days): Stored in an **\`HttpOnly, Secure, SameSite=Strict\`** cookie and tracked in Redis for instant revocation.`,
    questionsMarkdown: `### Interview Questions

1. **Why should JWT access tokens never be stored in \`localStorage\`?**
   - Because any XSS vulnerability in any dependency can read \`localStorage\` and exfiltrate user credentials.`,
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
    definitions: `### Key Terminology & Definitions

- **REST**: Stateless resource-oriented HTTP architecture with standard verbs.
- **GraphQL**: Query language allowing clients to declare exactly the data shape required.
- **WebSocket**: Full-duplex, persistent bidirectional TCP connection over single socket.
- **gRPC**: High-performance RPC framework using HTTP/2 binary framing and Protocol Buffers.`,
    markdownNotes: `# API Protocol Comparison

| Protocol | Transport | Serialization | Best Use Case |
| :--- | :--- | :--- | :--- |
| **REST** | HTTP/1.1 or HTTP/2 | JSON | Public APIs, CRUD |
| **GraphQL** | HTTP/1.1 or HTTP/2 | JSON | Complex frontend dashboards |
| **WebSockets** | TCP | Binary / Text | Real-time chat, trading feeds |
| **gRPC** | HTTP/2 | Protobuf (Binary) | Microservice-to-microservice IPC |`,
    questionsMarkdown: `### Interview Questions

1. **What gives gRPC massive performance advantages over REST?**
   - Binary Protobuf serialization (smaller payload, fast parse) and HTTP/2 multiplexed streaming over single connection.`,
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
    definitions: `### Key Terminology & Definitions

- **RDBMS**: Relational database relying on structured schemas, foreign keys, and strict ACID guarantees.
- **Document Store**: Stores semi-structured JSON/BSON documents with flexible schemas.
- **Key-Value Store**: High-throughput in-memory data structure store optimized for \(O(1)\) lookups.`,
    markdownNotes: `# SQL vs NoSQL Trade-off Matrix

### Comparison:
- **PostgreSQL**: Strong consistency, complex multi-table joins, relational integrity, JSONB support.
- **MongoDB**: Hierarchical documents, embedded subdocuments, horizontal shard scaling.
- **Redis**: Sub-millisecond latency, caching, rate limiting, pub/sub queues.`,
    questionsMarkdown: `### Interview Questions

1. **When should you denormalize data in SQL?**
   - In read-heavy analytical queries where costly multi-table joins become a severe bottleneck.`,
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
    definitions: `### Key Terminology & Definitions

- **B-Tree Index**: Balanced tree data structure with \(O(\log N)\) search, insert, and range queries.
- **Clustered Index**: Dictates physical ordering of rows on disk (only 1 per table, usually Primary Key).
- **Non-Clustered Index**: Separate structure storing sorted index keys and pointers to table row IDs.
- **Leftmost Prefix Rule**: A composite index on \`(A, B, C)\` can only accelerate queries filtering by \`(A)\`, \`(A, B)\`, or \`(A, B, C)\`.`,
    markdownNotes: `# Database Indexing Mechanics

\`\`\`sql
-- Composite Index Example
CREATE INDEX idx_users_org_status ON users(org_id, status, created_at);

-- FAST (Uses index seek):
SELECT * FROM users WHERE org_id = 42 AND status = 'active';

-- SLOW (Full Table Scan - breaks leftmost prefix rule):
SELECT * FROM users WHERE status = 'active';
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Why does adding too many indexes hurt performance?**
   - Every \`INSERT\`, \`UPDATE\`, and \`DELETE\` must rewrite all secondary index trees, incurring heavy disk I/O overhead.`,
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
    definitions: `### Key Terminology & Definitions

- **ACID**: Atomicity (all-or-nothing), Consistency, Isolation, Durability (persisted on disk).
- **Dirty Read**: Reading uncommitted data from a concurrent transaction that could be rolled back.
- **Non-Repeatable Read**: Re-reading a row returns different values because another transaction modified it.
- **Phantom Read**: Re-running a range query returns newly inserted rows from another committed transaction.`,
    markdownNotes: `# Transaction Isolation Levels

| Isolation Level | Dirty Read | Non-repeatable Read | Phantom Read |
| :--- | :---: | :---: | :---: |
| **Read Uncommitted** | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes |
| **Read Committed** (Postgres default) | ❌ No | ⚠️ Yes | ⚠️ Yes |
| **Repeatable Read** | ❌ No | ❌ No | ⚠️ Yes (No in Postgres MVCC) |
| **Serializable** | ❌ No | ❌ No | ❌ No |`,
    questionsMarkdown: `### Interview Questions

1. **How does MVCC eliminate read locks in PostgreSQL?**
   - MVCC creates row version snapshots (\`xmin\`/\`xmax\`), allowing readers not to block writers and writers not to block readers.`,
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
    definitions: `### Key Terminology & Definitions

- **Replica Set**: Group of MongoDB mongod instances maintaining identical dataset for high availability.
- **Sharding**: Distributing data across multiple machines using a Shard Key.
- **Write Concern (\`w: "majority"\`)**: Acknowledgement level requested before a write is confirmed committed.
- **Aggregation Pipeline**: Multi-stage data transformation framework (\`$match\`, \`$project\`, \`$group\`, \`$unwind\`).`,
    markdownNotes: `# MongoDB Aggregation & Sharding

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", totalSpent: { $sum: "$amount" } } },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **What happens if you pick a monotonically increasing Shard Key (e.g. timestamp)?**
   - It causes **hotspotting** where all writes route to a single shard, ruining horizontal write distribution.`,
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
    definitions: `### Key Terminology & Definitions

- **EXPLAIN ANALYZE**: Executes query in database and outputs real execution plan with actual node timings and cost metrics.
- **N+1 Problem**: Executing 1 query for parent records and N additional queries for child relations.
- **Connection Pool**: Cache of reusable database connections preventing the high cost of TCP + SSL handshakes per request.`,
    markdownNotes: `# Query Tuning & Optimization

### Solving the N+1 Query Problem:
\`\`\`sql
-- BAD (N+1 queries in loop)
SELECT * FROM posts;
-- For each post: SELECT * FROM authors WHERE id = post.author_id;

-- GOOD (Batch IN query or JOIN)
SELECT p.*, a.name AS author_name 
FROM posts p 
JOIN authors a ON p.author_id = a.id;
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **What is the difference between \`Seq Scan\` and \`Index Scan\` in EXPLAIN?**
   - \`Seq Scan\` reads every disk page of the entire table sequentially. \`Index Scan\` traverses the B-Tree directly to target rows.`,
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
    definitions: `### Key Terminology & Definitions

- **Cache-Aside (Lazy Loading)**: Application reads from cache; on miss, reads DB and writes to cache.
- **Write-Through**: Application writes to cache, which synchronously writes to database.
- **Write-Back (Write-Behind)**: Application writes to cache; cache asynchronously persists to DB.
- **Cache Stampede (Thundering Herd)**: High concurrent requests hitting database simultaneously when a popular key expires.`,
    markdownNotes: `# Caching Patterns & Eviction Policies

### Redis Eviction Policies
- \`allkeys-lru\`: Evicts least recently used keys.
- \`volatile-lru\`: Evicts LRU keys among keys with TTL set.
- \`allkeys-lfu\`: Evicts least frequently used keys.

### Preventing Cache Stampede:
1. Mutual exclusion mutex locks.
2. Background refresh with probabilistic early expiration (jitter TTLs).`,
    questionsMarkdown: `### Interview Questions

1. **How do you prevent Cache Penetration for non-existent keys?**
   - Use a **Bloom Filter** before cache/DB lookups or cache empty values with a short TTL.`,
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
    definitions: `### Key Terminology & Definitions

- **L4 Load Balancer**: Operates at TCP/UDP layer without inspecting packet payload (extremely fast, low latency).
- **L7 Load Balancer**: Operates at Application layer (HTTP/HTTPS), inspecting headers, cookies, and URLs for smart routing.
- **Consistent Hashing**: Hashing algorithm mapping keys and nodes to a ring (\(2^{32}\)), minimizing re-shuffling on node addition/removal.`,
    markdownNotes: `# Load Balancing Architectures

### L4 vs L7 Comparison
- **L4 (HAProxy TCP / AWS NLB)**: High throughput, raw TCP forwarding, zero HTTP inspection.
- **L7 (Nginx / Envoy / AWS ALB)**: SSL/TLS termination, path-based routing (\`/api\` vs \`/static\`), gzip compression, header manipulation.`,
    questionsMarkdown: `### Interview Questions

1. **Why do we use Virtual Nodes in Consistent Hashing?**
   - Virtual nodes distribute keys uniformly across the hash ring, preventing non-uniform load distribution (hotspots).`,
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
    definitions: `### Key Terminology & Definitions

- **Message Queue (RabbitMQ)**: Broker-centric message routing where messages are removed once acknowledged by consumers.
- **Event Log (Kafka)**: Distributed, partitioned, append-only commit log with consumer-managed offsets and persistent retention.
- **Dead Letter Queue (DLQ)**: Storage for poison messages that repeatedly fail processing after maximum retries.
- **Idempotent Consumer**: A consumer where processing the same message multiple times produces the exact same side effects.`,
    markdownNotes: `# Kafka vs RabbitMQ Architecture

| Feature | RabbitMQ | Apache Kafka |
| :--- | :--- | :--- |
| **Model** | Smart broker / Dumb consumer | Dumb broker / Smart consumer |
| **Persistence** | Deleted after ACK | Persisted in disk log |
| **Throughput** | ~50k msgs/sec | ~1M+ msgs/sec |
| **Ordering** | Per-queue | Per-partition |`,
    questionsMarkdown: `### Interview Questions

1. **How do you guarantee exactly-once processing with an at-least-once message queue?**
   - Use an **Idempotency Key** stored in Redis/DB with unique constraints, checking before executing business mutations.`,
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
    definitions: `### Key Terminology & Definitions

- **CAP Theorem**: In a distributed system with Network Partitions (P), you must choose between Consistency (C) or Availability (A).
- **PACELC Theorem**: If **P**artition: choose **A**vailability or **C**onsistency; **E**lse: choose **L**atency or **C**onsistency.
- **Split-Brain**: When network partition causes multiple nodes to believe they are the cluster leader, leading to conflicting writes.`,
    markdownNotes: `# CAP & PACELC Deep Dive

### PACELC Examples:
- **MongoDB**: PC/EC (Consistent under partition, consistent under normal operation).
- **Cassandra**: PA/EL (Available under partition, low latency under normal operation).`,
    questionsMarkdown: `### Interview Questions

1. **Why is CA (Consistency + Availability without Partition Tolerance) impossible in real distributed networks?**
   - Because network cables, switches, and connections can and will fail across data centers.`,
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
    definitions: `### Key Terminology & Definitions

- **Token Bucket**: Tokens added at constant rate; requests consume tokens. Allows bursts of traffic up to bucket capacity.
- **Leaky Bucket**: Requests enter queue and are processed at smooth, steady constant rate.
- **Sliding Window Counter**: Hybrid algorithm tracking request counts across dynamic sliding time windows in Redis.`,
    markdownNotes: `# Rate Limiting Algorithms

### Distributed Sliding Window in Redis (Lua):
\`\`\`lua
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
local currentCount = redis.call('ZCARD', key)

if currentCount < limit then
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(window / 1000))
  return 1 -- Allowed
else
  return 0 -- Rejected
end
\`\`\``,
    questionsMarkdown: `### Interview Questions

1. **Why must distributed rate limiters in Redis be executed via Lua scripts?**
   - Lua scripts execute atomically in Redis, eliminating race conditions between reading and writing counter keys.`,
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
    definitions: `### Key Terminology & Definitions

- **Polyfill**: Code that implements a feature on web browsers that do not natively support it.
- **\`Promise.all\` Polyfill**: Tracks completion counter, returns promise, resolves when counter matches length, rejects immediately on error.`,
    markdownNotes: `# Core Polyfill Implementations

### 1. \`Promise.all\` Polyfill
\`\`\`javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
};
\`\`\``,
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
    definitions: `### Key Terminology & Definitions

- **Deep Clone**: Recursively copies all properties and nested objects, breaking references.
- **WeakMap**: Key-value map holding weak references to objects, essential for detecting and resolving circular structures without memory leaks.`,
    markdownNotes: `# Advanced Utility Implementations

### Deep Clone with Circular References
\`\`\`javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], hash);
  }
  return clone;
}
\`\`\``,
    questionsMarkdown: `### Machine Coding Prompts

1. **Implement \`debounce\` supporting both \`{ leading: true, trailing: true }\`.**`,
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
    definitions: `### Key Terminology & Definitions

- **Event Emitter (Pub/Sub)**: Allows objects to subscribe to named events and receive broadcasts.
- **LRU Cache**: Cache that discards least recently used items when full, using a Hash Map + Doubly Linked List for \(O(1)\) get and put operations.`,
    markdownNotes: `# Custom Event Emitter Implementation

\`\`\`javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener); // Unsubscribe
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(fn => fn(...args));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(fn => fn !== listener);
  }
}
\`\`\``,
    questionsMarkdown: `### Machine Coding Prompts

1. **Implement an LRU Cache class with \`get(key)\` and \`put(key, value)\` in \(O(1)\) time.**`,
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
    definitions: `### Key Terminology & Definitions

- **Typeahead (Autocomplete)**: Input field suggesting matching items with debounced network calls and keyboard navigation.
- **IntersectionObserver**: Browser API to detect when an element enters or leaves viewport for performant infinite scrolling.
- **Recursive Tree Component**: React component rendering its own component definition for nested hierarchies (File Explorer).`,
    markdownNotes: `# React UI Machine Coding Patterns

### Infinite Scroll with IntersectionObserver:
\`\`\`javascript
function InfiniteList({ loadMore, hasMore }) {
  const observerRef = useRef();

  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore, loadMore]);

  return <div ref={lastElementRef} className="h-4" />;
}
\`\`\``,
    questionsMarkdown: `### Machine Coding Prompts

1. **Build a searchable tree-structured File Explorer with Expand/Collapse and Add File/Folder capabilities.**`,
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