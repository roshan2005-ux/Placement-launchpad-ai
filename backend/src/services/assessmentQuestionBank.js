/**
 * Role-Based Question Bank for Skill Assessment
 * Covers all 8 Target Job Roles with 10 questions each across Technical, Aptitude, and Role-specific categories.
 */

export const ASSESSMENT_QUESTIONS = {
  'Full Stack Developer': [
    {
      id: 'fs_1',
      question: 'In the MERN/Node stack, which middleware is commonly used to parse incoming request bodies before route handlers?',
      options: ['express.json()', 'cors()', 'express.static()', 'morgan()'],
      correctAnswer: 'express.json()',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'express.json() is built-in middleware in Express that parses incoming requests with JSON payloads and populates req.body.',
    },
    {
      id: 'fs_2',
      question: 'What is the primary benefit of using React hooks (such as useEffect) over class lifecycle methods?',
      options: [
        'They eliminate the need for JavaScript closures',
        'They allow logic reuse across functional components without complex HOC wrappers',
        'They guarantee faster virtual DOM rendering speeds automatically',
        'They convert React components into web workers',
      ],
      correctAnswer: 'They allow logic reuse across functional components without complex HOC wrappers',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'React Hooks allow developers to extract stateful logic to custom hooks, avoiding wrapper hell and enhancing component readability.',
    },
    {
      id: 'fs_3',
      question: 'Which HTTP status code is most appropriate when a client attempts to access a protected API route without providing a valid JWT?',
      options: ['200 OK', '400 Bad Request', '401 Unauthorized', '404 Not Found'],
      correctAnswer: '401 Unauthorized',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'HTTP 401 Unauthorized indicates that the client request lacks valid authentication credentials for the requested target resource.',
    },
    {
      id: 'fs_4',
      question: 'How does MongoDB handle indexing to accelerate query lookups?',
      options: [
        'By utilizing B-Trees on specified collection fields to avoid full-collection scans',
        'By storing all data in browser local storage',
        'By executing sequential searches across all unindexed documents',
        'By requiring all queries to use primary keys only',
      ],
      correctAnswer: 'By utilizing B-Trees on specified collection fields to avoid full-collection scans',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'MongoDB creates B-tree indexes on specified fields to quickly locate matching records without scanning the entire collection.',
    },
    {
      id: 'fs_5',
      question: 'A server API has an average response time of 200ms. If traffic increases by 300%, what architectural pattern best protects the database from read spikes?',
      options: ['Horizontal auto-scaling with Redis caching', 'Removing index constraints', 'Switching to synchronous file reads', 'Increasing database polling rate'],
      correctAnswer: 'Horizontal auto-scaling with Redis caching',
      category: 'Role-specific',
      difficulty: 'Hard',
      explanation: 'In-memory caching (e.g. Redis) caches frequent read queries, absorbing incoming traffic bursts and shielding the primary database.',
    },
    {
      id: 'fs_6',
      question: 'In modern REST API design, which idempotent HTTP method should be used to completely update a resource by replacing its contents?',
      options: ['POST', 'PUT', 'PATCH', 'GET'],
      correctAnswer: 'PUT',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'PUT is designed for idempotent resource replacement, meaning repeated identical requests result in the exact same server state.',
    },
    {
      id: 'fs_7',
      question: 'A developer writes a microservice that queries a database with O(N) operations in a loop. To optimize database throughput, what should they do?',
      options: [
        'Use batch queries (IN clause / bulk lookups) instead of sequential queries in loops',
        'Add infinite retries on each query failure',
        'Convert all database tables to flat text files',
        'Run the server on a slower clock rate',
      ],
      correctAnswer: 'Use batch queries (IN clause / bulk lookups) instead of sequential queries in loops',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Batch lookups eliminate the notorious N+1 query overhead, reducing database round-trip network latency.',
    },
    {
      id: 'fs_8',
      question: 'If a worker can complete 4 full stack feature tasks in 6 hours, how many hours will it take to finish 10 similar tasks at the same rate?',
      options: ['12 hours', '15 hours', '18 hours', '20 hours'],
      correctAnswer: '15 hours',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Rate = 4 tasks / 6 hours = 2/3 tasks per hour. To complete 10 tasks: 10 / (2/3) = 15 hours.',
    },
    {
      id: 'fs_9',
      question: 'A sequence of feature sprints delivers 3, 7, 15, 31 story points. What is the next number in this sequence?',
      options: ['48', '63', '55', '60'],
      correctAnswer: '63',
      category: 'Aptitude',
      difficulty: 'Medium',
      explanation: 'The pattern is (previous * 2) + 1: (3*2)+1=7, (7*2)+1=15, (15*2)+1=31, (31*2)+1=63.',
    },
    {
      id: 'fs_10',
      question: 'What is the purpose of Cross-Origin Resource Sharing (CORS) in web applications?',
      options: [
        'A browser security mechanism that restricts HTTP requests initiated from scripts outside the origin domain',
        'A CSS framework for responsive layouts',
        'A database replication protocol',
        'A JavaScript build bundler tool',
      ],
      correctAnswer: 'A browser security mechanism that restricts HTTP requests initiated from scripts outside the origin domain',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'CORS is a browser-enforced security standard that governs whether client-side code running at one origin can access resources from another origin.',
    },
  ],

  'Frontend Developer': [
    {
      id: 'fe_1',
      question: 'Which CSS property creates a new stacking context without requiring position relative/absolute?',
      options: ['opacity: 0.99', 'display: inline', 'color: white', 'font-size: 16px'],
      correctAnswer: 'opacity: 0.99',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'An opacity value less than 1 creates a new stacking context for child elements.',
    },
    {
      id: 'fe_2',
      question: 'In React, what is the key difference between useMemo and useCallback?',
      options: [
        'useMemo caches a computed value; useCallback caches a function definition',
        'useMemo runs only on the server; useCallback runs only on the client',
        'useMemo is for Redux; useCallback is for Context API',
        'They are identical and interchangeable aliases',
      ],
      correctAnswer: 'useMemo caches a computed value; useCallback caches a function definition',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'useMemo memoizes the result of a function call, while useCallback memoizes the callback function itself between renders.',
    },
    {
      id: 'fe_3',
      question: 'What is the primary purpose of the Virtual DOM in React?',
      options: [
        'To minimize expensive direct DOM manipulations through in-memory diffing',
        'To replace standard HTML markup with binary images',
        'To store user passwords securely in RAM',
        'To run backend database migrations',
      ],
      correctAnswer: 'To minimize expensive direct DOM manipulations through in-memory diffing',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'The Virtual DOM allows React to compute minimal batches of mutations before touching the actual real browser DOM tree.',
    },
    {
      id: 'fe_4',
      question: 'Which Web Vital metric measures the visual stability of a web page as elements load asynchronously?',
      options: ['Cumulative Layout Shift (CLS)', 'Largest Contentful Paint (LCP)', 'First Input Delay (FID)', 'Time to First Byte (TTFB)'],
      correctAnswer: 'Cumulative Layout Shift (CLS)',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'CLS measures unexpected layout shifts that happen during the lifespan of the page, ensuring visual stability.',
    },
    {
      id: 'fe_5',
      question: 'How does CSS Grid differ fundamentally from CSS Flexbox?',
      options: [
        'Grid is two-dimensional (rows & columns); Flexbox is one-dimensional (row OR column)',
        'Flexbox only works on mobile devices; Grid is desktop-only',
        'Grid cannot wrap items, whereas Flexbox always wraps',
        'Flexbox requires JavaScript polyfills',
      ],
      correctAnswer: 'Grid is two-dimensional (rows & columns); Flexbox is one-dimensional (row OR column)',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'CSS Grid provides a 2D layout model with explicit columns and rows, while Flexbox aligns along a single axis.',
    },
    {
      id: 'fe_6',
      question: 'When optimizing bundle sizes in modern frontend builds, what process eliminates unused exported code from production bundles?',
      options: ['Tree Shaking', 'Hydration', 'Transpilation', 'Server-Side Rendering'],
      correctAnswer: 'Tree Shaking',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Tree shaking is dead-code elimination relying on static ES2015 module structure (import/export) to strip unused modules.',
    },
    {
      id: 'fe_7',
      question: 'What HTML attribute ensures screen readers can announce dynamic updates without requiring a page reload?',
      options: ['aria-live', 'data-dynamic', 'draggable', 'tabindex="-1"'],
      correctAnswer: 'aria-live',
      category: 'Role-specific',
      difficulty: 'Hard',
      explanation: 'aria-live="polite" or "assertive" informs assistive technologies that a region has dynamic content updates.',
    },
    {
      id: 'fe_8',
      question: 'A web app loads an uncompressed 2.4 MB hero image in 800ms. If compressed with WebP by 75%, how large is the resulting image?',
      options: ['600 KB', '400 KB', '800 KB', '300 KB'],
      correctAnswer: '600 KB',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: '75% reduction means the file size is 25% of the original: 2400 KB * 0.25 = 600 KB.',
    },
    {
      id: 'fe_9',
      question: 'If 3 front-end engineers take 4 days to build a design system, how many days will 6 engineers take working at the same pace?',
      options: ['1 day', '2 days', '3 days', '8 days'],
      correctAnswer: '2 days',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Total effort = 3 engineers * 4 days = 12 engineer-days. With 6 engineers: 12 / 6 = 2 days.',
    },
    {
      id: 'fe_10',
      question: 'What is the purpose of React keys in lists of elements?',
      options: [
        'To provide a unique identity so React can determine which items have changed, been added, or removed',
        'To style list items with unique colors',
        'To store item metadata in database indexes',
        'To authenticate the user session',
      ],
      correctAnswer: 'To provide a unique identity so React can determine which items have changed, been added, or removed',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Keys give elements a stable identity across re-renders, allowing React to match elements in subtrees efficiently.',
    },
  ],

  'Backend Developer': [
    {
      id: 'be_1',
      question: 'What is the primary difference between synchronous and asynchronous I/O in Node.js?',
      options: [
        'Asynchronous I/O executes non-blocking operations via the libuv event loop',
        'Synchronous I/O uses more GPU threads',
        'Asynchronous I/O disables network sockets',
        'Synchronous I/O is required for JSON parsing',
      ],
      correctAnswer: 'Asynchronous I/O executes non-blocking operations via the libuv event loop',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Node.js delegates non-blocking I/O tasks to the libuv event loop and thread pool, keeping the main JS thread responsive.',
    },
    {
      id: 'be_2',
      question: 'In relational database design, what does the ACID acronym stand for?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Accuracy, Concurrency, Indexing, Data',
        'Authentication, Cipher, Integrity, Defense',
        'Asynchronous, Cached, Indexed, Distributed',
      ],
      correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'ACID properties guarantee that database transactions are processed reliably.',
    },
    {
      id: 'be_3',
      question: 'Which index type is best suited for fast equality lookups on an exact key (O(1) average time)?',
      options: ['Hash Index', 'B-Tree Index', 'Spatial Index', 'Full-Text Index'],
      correctAnswer: 'Hash Index',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Hash indexes use internal hash tables providing O(1) direct equality lookups, although they do not support range queries.',
    },
    {
      id: 'be_4',
      question: 'When implementing token-based authentication, what prevents a client from tampering with the payload in a JWT?',
      options: [
        'The cryptographic signature created using a server secret key',
        'The payload is encrypted with SSL automatically',
        'The browser prevents viewing JWT tokens',
        'JWT tokens are stored in the DNS cache',
      ],
      correctAnswer: 'The cryptographic signature created using a server secret key',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'The signature component of a JWT is verified using the server private key; any modification to the payload invalidates the signature.',
    },
    {
      id: 'be_5',
      question: 'What is connection pooling in a backend database service?',
      options: [
        'Maintaining a cache of active database connections to reuse across client requests',
        'Merging multiple database tables into one large document',
        'Storing database tables in browser memory',
        'Compressing network packets with Gzip',
      ],
      correctAnswer: 'Maintaining a cache of active database connections to reuse across client requests',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Connection pooling avoids the significant latency cost of opening and tearing down TCP database connections on every incoming query.',
    },
    {
      id: 'be_6',
      question: 'Which architecture pattern decouples high-volume message producers from slower background processing workers?',
      options: ['Message Queue (e.g. RabbitMQ / Kafka / BullMQ)', 'Direct synchronous REST calls', 'Monolithic database views', 'Client-side local storage'],
      correctAnswer: 'Message Queue (e.g. RabbitMQ / Kafka / BullMQ)',
      category: 'Role-specific',
      difficulty: 'Hard',
      explanation: 'Message queues buffer job payloads asynchronously, allowing consumer worker pools to process tasks at a sustainable rate.',
    },
    {
      id: 'be_7',
      question: 'What is database normalization, and why is Third Normal Form (3NF) commonly targeted?',
      options: [
        'Organizing tables to eliminate redundant data and avoid transitive functional dependencies',
        'Converting all column names to uppercase',
        'Ensuring all tables contain exactly 3 columns',
        'Merging SQL tables into NoSQL collections',
      ],
      correctAnswer: 'Organizing tables to eliminate redundant data and avoid transitive functional dependencies',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: '3NF ensures every non-key attribute is non-transitively dependent on the primary key, eliminating duplicate data anomalies.',
    },
    {
      id: 'be_8',
      question: 'A server receives 300 requests per minute. If each request takes 100ms of CPU time, what is the minimum number of concurrent workers needed without queuing?',
      options: ['1 worker', '2 workers', '5 workers', '10 workers'],
      correctAnswer: '1 worker',
      category: 'Aptitude',
      difficulty: 'Medium',
      explanation: '300 requests/minute = 5 requests/sec. 5 req/sec * 0.1 sec = 0.5 worker-seconds/sec. 1 worker can handle 1.0 worker-seconds/sec.',
    },
    {
      id: 'be_9',
      question: 'If a database query latency grows from 2ms to 16ms under 8x load increase, what is the relationship between latency and load?',
      options: ['Linear (O(N))', 'Constant (O(1))', 'Exponential (O(2^N))', 'Logarithmic (O(log N))'],
      correctAnswer: 'Linear (O(N))',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: '16ms / 2ms = 8x increase for 8x load increase. The growth rate is strictly linear (O(N)).',
    },
    {
      id: 'be_10',
      question: 'Which HTTP method should be used when an API endpoint performs a partial, non-destructive update to an existing resource?',
      options: ['PATCH', 'PUT', 'POST', 'DELETE'],
      correctAnswer: 'PATCH',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'RFC 5789 defines PATCH for applying partial modifications to a resource.',
    },
  ],

  'Python Developer': [
    {
      id: 'py_1',
      question: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A mutex that allows only one native thread to hold control of the Python interpreter at once',
        'A security wall protecting Python files from viruses',
        'A package manager for pip',
        'A compiler that converts Python to C++',
      ],
      correctAnswer: 'A mutex that allows only one native thread to hold control of the Python interpreter at once',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'CPython uses the GIL to manage memory safely, preventing simultaneous execution of bytecode across multiple threads.',
    },
    {
      id: 'py_2',
      question: 'What is the key advantage of using a Python generator function (yield) over returning a full list?',
      options: [
        'Memory efficiency via lazy evaluation of elements one at a time',
        'Generators run faster than C extensions',
        'Generators can only hold integers',
        'Generators automatically write output to disk',
      ],
      correctAnswer: 'Memory efficiency via lazy evaluation of elements one at a time',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Generators yield values on demand without storing the entire sequence in memory.',
    },
    {
      id: 'py_3',
      question: 'In Python object-oriented programming, what is the purpose of the __init__ method?',
      options: [
        'Constructor initializer method called when a new instance of a class is created',
        'Destructor method called on garbage collection',
        'Method for converting instances to JSON',
        'Import hook for third-party modules',
      ],
      correctAnswer: 'Constructor initializer method called when a new instance of a class is created',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: '__init__ acts as the constructor in Python classes, initializing instance variables upon instantiation.',
    },
    {
      id: 'py_4',
      question: 'Which async web framework in Python provides native support for Pydantic type annotations and OpenAPI generation?',
      options: ['FastAPI', 'Django 1.0', 'Flask', 'Bottle'],
      correctAnswer: 'FastAPI',
      category: 'Role-specific',
      difficulty: 'Easy',
      explanation: 'FastAPI leverages standard Python type hints with Pydantic for validation and automatic OpenAPI documentation.',
    },
    {
      id: 'py_5',
      question: 'What is the output of `[x**2 for x in range(5) if x % 2 == 0]` in Python?',
      options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
      correctAnswer: '[0, 4, 16]',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'range(5) gives 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.',
    },
    {
      id: 'py_6',
      question: 'How do Python decorators (@decorator) operate conceptually?',
      options: [
        'They are higher-order functions that take another function as an argument and extend its behavior without modifying it',
        'They are graphical CSS wrappers for Python web pages',
        'They compile Python bytecode to WebAssembly',
        'They are background celery workers',
      ],
      correctAnswer: 'They are higher-order functions that take another function as an argument and extend its behavior without modifying it',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Decorators wrap a target callable, executing pre/post logic while preserving or altering the returned result.',
    },
    {
      id: 'py_7',
      question: 'Which data structure in Python offers O(1) average time complexity for lookups and insertions?',
      options: ['dict (dictionary)', 'list', 'tuple', 'linked list'],
      correctAnswer: 'dict (dictionary)',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Python dictionaries use hash tables under the hood, delivering O(1) average lookup and insert performance.',
    },
    {
      id: 'py_8',
      question: 'If a Python script processes 150 records in 3 seconds, how many records will it process in 20 seconds at the same processing rate?',
      options: ['800', '1,000', '1,200', '1,500'],
      correctAnswer: '1,000',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Rate = 150 / 3 = 50 records/second. In 20 seconds: 50 * 20 = 1,000 records.',
    },
    {
      id: 'py_9',
      question: 'A list has values [2, 6, 12, 20, 30]. What is the next expected number following this pattern?',
      options: ['40', '42', '44', '48'],
      correctAnswer: '42',
      category: 'Aptitude',
      difficulty: 'Medium',
      explanation: 'Differences between terms are +4, +6, +8, +10, so next difference is +12: 30 + 12 = 42.',
    },
    {
      id: 'py_10',
      question: 'What is the purpose of the `with` statement (context manager) in Python file I/O?',
      options: [
        'Guarantees automatic cleanup and closure of resources (e.g. file handles) even if exceptions occur',
        'Accelerates disk read speeds by 10x',
        'Permits simultaneous write access across multiple threads',
        'Converts text files to binary databases',
      ],
      correctAnswer: 'Guarantees automatic cleanup and closure of resources (e.g. file handles) even if exceptions occur',
      category: 'Role-specific',
      difficulty: 'Easy',
      explanation: 'The context manager invokes __enter__ and __exit__ methods, ensuring cleanup even during unhandled runtime exceptions.',
    },
  ],

  'Java Developer': [
    {
      id: 'jv_1',
      question: 'In the Java Virtual Machine (JVM), what is the primary role of the Garbage Collector?',
      options: [
        'Automatically reclaiming heap memory allocated to unreferenced objects',
        'Deleting duplicate Java source code files',
        'Optimizing network socket bandwidth',
        'Compiling .java files into .class files',
      ],
      correctAnswer: 'Automatically reclaiming heap memory allocated to unreferenced objects',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'JVM Garbage Collection monitors the heap memory and cleans up unreachable objects to prevent memory exhaustion.',
    },
    {
      id: 'jv_2',
      question: 'What is the key difference between an Interface and an Abstract Class in Java 8+?',
      options: [
        'A class can implement multiple interfaces but extend only one abstract class',
        'Interfaces cannot have static methods in Java',
        'Abstract classes cannot have constructors',
        'Interfaces run on the GPU',
      ],
      correctAnswer: 'A class can implement multiple interfaces but extend only one abstract class',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Java supports multiple inheritance of type via interfaces, whereas class inheritance remains strictly single inheritance.',
    },
    {
      id: 'jv_3',
      question: 'In Spring Boot, which annotation marks a class as a RESTful web controller that automatically converts response bodies to JSON?',
      options: ['@RestController', '@Component', '@Service', '@Repository'],
      correctAnswer: '@RestController',
      category: 'Role-specific',
      difficulty: 'Easy',
      explanation: '@RestController combines @Controller and @ResponseBody, serializing returned objects into JSON HTTP responses.',
    },
    {
      id: 'jv_4',
      question: 'What is the time complexity of retrieving an element by key in a properly balanced java.util.HashMap?',
      options: ['O(1) average time', 'O(N) always', 'O(N^2)', 'O(log N) always'],
      correctAnswer: 'O(1) average time',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'HashMap uses hashing to provide O(1) average case lookups, degrading to O(log N) in Java 8+ when hash collisions occur.',
    },
    {
      id: 'jv_5',
      question: 'What does Dependency Injection (DI) accomplish in Spring Framework applications?',
      options: [
        'Decouples object creation from business logic, injecting dependencies at runtime via IoC container',
        'Injects SQL queries directly into browser DOM',
        'Compiles bytecode into machine assembly code',
        'Compresses class files for deployment',
      ],
      correctAnswer: 'Decouples object creation from business logic, injecting dependencies at runtime via IoC container',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Spring Inversion of Control (IoC) manages object lifecycles and injects dependent instances, promoting loose coupling.',
    },
    {
      id: 'jv_6',
      question: 'Which keyword in Java ensures that a variable’s read and write operations are directly synchronized to main memory across threads?',
      options: ['volatile', 'transient', 'static', 'final'],
      correctAnswer: 'volatile',
      category: 'Technical',
      difficulty: 'Hard',
      explanation: 'The volatile keyword guarantees memory visibility across concurrent threads, bypassing CPU cache discrepancies.',
    },
    {
      id: 'jv_7',
      question: 'In Java Streams API, which operation is terminal and initiates processing of the pipeline?',
      options: ['collect()', 'filter()', 'map()', 'sorted()'],
      correctAnswer: 'collect()',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Stream intermediate operations (map, filter) are lazy; terminal operations like collect(), forEach(), or count() trigger execution.',
    },
    {
      id: 'jv_8',
      question: 'A Java application pool has 12 worker threads. If 3 threads are reserved for telemetry, what percentage of threads are available for user requests?',
      options: ['75%', '80%', '70%', '65%'],
      correctAnswer: '75%',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Available threads = 12 - 3 = 9. Percentage = (9 / 12) * 100 = 75%.',
    },
    {
      id: 'jv_9',
      question: 'If a project completes 25% of sprint backlog in 4 days, how many total days will the complete backlog take at this rate?',
      options: ['16 days', '12 days', '20 days', '18 days'],
      correctAnswer: '16 days',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: '100% / 25% = 4 intervals. 4 * 4 days = 16 days.',
    },
    {
      id: 'jv_10',
      question: 'What is the purpose of the `@Transactional` annotation in Spring Data JPA?',
      options: [
        'Wraps method execution in a database transaction, committing on success or rolling back on unchecked exception',
        'Encrypts all database rows with AES-256',
        'Runs queries in separate browser threads',
        'Exports query results to Excel sheets',
      ],
      correctAnswer: 'Wraps method execution in a database transaction, committing on success or rolling back on unchecked exception',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: '@Transactional provides declarative transaction management, ensuring database consistency according to ACID semantics.',
    },
  ],

  'Data Analyst': [
    {
      id: 'da_1',
      question: 'In SQL, what is the primary difference between `WHERE` and `HAVING` clauses?',
      options: [
        'WHERE filters rows before aggregation; HAVING filters groups after aggregation',
        'WHERE is used for NoSQL; HAVING is used for SQL',
        'HAVING is faster than WHERE on indexed columns',
        'WHERE only accepts integers',
      ],
      correctAnswer: 'WHERE filters rows before aggregation; HAVING filters groups after aggregation',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'WHERE acts on individual table rows prior to GROUP BY aggregation; HAVING filters aggregated groups.',
    },
    {
      id: 'da_2',
      question: 'In pandas, which method is used to replace missing values (NaN) in a DataFrame column?',
      options: ['fillna()', 'dropna()', 'replace_null()', 'clean()'],
      correctAnswer: 'fillna()',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'df.fillna(value) fills NaN/null cells with a specified replacement value or imputed metric.',
    },
    {
      id: 'da_3',
      question: 'Which statistical metric is most robust against extreme outliers in a skewed compensation distribution?',
      options: ['Median', 'Arithmetic Mean', 'Standard Deviation', 'Range'],
      correctAnswer: 'Median',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'The median represents the 50th percentile and is not distorted by extreme outliers, unlike the mean.',
    },
    {
      id: 'da_4',
      question: 'What type of SQL JOIN returns all rows from the left table, and matching rows from the right table, filling with NULL if no match exists?',
      options: ['LEFT OUTER JOIN', 'INNER JOIN', 'CROSS JOIN', 'RIGHT OUTER JOIN'],
      correctAnswer: 'LEFT OUTER JOIN',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'A LEFT JOIN guarantees all rows from the primary left table are retained, matching right records where keys match.',
    },
    {
      id: 'da_5',
      question: 'What is a p-value in statistical hypothesis testing?',
      options: [
        'The probability of observing results as extreme as the sample data, assuming the null hypothesis is true',
        'The percentage of missing data in a table',
        'The primary key count in a database',
        'The accuracy score of a neural network',
      ],
      correctAnswer: 'The probability of observing results as extreme as the sample data, assuming the null hypothesis is true',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'A p-value measures evidence against the null hypothesis; a value under significance threshold (e.g. 0.05) suggests statistical significance.',
    },
    {
      id: 'da_6',
      question: 'In business intelligence dashboarding, which chart type is most appropriate for displaying categorical proportions of a single whole?',
      options: ['Donut / Pie Chart', 'Scatter Plot', 'Line Chart with time axis', 'Box and Whisker Plot'],
      correctAnswer: 'Donut / Pie Chart',
      category: 'Role-specific',
      difficulty: 'Easy',
      explanation: 'Donut/pie charts visually compare constituent shares or percentages of a 100% total.',
    },
    {
      id: 'da_7',
      question: 'What does an inner quartile range (IQR) measure in exploratory data analysis?',
      options: [
        'The spread of the middle 50% of the data (Q3 - Q1)',
        'The average distance between all database rows',
        'The total number of columns in a SQL schema',
        'The correlation coefficient between two columns',
      ],
      correctAnswer: 'The spread of the middle 50% of the data (Q3 - Q1)',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'IQR = Q3 - Q1, identifying dispersion and serving as a standard heuristic threshold for detecting statistical outliers.',
    },
    {
      id: 'da_8',
      question: 'A company reports 2,000 monthly active users in January and 2,500 in February. What is the percentage growth?',
      options: ['25%', '20%', '30%', '15%'],
      correctAnswer: '25%',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Growth = (2500 - 2000) / 2000 = 500 / 2000 = 25%.',
    },
    {
      id: 'da_9',
      question: 'If the mean of 5 sales transactions is $120, what is the total sum of all 5 transactions?',
      options: ['$600', '$500', '$720', '$480'],
      correctAnswer: '$600',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Sum = Mean * Count = 120 * 5 = $600.',
    },
    {
      id: 'da_10',
      question: 'In SQL, which window function ranks rows within a partition without leaving gaps in ranking sequence after ties?',
      options: ['DENSE_RANK()', 'RANK()', 'ROW_NUMBER()', 'NTILE()'],
      correctAnswer: 'DENSE_RANK()',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'DENSE_RANK() assigns contiguous ranking integers without skipping numbers when multiple records tie on the sorting key.',
    },
  ],

  'AI/ML Engineer': [
    {
      id: 'ml_1',
      question: 'What is the primary cause of overfitting in a machine learning model?',
      options: [
        'The model learns noise and specific details of training data rather than generalizable patterns',
        'The learning rate is set to exactly 0',
        'The model has too few parameters to capture linear relationships',
        'The training set has too many test labels',
      ],
      correctAnswer: 'The model learns noise and specific details of training data rather than generalizable patterns',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Overfitting occurs when a high-capacity model memorizes training idiosyncrasies, leading to high training accuracy but poor test generalization.',
    },
    {
      id: 'ml_2',
      question: 'In deep neural networks, which activation function mitigates the vanishing gradient problem by returning max(0, x)?',
      options: ['ReLU (Rectified Linear Unit)', 'Sigmoid', 'Tanh', 'Softmax'],
      correctAnswer: 'ReLU (Rectified Linear Unit)',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'ReLU has a constant gradient of 1 for positive inputs, avoiding the gradient saturation experienced with Sigmoid and Tanh.',
    },
    {
      id: 'ml_3',
      question: 'What is the purpose of regularisation techniques like L2 (Ridge) and Dropout in neural architectures?',
      options: [
        'To constrain model complexity and prevent overfitting',
        'To speed up GPU fan speeds',
        'To convert continuous values into categorical text',
        'To eliminate the need for backpropagation',
      ],
      correctAnswer: 'To constrain model complexity and prevent overfitting',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Regularization penalizes extreme weights or randomly deactivates neurons, improving cross-validation robustness.',
    },
    {
      id: 'ml_4',
      question: 'Which evaluation metric is most critical when evaluating a fraud detection model with severe class imbalance (e.g. 99.9% legitimate)?',
      options: ['Precision-Recall AUC / F1-Score', 'Raw Accuracy', 'Mean Squared Error', 'R-squared'],
      correctAnswer: 'Precision-Recall AUC / F1-Score',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Raw accuracy can be 99.9% while predicting zero fraud cases. Precision, Recall, and F1 accurately capture minority class performance.',
    },
    {
      id: 'ml_5',
      question: 'In the Transformer architecture, what mechanism allows tokens to dynamically attend to representations across all positions in a sequence?',
      options: ['Self-Attention mechanism', 'Recurrent cell gating', 'Convolutional pooling', 'Stochastic gradient descent'],
      correctAnswer: 'Self-Attention mechanism',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Scaled dot-product self-attention calculates query-key similarity matrices to weight contextual values across the entire sequence length.',
    },
    {
      id: 'ml_6',
      question: 'What is backpropagation in training artificial neural networks?',
      options: [
        'Calculating the gradient of the loss function with respect to each weight using the chain rule of calculus',
        'Copying training images backwards onto disk',
        'Reversing the order of dataset rows',
        'Converting float32 weights into 8-bit integers',
      ],
      correctAnswer: 'Calculating the gradient of the loss function with respect to each weight using the chain rule of calculus',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Backpropagation propagates error gradients from the output layer back through hidden layers to update weights via gradient descent.',
    },
    {
      id: 'ml_7',
      question: 'When fine-tuning a Large Language Model (LLM), what is the primary benefit of Parameter-Efficient Fine-Tuning (PEFT/LoRA)?',
      options: [
        'Injecting trainable low-rank decomposition matrices while freezing the vast majority of base model weights',
        'Training the entire 70B parameter model from scratch',
        'Deleting all attention heads',
        'Converting text tokens into audio samples',
      ],
      correctAnswer: 'Injecting trainable low-rank decomposition matrices while freezing the vast majority of base model weights',
      category: 'Role-specific',
      difficulty: 'Hard',
      explanation: 'LoRA freezes pre-trained model weights and trains small adapter matrices, drastically cutting GPU VRAM requirements.',
    },
    {
      id: 'ml_8',
      question: 'A classifier produces 80 True Positives, 20 False Positives, and 10 False Negatives. What is the Precision of the model?',
      options: ['80%', '88.8%', '85%', '90%'],
      correctAnswer: '80%',
      category: 'Aptitude',
      difficulty: 'Medium',
      explanation: 'Precision = True Positives / (True Positives + False Positives) = 80 / (80 + 20) = 80 / 100 = 80%.',
    },
    {
      id: 'ml_9',
      question: 'If a training epoch takes 45 seconds on 1 GPU, how many minutes will 20 epochs take running sequentially?',
      options: ['15 minutes', '12 minutes', '18 minutes', '20 minutes'],
      correctAnswer: '15 minutes',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Total seconds = 45 * 20 = 900 seconds. 900 / 60 = 15 minutes.',
    },
    {
      id: 'ml_10',
      question: 'What is the purpose of cross-entropy loss in classification tasks?',
      options: [
        'Quantifying the divergence between predicted probability distributions and true one-hot ground truth labels',
        'Measuring Euclidean distance between coordinates',
        'Minimizing RAM consumption on Linux',
        'Compressing trained weights for edge deployment',
      ],
      correctAnswer: 'Quantifying the divergence between predicted probability distributions and true one-hot ground truth labels',
      category: 'Technical',
      difficulty: 'Medium',
      explanation: 'Cross-entropy penalizes confident wrong predictions logarithmically, driving softmax probabilities toward the true class label.',
    },
  ],

  'Cybersecurity Analyst': [
    {
      id: 'cy_1',
      question: 'What vulnerability occurs when user input is directly concatenated into a SQL statement without parameterization?',
      options: ['SQL Injection (SQLi)', 'Cross-Site Scripting (XSS)', 'Buffer Overflow', 'Server-Side Request Forgery (SSRF)'],
      correctAnswer: 'SQL Injection (SQLi)',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'SQL injection allows attackers to manipulate database queries by injecting untrusted payload fragments into dynamic queries.',
    },
    {
      id: 'cy_2',
      question: 'In asymmetric cryptography, which key is used to decrypt data encrypted with a user’s public key?',
      options: ['The recipient’s private key', 'The sender’s public key', 'The root certificate key', 'A shared symmetric password'],
      correctAnswer: 'The recipient’s private key',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Asymmetric encryption pairs a public key (for encryption) with a strictly guarded private key (for decryption).',
    },
    {
      id: 'cy_3',
      question: 'What is the primary role of a SIEM (Security Information and Event Management) platform in enterprise defense?',
      options: [
        'Aggregating, correlating, and analyzing log data across network infrastructure for security anomalies',
        'Replacing traditional firewalls entirely',
        'Writing user authentication code',
        'Generating marketing analytics reports',
      ],
      correctAnswer: 'Aggregating, correlating, and analyzing log data across network infrastructure for security anomalies',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'SIEM platforms (e.g. Splunk, Elastic, Sentinel) ingest event logs to provide centralized visibility and threat detection.',
    },
    {
      id: 'cy_4',
      question: 'Which network tool is widely considered the industry standard for packet capture and deep network protocol inspection?',
      options: ['Wireshark', 'Photoshop', 'Nginx', 'Postman'],
      correctAnswer: 'Wireshark',
      category: 'Role-specific',
      difficulty: 'Easy',
      explanation: 'Wireshark is the premier open-source packet analysis utility used to inspect pcap traffic down to bit-level protocols.',
    },
    {
      id: 'cy_5',
      question: 'In the CIA Triad of information security, what does the "I" represent?',
      options: ['Integrity', 'Identification', 'Isolation', 'Intelligence'],
      correctAnswer: 'Integrity',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'The CIA Triad stands for Confidentiality, Integrity, and Availability.',
    },
    {
      id: 'cy_6',
      question: 'What security countermeasure mitigates Cross-Site Request Forgery (CSRF) attacks in session-based web applications?',
      options: [
        'Synchronizer Anti-CSRF tokens and SameSite cookie attributes',
        'Disabling HTTPS encryption',
        'Allowing wildcard CORS origins (*)',
        'Increasing session cookie lifetimes to 1 year',
      ],
      correctAnswer: 'Synchronizer Anti-CSRF tokens and SameSite cookie attributes',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Unique anti-CSRF tokens and SameSite=Strict/Lax flags prevent unauthorized third-party sites from forging client requests.',
    },
    {
      id: 'cy_7',
      question: 'What type of malware is engineered to encrypt a target victim’s files and demand financial extortion for the decryption key?',
      options: ['Ransomware', 'Adware', 'Spyware', 'Rootkit'],
      correctAnswer: 'Ransomware',
      category: 'Technical',
      difficulty: 'Easy',
      explanation: 'Ransomware locks critical user or company data using strong encryption, conditioning recovery on payment.',
    },
    {
      id: 'cy_8',
      question: 'A firewall inspects 12,000 packets per second. If 4% of packets violate rules and are dropped, how many packets are allowed through per second?',
      options: ['11,520 packets', '11,400 packets', '11,600 packets', '11,200 packets'],
      correctAnswer: '11,520 packets',
      category: 'Aptitude',
      difficulty: 'Easy',
      explanation: 'Dropped = 12,000 * 0.04 = 480. Allowed = 12,000 - 480 = 11,520.',
    },
    {
      id: 'cy_9',
      question: 'An enterprise detects 8 critical vulnerabilities in month 1. If security remediation reduces vulnerabilities by 50% each month, how many remain after month 3?',
      options: ['1 vulnerability', '2 vulnerabilities', '0 vulnerabilities', '4 vulnerabilities'],
      correctAnswer: '1 vulnerability',
      category: 'Aptitude',
      difficulty: 'Medium',
      explanation: 'Month 1: 8. Month 2: 8 / 2 = 4. Month 3: 4 / 2 = 2. End of Month 3: 2 / 2 = 1.',
    },
    {
      id: 'cy_10',
      question: 'What is the key principle of the Zero Trust security architecture?',
      options: [
        'Never trust, always verify: enforce strict identity authentication and least-privilege authorization everywhere',
        'Trust all internal network devices automatically',
        'Disable all firewall rules for authenticated users',
        'Never use passwords or multifactor authentication',
      ],
      correctAnswer: 'Never trust, always verify: enforce strict identity authentication and least-privilege authorization everywhere',
      category: 'Role-specific',
      difficulty: 'Medium',
      explanation: 'Zero Trust assumes no implicit trust granted to assets or accounts based solely on physical or network location.',
    },
  ],
};

/**
 * Retrieves sanitized assessment questions for a target role (correct answers withheld)
 */
export const getQuestionsForRole = (targetJobRole) => {
  const questions = ASSESSMENT_QUESTIONS[targetJobRole] || ASSESSMENT_QUESTIONS['Full Stack Developer'];
  return questions.map((q) => ({
    id: q.id,
    questionId: q.id,
    question: q.question,
    options: [...q.options],
    category: q.category,
    difficulty: q.difficulty,
  }));
};

/**
 * Evaluates student answers against the question bank
 */
export const gradeAssessment = (targetJobRole, submittedAnswers = {}) => {
  const originalQuestions = ASSESSMENT_QUESTIONS[targetJobRole] || ASSESSMENT_QUESTIONS['Full Stack Developer'];
  let correctCount = 0;
  const detailedResults = [];
  const categoryStats = {
    Technical: { total: 0, correct: 0 },
    Aptitude: { total: 0, correct: 0 },
    'Role-specific': { total: 0, correct: 0 },
  };

  // Normalize submittedAnswers into a lookup map
  const answerMap = {};
  if (Array.isArray(submittedAnswers)) {
    submittedAnswers.forEach((ans) => {
      const qId = ans.questionId || ans.id;
      if (qId) {
        if (ans.selectedAnswer !== undefined) {
          answerMap[qId] = ans.selectedAnswer;
        } else if (ans.selectedOption !== undefined) {
          answerMap[qId] = ans.selectedOption;
        }
      }
    });
  } else if (typeof submittedAnswers === 'object' && submittedAnswers !== null) {
    Object.assign(answerMap, submittedAnswers);
  }

  originalQuestions.forEach((q) => {
    const rawChoice = answerMap[q.id];
    let studentChoice = null;

    if (typeof rawChoice === 'number' && rawChoice >= 0 && rawChoice < q.options.length) {
      studentChoice = q.options[rawChoice];
    } else if (typeof rawChoice === 'string') {
      studentChoice = rawChoice.trim();
    }

    const isCorrect = Boolean(studentChoice && studentChoice.toLowerCase() === q.correctAnswer.trim().toLowerCase());

    if (isCorrect) correctCount++;

    const cat = categoryStats[q.category] ? q.category : 'Technical';
    categoryStats[cat].total++;
    if (isCorrect) categoryStats[cat].correct++;

    detailedResults.push({
      questionId: q.id,
      question: q.question,
      selectedAnswer: studentChoice,
      correctAnswer: q.correctAnswer,
      isCorrect,
      category: q.category,
      explanation: q.explanation,
    });
  });

  const totalQuestions = originalQuestions.length;
  const wrongCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);

  const categoryScores = {};
  const strongAreas = [];
  const weakAreas = [];

  Object.entries(categoryStats).forEach(([cat, data]) => {
    const catScore = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    categoryScores[cat] = catScore;
    if (catScore >= 70) strongAreas.push(cat);
    else weakAreas.push(cat);
  });

  return {
    score,
    passed: score >= 60,
    totalQuestions,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    categoryScores,
    categoryBreakdown: categoryScores,
    strongAreas,
    weakAreas,
    detailedResults,
    answers: detailedResults,
  };
};
