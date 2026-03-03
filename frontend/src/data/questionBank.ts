export interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  explanation: string;
  tags?: string[];
}

export const questionBank: Question[] = [
  // JavaScript Questions - Easy
  {
    id: 'js-1',
    question: 'Which method is used to add an element to the end of an array in JavaScript?',
    options: ['append()', 'push()', 'add()', 'insert()'],
    correct: 1,
    skill: 'javascript',
    difficulty: 'easy',
    explanation: 'push() method adds one or more elements to the end of an array and returns the new length.',
    tags: ['arrays', 'methods']
  },
  {
    id: 'js-2',
    question: 'What is the correct way to declare a variable in JavaScript?',
    options: ['variable x = 5;', 'var x = 5;', 'v x = 5;', 'declare x = 5;'],
    correct: 1,
    skill: 'javascript',
    difficulty: 'easy',
    explanation: 'var, let, or const are the correct ways to declare variables in JavaScript.',
    tags: ['variables', 'syntax']
  },
  {
    id: 'js-3',
    question: 'Which operator is used for strict equality comparison?',
    options: ['==', '===', '=', '!='],
    correct: 1,
    skill: 'javascript',
    difficulty: 'easy',
    explanation: '=== checks for strict equality (value and type), while == performs type coercion.',
    tags: ['operators', 'comparison']
  },
  {
    id: 'js-4',
    question: 'What does typeof null return in JavaScript?',
    options: ['null', 'undefined', 'object', 'boolean'],
    correct: 2,
    skill: 'javascript',
    difficulty: 'easy',
    explanation: 'This is a known bug in JavaScript. typeof null returns "object" instead of "null".',
    tags: ['typeof', 'null', 'quirks']
  },
  {
    id: 'js-5',
    question: 'Which method converts a string to lowercase?',
    options: ['toLowerCase()', 'toLower()', 'lower()', 'lowerCase()'],
    correct: 0,
    skill: 'javascript',
    difficulty: 'easy',
    explanation: 'toLowerCase() is the correct method to convert strings to lowercase in JavaScript.',
    tags: ['strings', 'methods']
  },

  // JavaScript Questions - Medium
  {
    id: 'js-6',
    question: 'What does "hoisting" mean in JavaScript?',
    options: [
      'Moving variables to global scope',
      'Variable and function declarations are moved to the top of their scope',
      'Optimizing code performance',
      'Creating closures'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'medium',
    explanation: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of the current scope.',
    tags: ['hoisting', 'scope']
  },
  {
    id: 'js-7',
    question: 'What is the difference between let and var?',
    options: [
      'No difference',
      'let has block scope, var has function scope',
      'var is newer than let',
      'let cannot be reassigned'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'medium',
    explanation: 'let has block scope and is not hoisted, while var has function scope and is hoisted.',
    tags: ['variables', 'scope', 'es6']
  },
  {
    id: 'js-8',
    question: 'What will console.log(1 + "2" + 3) output?',
    options: ['6', '123', '15', 'Error'],
    correct: 1,
    skill: 'javascript',
    difficulty: 'medium',
    explanation: 'JavaScript performs left-to-right evaluation. 1 + "2" becomes "12", then "12" + 3 becomes "123".',
    tags: ['type-coercion', 'operators']
  },
  {
    id: 'js-9',
    question: 'What is the purpose of the bind() method?',
    options: [
      'To merge objects',
      'To create a new function with a specific this context',
      'To bind variables to scope',
      'To connect to databases'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'medium',
    explanation: 'bind() creates a new function with a permanently bound this value.',
    tags: ['functions', 'this', 'context']
  },
  {
    id: 'js-10',
    question: 'What is event bubbling?',
    options: [
      'Creating multiple events',
      'Events propagating from child to parent elements',
      'Preventing default behavior',
      'Optimizing event performance'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'medium',
    explanation: 'Event bubbling is when events propagate up the DOM tree from child to parent elements.',
    tags: ['events', 'dom', 'bubbling']
  },

  // JavaScript Questions - Hard
  {
    id: 'js-11',
    question: 'What is a closure in JavaScript?',
    options: [
      'A way to close browser windows',
      'A function that has access to variables in its outer scope',
      'A method to end loops',
      'A type of error handling'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'hard',
    explanation: 'A closure gives you access to an outer function\'s scope from an inner function.',
    tags: ['closures', 'scope', 'functions']
  },
  {
    id: 'js-12',
    question: 'What is the difference between call() and apply()?',
    options: [
      'No difference',
      'call() takes arguments individually, apply() takes an array',
      'apply() is deprecated',
      'call() is for objects, apply() for functions'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'hard',
    explanation: 'call() accepts arguments individually, while apply() accepts arguments as an array.',
    tags: ['functions', 'this', 'methods']
  },
  {
    id: 'js-13',
    question: 'What is the event loop in JavaScript?',
    options: [
      'A loop for handling events',
      'The mechanism that handles asynchronous operations',
      'A debugging tool',
      'A performance optimization'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'hard',
    explanation: 'The event loop manages the execution of asynchronous code in JavaScript\'s single-threaded environment.',
    tags: ['event-loop', 'async', 'concurrency']
  },
  {
    id: 'js-14',
    question: 'What is the difference between Promise.all() and Promise.allSettled()?',
    options: [
      'No difference',
      'Promise.all() fails fast, Promise.allSettled() waits for all',
      'Promise.allSettled() is deprecated',
      'Promise.all() is synchronous'
    ],
    correct: 1,
    skill: 'javascript',
    difficulty: 'hard',
    explanation: 'Promise.all() rejects immediately if any promise rejects, while Promise.allSettled() waits for all promises to settle.',
    tags: ['promises', 'async', 'error-handling']
  },
  {
    id: 'js-15',
    question: 'What is a WeakMap in JavaScript?',
    options: [
      'A map with weak references to keys',
      'A map that can be garbage collected',
      'A map with limited functionality',
      'A deprecated data structure'
    ],
    correct: 0,
    skill: 'javascript',
    difficulty: 'hard',
    explanation: 'WeakMap holds weak references to keys, allowing them to be garbage collected when no other references exist.',
    tags: ['weakmap', 'memory', 'garbage-collection']
  },

  // React Questions - Easy
  {
    id: 'react-1',
    question: 'Which React hook is used for side effects in functional components?',
    options: ['useState', 'useEffect', 'useContext', 'useMemo'],
    correct: 1,
    skill: 'react',
    difficulty: 'easy',
    explanation: 'useEffect is specifically designed to handle side effects like API calls, subscriptions, etc.',
    tags: ['hooks', 'side-effects']
  },
  {
    id: 'react-2',
    question: 'What is JSX?',
    options: [
      'A JavaScript library',
      'A syntax extension for JavaScript',
      'A CSS framework',
      'A testing tool'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'easy',
    explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript.',
    tags: ['jsx', 'syntax']
  },
  {
    id: 'react-3',
    question: 'How do you pass data from parent to child component?',
    options: ['state', 'props', 'context', 'refs'],
    correct: 1,
    skill: 'react',
    difficulty: 'easy',
    explanation: 'Props are used to pass data from parent components to child components.',
    tags: ['props', 'data-flow']
  },
  {
    id: 'react-4',
    question: 'What is the purpose of the key prop in React lists?',
    options: [
      'For styling',
      'For unique identification and efficient re-rendering',
      'For event handling',
      'For data binding'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'easy',
    explanation: 'Keys help React identify which items have changed, are added, or are removed for efficient updates.',
    tags: ['keys', 'lists', 'performance']
  },
  {
    id: 'react-5',
    question: 'Which method is used to update state in functional components?',
    options: ['setState()', 'updateState()', 'useState setter', 'changeState()'],
    correct: 2,
    skill: 'react',
    difficulty: 'easy',
    explanation: 'useState hook returns a setter function to update state in functional components.',
    tags: ['hooks', 'state', 'useState']
  },

  // React Questions - Medium
  {
    id: 'react-6',
    question: 'What is the purpose of React.memo()?',
    options: [
      'To memorize component state',
      'To prevent unnecessary re-renders of functional components',
      'To store data in memory',
      'To create memoized callbacks'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'medium',
    explanation: 'React.memo is a higher order component that memoizes the result and skips rendering if props haven\'t changed.',
    tags: ['memo', 'performance', 'optimization']
  },
  {
    id: 'react-7',
    question: 'What is the difference between useCallback and useMemo?',
    options: [
      'No difference, they are the same',
      'useCallback memoizes functions, useMemo memoizes values',
      'useCallback is for class components, useMemo for functional',
      'useCallback is deprecated'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'medium',
    explanation: 'useCallback returns a memoized callback function, while useMemo returns a memoized value.',
    tags: ['hooks', 'memoization', 'performance']
  },
  {
    id: 'react-8',
    question: 'What is the Context API used for?',
    options: [
      'State management across components',
      'Routing between pages',
      'Styling components',
      'Testing components'
    ],
    correct: 0,
    skill: 'react',
    difficulty: 'medium',
    explanation: 'Context API provides a way to pass data through the component tree without prop drilling.',
    tags: ['context', 'state-management', 'prop-drilling']
  },
  {
    id: 'react-9',
    question: 'What is the purpose of useReducer hook?',
    options: [
      'To reduce bundle size',
      'To manage complex state logic',
      'To reduce re-renders',
      'To optimize performance'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'medium',
    explanation: 'useReducer is used for managing complex state logic, similar to Redux but local to component.',
    tags: ['hooks', 'state-management', 'useReducer']
  },
  {
    id: 'react-10',
    question: 'What are React fragments used for?',
    options: [
      'To break components',
      'To group multiple elements without adding extra DOM nodes',
      'To create reusable components',
      'To handle errors'
    ],
    correct: 1,
    skill: 'react',
    difficulty: 'medium',
    explanation: 'React fragments allow you to group multiple elements without adding an extra wrapper element to the DOM.',
    tags: ['fragments', 'dom', 'jsx']
  },

  // Python Questions - Easy
  {
    id: 'python-1',
    question: 'Which Python data structure is ordered and mutable?',
    options: ['tuple', 'set', 'list', 'frozenset'],
    correct: 2,
    skill: 'python',
    difficulty: 'easy',
    explanation: 'Lists in Python are ordered (maintain insertion order) and mutable (can be changed after creation).',
    tags: ['data-structures', 'lists']
  },
  {
    id: 'python-2',
    question: 'How do you create a comment in Python?',
    options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
    correct: 2,
    skill: 'python',
    difficulty: 'easy',
    explanation: 'Python uses # for single-line comments and triple quotes for multi-line comments.',
    tags: ['syntax', 'comments']
  },
  {
    id: 'python-3',
    question: 'Which method is used to add an item to a list?',
    options: ['add()', 'append()', 'insert()', 'push()'],
    correct: 1,
    skill: 'python',
    difficulty: 'easy',
    explanation: 'append() method adds an item to the end of a list in Python.',
    tags: ['lists', 'methods']
  },
  {
    id: 'python-4',
    question: 'What is the correct way to create a dictionary in Python?',
    options: ['dict = []', 'dict = {}', 'dict = ()', 'dict = set()'],
    correct: 1,
    skill: 'python',
    difficulty: 'easy',
    explanation: 'Dictionaries in Python are created using curly braces {} or dict() constructor.',
    tags: ['dictionaries', 'syntax']
  },
  {
    id: 'python-5',
    question: 'Which keyword is used to define a function in Python?',
    options: ['function', 'def', 'func', 'define'],
    correct: 1,
    skill: 'python',
    difficulty: 'easy',
    explanation: 'The def keyword is used to define functions in Python.',
    tags: ['functions', 'syntax']
  },

  // Algorithms Questions - Easy
  {
    id: 'algo-1',
    question: 'What is the time complexity of bubble sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correct: 2,
    skill: 'algorithms',
    difficulty: 'easy',
    explanation: 'Bubble sort has O(n²) time complexity in worst and average cases due to nested loops.',
    tags: ['sorting', 'time-complexity']
  },
  {
    id: 'algo-2',
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1,
    skill: 'algorithms',
    difficulty: 'easy',
    explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.',
    tags: ['data-structures', 'stack']
  },
  {
    id: 'algo-3',
    question: 'What is the time complexity of binary search?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correct: 1,
    skill: 'algorithms',
    difficulty: 'easy',
    explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space in each iteration.',
    tags: ['searching', 'time-complexity']
  },
  {
    id: 'algo-4',
    question: 'Which data structure uses FIFO (First In, First Out) principle?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correct: 1,
    skill: 'algorithms',
    difficulty: 'easy',
    explanation: 'Queue follows FIFO principle where the first element added is the first one to be removed.',
    tags: ['data-structures', 'queue']
  },
  {
    id: 'algo-5',
    question: 'What is a linked list?',
    options: [
      'A list stored in continuous memory',
      'A linear data structure where elements are stored in nodes',
      'A sorted array',
      'A hash table'
    ],
    correct: 1,
    skill: 'algorithms',
    difficulty: 'easy',
    explanation: 'A linked list is a linear data structure where elements are stored in nodes, each containing data and a reference to the next node.',
    tags: ['data-structures', 'linked-list']
  },

  // Database Questions - Easy
  {
    id: 'db-1',
    question: 'Which SQL command is used to retrieve data from a database?',
    options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
    correct: 2,
    skill: 'databases',
    difficulty: 'easy',
    explanation: 'SELECT is the SQL command used to query and retrieve data from database tables.',
    tags: ['sql', 'queries']
  },
  {
    id: 'db-2',
    question: 'What does CRUD stand for?',
    options: [
      'Create, Read, Update, Delete',
      'Copy, Read, Update, Delete',
      'Create, Retrieve, Update, Delete',
      'Create, Read, Upload, Delete'
    ],
    correct: 0,
    skill: 'databases',
    difficulty: 'easy',
    explanation: 'CRUD represents the four basic operations: Create, Read, Update, and Delete.',
    tags: ['crud', 'operations']
  },
  {
    id: 'db-3',
    question: 'What is a primary key?',
    options: [
      'The most important key',
      'A unique identifier for each record in a table',
      'A key used for encryption',
      'The first column in a table'
    ],
    correct: 1,
    skill: 'databases',
    difficulty: 'easy',
    explanation: 'A primary key is a unique identifier that ensures each record in a table can be uniquely identified.',
    tags: ['primary-key', 'database-design']
  },
  {
    id: 'db-4',
    question: 'Which SQL clause is used to filter results?',
    options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
    correct: 2,
    skill: 'databases',
    difficulty: 'easy',
    explanation: 'WHERE clause is used to filter records based on specified conditions.',
    tags: ['sql', 'filtering']
  },
  {
    id: 'db-5',
    question: 'What is a foreign key?',
    options: [
      'A key from another country',
      'A field that links to the primary key of another table',
      'An encrypted key',
      'A backup key'
    ],
    correct: 1,
    skill: 'databases',
    difficulty: 'easy',
    explanation: 'A foreign key is a field that refers to the primary key in another table, creating a link between tables.',
    tags: ['foreign-key', 'relationships']
  },

  // Node.js Questions - Easy
  {
    id: 'node-1',
    question: 'Which module is used to create HTTP servers in Node.js?',
    options: ['fs', 'http', 'path', 'url'],
    correct: 1,
    skill: 'nodejs',
    difficulty: 'easy',
    explanation: 'The http module provides functionality to create HTTP servers and clients.',
    tags: ['http', 'servers']
  },
  {
    id: 'node-2',
    question: 'What is npm?',
    options: [
      'Node Package Manager',
      'New Programming Method',
      'Network Protocol Manager',
      'Node Performance Monitor'
    ],
    correct: 0,
    skill: 'nodejs',
    difficulty: 'easy',
    explanation: 'npm (Node Package Manager) is the default package manager for Node.js.',
    tags: ['npm', 'package-management']
  },
  {
    id: 'node-3',
    question: 'Which file contains project dependencies in Node.js?',
    options: ['dependencies.json', 'package.json', 'node.json', 'config.json'],
    correct: 1,
    skill: 'nodejs',
    difficulty: 'easy',
    explanation: 'package.json contains project metadata and dependencies information.',
    tags: ['package.json', 'dependencies']
  },
  {
    id: 'node-4',
    question: 'What is the purpose of require() in Node.js?',
    options: [
      'To make something mandatory',
      'To import modules',
      'To create requirements',
      'To validate input'
    ],
    correct: 1,
    skill: 'nodejs',
    difficulty: 'easy',
    explanation: 'require() is used to import modules, JSON files, and local files in Node.js.',
    tags: ['modules', 'require']
  },
  {
    id: 'node-5',
    question: 'Which method is used to read files asynchronously in Node.js?',
    options: ['fs.readFile()', 'fs.readFileSync()', 'fs.read()', 'fs.open()'],
    correct: 0,
    skill: 'nodejs',
    difficulty: 'easy',
    explanation: 'fs.readFile() reads files asynchronously, while fs.readFileSync() reads synchronously.',
    tags: ['filesystem', 'async']
  },

  // System Design Questions - Medium
  {
    id: 'sys-1',
    question: 'What is horizontal scaling?',
    options: [
      'Adding more power to existing machines',
      'Adding more machines to the pool of resources',
      'Scaling vertically',
      'Reducing system load'
    ],
    correct: 1,
    skill: 'system-design',
    difficulty: 'medium',
    explanation: 'Horizontal scaling means adding more servers to handle increased load, rather than upgrading existing hardware.',
    tags: ['scaling', 'architecture']
  },
  {
    id: 'sys-2',
    question: 'What is a load balancer?',
    options: [
      'A tool to balance workload among developers',
      'A system that distributes incoming requests across multiple servers',
      'A database optimization tool',
      'A code balancing utility'
    ],
    correct: 1,
    skill: 'system-design',
    difficulty: 'medium',
    explanation: 'A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed.',
    tags: ['load-balancing', 'distribution']
  },
  {
    id: 'sys-3',
    question: 'What is caching?',
    options: [
      'Storing money',
      'Temporarily storing frequently accessed data for faster retrieval',
      'Hiding data',
      'Compressing data'
    ],
    correct: 1,
    skill: 'system-design',
    difficulty: 'medium',
    explanation: 'Caching stores frequently accessed data in fast storage to reduce access time and system load.',
    tags: ['caching', 'performance']
  },
  {
    id: 'sys-4',
    question: 'What is the CAP theorem?',
    options: [
      'Consistency, Availability, Partition tolerance',
      'Create, Access, Process',
      'Cache, API, Performance',
      'Compute, Analyze, Present'
    ],
    correct: 0,
    skill: 'system-design',
    difficulty: 'hard',
    explanation: 'CAP theorem states that distributed systems can only guarantee two out of three: Consistency, Availability, and Partition tolerance.',
    tags: ['cap-theorem', 'distributed-systems']
  },
  {
    id: 'sys-5',
    question: 'What is microservices architecture?',
    options: [
      'Very small applications',
      'An architectural approach where applications are built as a collection of loosely coupled services',
      'Microscopic code optimization',
      'A type of database'
    ],
    correct: 1,
    skill: 'system-design',
    difficulty: 'medium',
    explanation: 'Microservices architecture breaks down applications into small, independent services that communicate over well-defined APIs.',
    tags: ['microservices', 'architecture']
  },

  // Security Questions - Medium
  {
    id: 'sec-1',
    question: 'What is SQL injection?',
    options: [
      'A medical procedure',
      'A type of attack where malicious SQL code is inserted into application queries',
      'A database optimization technique',
      'A way to inject data into SQL'
    ],
    correct: 1,
    skill: 'security',
    difficulty: 'medium',
    explanation: 'SQL injection is a code injection technique where malicious SQL statements are inserted into application entry points.',
    tags: ['sql-injection', 'vulnerabilities']
  },
  {
    id: 'sec-2',
    question: 'What is HTTPS?',
    options: [
      'Hypertext Transfer Protocol Secure',
      'High Transfer Protocol System',
      'Hypertext Transport Protocol Standard',
      'HTTP with extra features'
    ],
    correct: 0,
    skill: 'security',
    difficulty: 'easy',
    explanation: 'HTTPS is HTTP over TLS/SSL, providing encrypted communication between client and server.',
    tags: ['https', 'encryption']
  },
  {
    id: 'sec-3',
    question: 'What is Cross-Site Scripting (XSS)?',
    options: [
      'A legitimate scripting technique',
      'A vulnerability where malicious scripts are injected into trusted websites',
      'A cross-platform development method',
      'A type of CSS styling'
    ],
    correct: 1,
    skill: 'security',
    difficulty: 'medium',
    explanation: 'XSS attacks inject malicious scripts into web pages viewed by other users, potentially stealing data or performing actions.',
    tags: ['xss', 'web-security']
  },
  {
    id: 'sec-4',
    question: 'What is authentication vs authorization?',
    options: [
      'They are the same thing',
      'Authentication verifies identity, authorization determines permissions',
      'Authorization verifies identity, authentication determines permissions',
      'Both verify identity'
    ],
    correct: 1,
    skill: 'security',
    difficulty: 'medium',
    explanation: 'Authentication verifies who you are, while authorization determines what you can access or do.',
    tags: ['authentication', 'authorization']
  },
  {
    id: 'sec-5',
    question: 'What is a JWT token?',
    options: [
      'Java Web Token',
      'JSON Web Token',
      'JavaScript Web Token',
      'Joint Web Token'
    ],
    correct: 1,
    skill: 'security',
    difficulty: 'medium',
    explanation: 'JWT (JSON Web Token) is a compact, URL-safe means of representing claims between two parties.',
    tags: ['jwt', 'tokens', 'authentication']
  },

  // DevOps Questions - Medium
  {
    id: 'devops-1',
    question: 'What is Docker?',
    options: [
      'A shipping company',
      'A containerization platform',
      'A database system',
      'A programming language'
    ],
    correct: 1,
    skill: 'devops',
    difficulty: 'medium',
    explanation: 'Docker is a platform that uses containerization to package applications and their dependencies.',
    tags: ['docker', 'containerization']
  },
  {
    id: 'devops-2',
    question: 'What is CI/CD?',
    options: [
      'Continuous Integration/Continuous Deployment',
      'Code Integration/Code Deployment',
      'Continuous Improvement/Continuous Development',
      'Central Integration/Central Deployment'
    ],
    correct: 0,
    skill: 'devops',
    difficulty: 'medium',
    explanation: 'CI/CD is a practice that automates the integration and deployment of code changes.',
    tags: ['ci-cd', 'automation']
  },
  {
    id: 'devops-3',
    question: 'What is Infrastructure as Code (IaC)?',
    options: [
      'Writing infrastructure documentation',
      'Managing infrastructure through code and automation',
      'Coding on infrastructure',
      'Infrastructure for coding'
    ],
    correct: 1,
    skill: 'devops',
    difficulty: 'medium',
    explanation: 'IaC is the practice of managing and provisioning infrastructure through machine-readable definition files.',
    tags: ['iac', 'automation', 'infrastructure']
  },
  {
    id: 'devops-4',
    question: 'What is Kubernetes?',
    options: [
      'A Greek philosopher',
      'A container orchestration platform',
      'A database system',
      'A monitoring tool'
    ],
    correct: 1,
    skill: 'devops',
    difficulty: 'hard',
    explanation: 'Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management.',
    tags: ['kubernetes', 'orchestration']
  },
  {
    id: 'devops-5',
    question: 'What is monitoring in DevOps?',
    options: [
      'Watching developers work',
      'Observing system performance and health',
      'Monitoring code quality',
      'Tracking project progress'
    ],
    correct: 1,
    skill: 'devops',
    difficulty: 'medium',
    explanation: 'Monitoring involves observing system performance, availability, and health to ensure optimal operation.',
    tags: ['monitoring', 'observability']
  },

  // Testing Questions - Easy to Medium
  {
    id: 'test-1',
    question: 'What is unit testing?',
    options: [
      'Testing individual components in isolation',
      'Testing the entire application',
      'Testing user interfaces',
      'Testing network connections'
    ],
    correct: 0,
    skill: 'testing',
    difficulty: 'easy',
    explanation: 'Unit testing involves testing individual components or functions in isolation to ensure they work correctly.',
    tags: ['unit-testing', 'testing-types']
  },
  {
    id: 'test-2',
    question: 'What is the difference between integration and end-to-end testing?',
    options: [
      'No difference',
      'Integration tests components together, E2E tests complete user workflows',
      'Integration is manual, E2E is automated',
      'Integration is faster than E2E'
    ],
    correct: 1,
    skill: 'testing',
    difficulty: 'medium',
    explanation: 'Integration testing verifies that different components work together, while E2E testing validates complete user workflows.',
    tags: ['integration-testing', 'e2e-testing']
  },
  {
    id: 'test-3',
    question: 'What is Test-Driven Development (TDD)?',
    options: [
      'Testing after development',
      'Writing tests before writing code',
      'Testing during development',
      'Automated testing only'
    ],
    correct: 1,
    skill: 'testing',
    difficulty: 'medium',
    explanation: 'TDD is a development approach where tests are written before the actual code implementation.',
    tags: ['tdd', 'development-methodology']
  },
  {
    id: 'test-4',
    question: 'What is mocking in testing?',
    options: [
      'Making fun of code',
      'Creating fake objects to simulate real dependencies',
      'Testing performance',
      'Testing user interfaces'
    ],
    correct: 1,
    skill: 'testing',
    difficulty: 'medium',
    explanation: 'Mocking involves creating fake objects that simulate the behavior of real dependencies for isolated testing.',
    tags: ['mocking', 'test-doubles']
  },
  {
    id: 'test-5',
    question: 'What is code coverage?',
    options: [
      'How much code is documented',
      'The percentage of code executed during testing',
      'How much code is optimized',
      'The amount of code written'
    ],
    correct: 1,
    skill: 'testing',
    difficulty: 'easy',
    explanation: 'Code coverage measures the percentage of code that is executed during automated tests.',
    tags: ['code-coverage', 'metrics']
  }
];

export const getQuestionsBySkillAndDifficulty = (
  skills: string[], 
  difficulty: string, 
  count: number
): Question[] => {
  let filtered = questionBank;
  
  // Filter by skills if specified
  if (skills.length > 0) {
    filtered = filtered.filter(q => skills.includes(q.skill));
  }
  
  // Filter by difficulty if specified
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  // If no questions match criteria, return all questions
  if (filtered.length === 0) {
    filtered = questionBank;
  }
  
  // Shuffle and return requested count
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getSkillCategories = () => {
  const skills = [...new Set(questionBank.map(q => q.skill))];
  return skills.map(skill => {
    const questions = questionBank.filter(q => q.skill === skill);
    const skillName = skill.charAt(0).toUpperCase() + skill.slice(1).replace('-', ' ');
    
    const icons: { [key: string]: string } = {
      'javascript': '🟨',
      'react': '⚛️',
      'nodejs': '🟢',
      'python': '🐍',
      'algorithms': '🧮',
      'databases': '🗄️',
      'system-design': '🏗️',
      'security': '🔒',
      'devops': '⚙️',
      'testing': '🧪'
    };
    
    return {
      id: skill,
      name: skillName,
      icon: icons[skill] || '📚',
      questions: questions.length
    };
  });
};