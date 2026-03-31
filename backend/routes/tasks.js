const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// Predefined 20-day task plan
const PREDEFINED_TASKS = [
  // Day 1
  { day: 1, category: 'DSA', title: 'Arrays - Two Sum, Best Time to Buy Stock', timeSlot: 'morning', priority: 'high' },
  { day: 1, category: 'LeetCode', title: 'Solve 3 Easy Array problems', timeSlot: 'morning', priority: 'high' },
  { day: 1, category: 'SpringBoot', title: 'Spring Boot project setup, application.properties', timeSlot: 'evening', priority: 'high' },
  { day: 1, category: 'Academics', title: 'Review DAA unit 1 - Asymptotic Analysis', timeSlot: 'college', priority: 'medium' },
  { day: 1, category: 'Health', title: '8 glasses water, 20 min walk, sleep by 11 PM', timeSlot: 'night', priority: 'medium' },
  { day: 1, category: 'Communication', title: 'Speak on "My goals for the next 20 days" (5 min)', timeSlot: 'night', priority: 'low' },
  // Day 2
  { day: 2, category: 'DSA', title: 'Arrays - Kadane\'s Algorithm, Sliding Window', timeSlot: 'morning', priority: 'high' },
  { day: 2, category: 'LeetCode', title: 'Maximum Subarray, Minimum Size Subarray Sum', timeSlot: 'morning', priority: 'high' },
  { day: 2, category: 'SpringBoot', title: 'REST Controllers, @GetMapping, @PostMapping', timeSlot: 'evening', priority: 'high' },
  { day: 2, category: 'Academics', title: 'DAA - Divide and Conquer (Merge Sort)', timeSlot: 'college', priority: 'medium' },
  { day: 2, category: 'Health', title: 'Morning stretch routine, 8 glasses water', timeSlot: 'morning', priority: 'medium' },
  { day: 2, category: 'Communication', title: 'Describe your favorite project to an imaginary interviewer', timeSlot: 'night', priority: 'low' },
  // Day 3
  { day: 3, category: 'DSA', title: 'Strings - Anagrams, Palindrome, Longest Substring', timeSlot: 'morning', priority: 'high' },
  { day: 3, category: 'LeetCode', title: 'Valid Anagram, Longest Substring Without Repeating', timeSlot: 'morning', priority: 'high' },
  { day: 3, category: 'SpringBoot', title: 'Spring Data JPA, Entity creation, Repository', timeSlot: 'evening', priority: 'high' },
  { day: 3, category: 'Academics', title: 'DAA - Quick Sort analysis and implementation', timeSlot: 'college', priority: 'medium' },
  { day: 3, category: 'Health', title: '25 min workout, track sleep hours', timeSlot: 'night', priority: 'medium' },
  { day: 3, category: 'Communication', title: 'Practice answering "Tell me about yourself"', timeSlot: 'night', priority: 'low' },
  // Day 4
  { day: 4, category: 'DSA', title: 'Hashing - HashMap, HashSet problems', timeSlot: 'morning', priority: 'high' },
  { day: 4, category: 'LeetCode', title: 'Group Anagrams, Two Sum (HashMap approach)', timeSlot: 'morning', priority: 'high' },
  { day: 4, category: 'SpringBoot', title: 'CRUD API - Create and Read endpoints', timeSlot: 'evening', priority: 'high' },
  { day: 4, category: 'Academics', title: 'Unit test preparation, past papers review', timeSlot: 'college', priority: 'high' },
  { day: 4, category: 'Health', title: '8 glasses water, 30 min walk', timeSlot: 'evening', priority: 'medium' },
  { day: 4, category: 'Communication', title: 'Explain HashMap vs HashSet to camera/mirror', timeSlot: 'night', priority: 'low' },
  // Day 5
  { day: 5, category: 'DSA', title: 'Linked List - Reverse, Detect Cycle, Merge', timeSlot: 'morning', priority: 'high' },
  { day: 5, category: 'LeetCode', title: 'Reverse Linked List, Linked List Cycle', timeSlot: 'morning', priority: 'high' },
  { day: 5, category: 'SpringBoot', title: 'CRUD API - Update and Delete, Exception handling', timeSlot: 'evening', priority: 'high' },
  { day: 5, category: 'Academics', title: 'Greedy Algorithms - Activity Selection', timeSlot: 'college', priority: 'medium' },
  { day: 5, category: 'Health', title: 'Rest day - gentle walk, good sleep', timeSlot: 'night', priority: 'medium' },
  { day: 5, category: 'Communication', title: 'Speak on "Why Java for backend development?"', timeSlot: 'night', priority: 'low' },
  // Day 6
  { day: 6, category: 'DSA', title: 'Stack & Queue - Valid Parentheses, Min Stack', timeSlot: 'morning', priority: 'high' },
  { day: 6, category: 'LeetCode', title: 'Valid Parentheses, Daily Temperatures', timeSlot: 'morning', priority: 'high' },
  { day: 6, category: 'SpringBoot', title: 'Spring Security basics, JWT configuration', timeSlot: 'evening', priority: 'high' },
  { day: 6, category: 'Academics', title: 'Huffman Coding, Kruskal\'s algorithm', timeSlot: 'college', priority: 'medium' },
  { day: 6, category: 'Health', title: 'Workout session 30 min, 8 glasses water', timeSlot: 'morning', priority: 'medium' },
  { day: 6, category: 'Communication', title: 'Mock interview: behavioral questions practice', timeSlot: 'night', priority: 'medium' },
  // Day 7
  { day: 7, category: 'DSA', title: 'Trees - BFS, DFS, Level Order Traversal', timeSlot: 'morning', priority: 'high' },
  { day: 7, category: 'LeetCode', title: 'Binary Tree Level Order, Max Depth of Binary Tree', timeSlot: 'morning', priority: 'high' },
  { day: 7, category: 'SpringBoot', title: 'JWT auth implementation, token refresh', timeSlot: 'evening', priority: 'high' },
  { day: 7, category: 'Academics', title: 'Weekly revision - all topics covered', timeSlot: 'college', priority: 'high' },
  { day: 7, category: 'Health', title: 'Weekly health check - measure progress', timeSlot: 'evening', priority: 'medium' },
  { day: 7, category: 'Communication', title: 'Reflect on week - what improved, what to work on', timeSlot: 'night', priority: 'medium' },
  // Day 8
  { day: 8, category: 'DSA', title: 'BST - Search, Insert, Validate BST', timeSlot: 'morning', priority: 'high' },
  { day: 8, category: 'LeetCode', title: 'Validate Binary Search Tree, Inorder Traversal', timeSlot: 'morning', priority: 'high' },
  { day: 8, category: 'SpringBoot', title: 'Microservices intro, Spring Cloud', timeSlot: 'evening', priority: 'high' },
  { day: 8, category: 'Academics', title: 'Dynamic Programming introduction', timeSlot: 'college', priority: 'medium' },
  { day: 8, category: 'Health', title: '30 min jog or walk, healthy meal plan', timeSlot: 'morning', priority: 'medium' },
  { day: 8, category: 'Communication', title: 'Explain microservices vs monolith architecture', timeSlot: 'night', priority: 'low' },
  // Day 9
  { day: 9, category: 'DSA', title: 'Heap - Kth Largest Element, Top K Frequent', timeSlot: 'morning', priority: 'high' },
  { day: 9, category: 'LeetCode', title: 'Kth Largest in Array, Find Median from Data Stream', timeSlot: 'morning', priority: 'high' },
  { day: 9, category: 'SpringBoot', title: 'Database optimization, indexing, query tuning', timeSlot: 'evening', priority: 'high' },
  { day: 9, category: 'Academics', title: 'DP - Fibonacci, Coin Change, 0/1 Knapsack', timeSlot: 'college', priority: 'medium' },
  { day: 9, category: 'Health', title: 'Yoga or stretching, 8 glasses water', timeSlot: 'night', priority: 'medium' },
  { day: 9, category: 'Communication', title: 'Practice explaining a complex algorithm simply', timeSlot: 'night', priority: 'low' },
  // Day 10
  { day: 10, category: 'DSA', title: 'Graphs - BFS, DFS, Number of Islands', timeSlot: 'morning', priority: 'high' },
  { day: 10, category: 'LeetCode', title: 'Number of Islands, Clone Graph', timeSlot: 'morning', priority: 'high' },
  { day: 10, category: 'SpringBoot', title: 'REST API best practices, versioning, documentation', timeSlot: 'evening', priority: 'high' },
  { day: 10, category: 'Academics', title: 'Mid-point review - all subjects status', timeSlot: 'college', priority: 'high' },
  { day: 10, category: 'Health', title: 'Full rest + mental reset, 8 hours sleep target', timeSlot: 'night', priority: 'medium' },
  { day: 10, category: 'Communication', title: '10-day progress speech: what you\'ve learned', timeSlot: 'night', priority: 'medium' },
  // Days 11-20 (condensed but complete)
  { day: 11, category: 'DSA', title: 'Dynamic Programming - LCS, Edit Distance', timeSlot: 'morning', priority: 'high' },
  { day: 11, category: 'LeetCode', title: 'Longest Common Subsequence, Edit Distance', timeSlot: 'morning', priority: 'high' },
  { day: 11, category: 'SpringBoot', title: 'Kafka/RabbitMQ intro, async messaging', timeSlot: 'evening', priority: 'high' },
  { day: 11, category: 'Academics', title: 'Graph algorithms - Dijkstra, Bellman-Ford', timeSlot: 'college', priority: 'medium' },
  { day: 11, category: 'Health', title: 'Workout + protein-rich diet focus', timeSlot: 'morning', priority: 'medium' },
  { day: 11, category: 'Communication', title: 'Explain REST API design to non-technical friend', timeSlot: 'night', priority: 'low' },
  { day: 12, category: 'DSA', title: 'Backtracking - N-Queens, Subsets, Permutations', timeSlot: 'morning', priority: 'high' },
  { day: 12, category: 'LeetCode', title: 'Subsets, Permutations, Combination Sum', timeSlot: 'morning', priority: 'high' },
  { day: 12, category: 'SpringBoot', title: 'Docker containerization of Spring Boot app', timeSlot: 'evening', priority: 'high' },
  { day: 12, category: 'Academics', title: 'NP Completeness, P vs NP', timeSlot: 'college', priority: 'medium' },
  { day: 12, category: 'Health', title: '8 glasses water, evening walk 25 min', timeSlot: 'evening', priority: 'medium' },
  { day: 12, category: 'Communication', title: 'Mock technical interview - DSA questions', timeSlot: 'night', priority: 'medium' },
  { day: 13, category: 'DSA', title: 'Greedy - Jump Game, Gas Station', timeSlot: 'morning', priority: 'high' },
  { day: 13, category: 'LeetCode', title: 'Jump Game I & II, Gas Station', timeSlot: 'morning', priority: 'high' },
  { day: 13, category: 'SpringBoot', title: 'CI/CD pipeline setup, GitHub Actions', timeSlot: 'evening', priority: 'high' },
  { day: 13, category: 'Academics', title: 'Semester exam strategy, topic priority', timeSlot: 'college', priority: 'high' },
  { day: 13, category: 'Health', title: 'Full workout session, track sleep', timeSlot: 'morning', priority: 'medium' },
  { day: 13, category: 'Communication', title: 'Speak about your Spring Boot project for 5 min', timeSlot: 'night', priority: 'medium' },
  { day: 14, category: 'DSA', title: 'Trie - Implement, Word Search, Autocomplete', timeSlot: 'morning', priority: 'high' },
  { day: 14, category: 'LeetCode', title: 'Implement Trie, Word Search II', timeSlot: 'morning', priority: 'high' },
  { day: 14, category: 'SpringBoot', title: 'AWS deployment - EC2 or Railway', timeSlot: 'evening', priority: 'high' },
  { day: 14, category: 'Academics', title: 'Two weeks revision - all units', timeSlot: 'college', priority: 'high' },
  { day: 14, category: 'Health', title: 'Rest day, 8 hours sleep, meal prep', timeSlot: 'night', priority: 'medium' },
  { day: 14, category: 'Communication', title: 'Group discussion practice on tech topic', timeSlot: 'night', priority: 'medium' },
  { day: 15, category: 'DSA', title: 'Advanced DP - Matrix Chain, Palindrome', timeSlot: 'morning', priority: 'high' },
  { day: 15, category: 'LeetCode', title: 'Longest Palindromic Subsequence, Burst Balloons', timeSlot: 'morning', priority: 'high' },
  { day: 15, category: 'SpringBoot', title: 'Complete project: add authentication + CRUD', timeSlot: 'evening', priority: 'high' },
  { day: 15, category: 'Academics', title: 'Mock exam practice - timed sessions', timeSlot: 'college', priority: 'high' },
  { day: 15, category: 'Health', title: '30 min run, hydration tracking', timeSlot: 'morning', priority: 'medium' },
  { day: 15, category: 'Communication', title: '15-day reflection: present your growth story', timeSlot: 'night', priority: 'medium' },
  { day: 16, category: 'DSA', title: 'Bit Manipulation - Single Number, Power of Two', timeSlot: 'morning', priority: 'high' },
  { day: 16, category: 'LeetCode', title: 'Single Number, Counting Bits, Reverse Bits', timeSlot: 'morning', priority: 'high' },
  { day: 16, category: 'SpringBoot', title: 'Project testing - JUnit, Mockito', timeSlot: 'evening', priority: 'high' },
  { day: 16, category: 'Academics', title: 'Final exam preparation - weak topics', timeSlot: 'college', priority: 'high' },
  { day: 16, category: 'Health', title: 'Workout + sleep 8 hours', timeSlot: 'morning', priority: 'medium' },
  { day: 16, category: 'Communication', title: 'Technical presentation: explain your project', timeSlot: 'night', priority: 'medium' },
  { day: 17, category: 'DSA', title: 'System Design basics - scalability, caching', timeSlot: 'morning', priority: 'high' },
  { day: 17, category: 'LeetCode', title: 'LRU Cache, Design Twitter', timeSlot: 'morning', priority: 'high' },
  { day: 17, category: 'SpringBoot', title: 'Deploy full project, write README', timeSlot: 'evening', priority: 'high' },
  { day: 17, category: 'Academics', title: 'Exam simulation - full paper', timeSlot: 'college', priority: 'high' },
  { day: 17, category: 'Health', title: 'Light exercise, focus on mental clarity', timeSlot: 'evening', priority: 'medium' },
  { day: 17, category: 'Communication', title: 'Practice "walk me through your resume"', timeSlot: 'night', priority: 'medium' },
  { day: 18, category: 'DSA', title: 'Mock interview - random medium problems', timeSlot: 'morning', priority: 'high' },
  { day: 18, category: 'LeetCode', title: 'Timed practice: 2 Medium problems in 60 min', timeSlot: 'morning', priority: 'high' },
  { day: 18, category: 'SpringBoot', title: 'Code review, optimize and refactor project', timeSlot: 'evening', priority: 'high' },
  { day: 18, category: 'Academics', title: 'Final revision - formulas and key concepts', timeSlot: 'college', priority: 'high' },
  { day: 18, category: 'Health', title: '8 glasses water, 30 min walk, 8 hrs sleep', timeSlot: 'night', priority: 'medium' },
  { day: 18, category: 'Communication', title: 'HR round questions: strengths, weaknesses, salary', timeSlot: 'night', priority: 'medium' },
  { day: 19, category: 'DSA', title: 'Revision - weak areas from last 18 days', timeSlot: 'morning', priority: 'high' },
  { day: 19, category: 'LeetCode', title: 'Solve 5 problems from weak topics', timeSlot: 'morning', priority: 'high' },
  { day: 19, category: 'SpringBoot', title: 'Project portfolio - update GitHub, LinkedIn', timeSlot: 'evening', priority: 'high' },
  { day: 19, category: 'Academics', title: 'Last minute preparation, mind maps', timeSlot: 'college', priority: 'high' },
  { day: 19, category: 'Health', title: 'Light walk, good sleep for final day', timeSlot: 'night', priority: 'medium' },
  { day: 19, category: 'Communication', title: 'Final mock interview - full round', timeSlot: 'night', priority: 'high' },
  { day: 20, category: 'DSA', title: 'Final review - all data structures cheatsheet', timeSlot: 'morning', priority: 'high' },
  { day: 20, category: 'LeetCode', title: 'Solve top interview question - Hard problem', timeSlot: 'morning', priority: 'high' },
  { day: 20, category: 'SpringBoot', title: 'Final project demo, record video walkthrough', timeSlot: 'evening', priority: 'high' },
  { day: 20, category: 'Academics', title: '20-day academic summary, grade projection', timeSlot: 'college', priority: 'medium' },
  { day: 20, category: 'Health', title: 'Celebrate! Treat yourself healthily', timeSlot: 'night', priority: 'medium' },
  { day: 20, category: 'Communication', title: '20-day achievement speech - record yourself', timeSlot: 'night', priority: 'high' },
];

// @route GET /api/tasks/today
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let tasks = await Task.find({ userId: req.user._id, date: today }).sort({ timeSlot: 1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/tasks/date/:date
router.get('/date/:date', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id, date: req.params.date }).sort({ timeSlot: 1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/tasks/generate
router.post('/generate', protect, async (req, res) => {
  try {
    const { startDate } = req.body;
    const start = new Date(startDate || Date.now());
    const tasksToCreate = [];

    for (const taskTemplate of PREDEFINED_TASKS) {
      const taskDate = new Date(start);
      taskDate.setDate(taskDate.getDate() + taskTemplate.day - 1);
      const dateStr = taskDate.toISOString().split('T')[0];

      const exists = await Task.findOne({ userId: req.user._id, date: dateStr, title: taskTemplate.title });
      if (!exists) {
        tasksToCreate.push({ ...taskTemplate, userId: req.user._id, date: dateStr });
      }
    }

    if (tasksToCreate.length > 0) {
      await Task.insertMany(tasksToCreate);
    }

    res.json({ success: true, message: `Generated ${tasksToCreate.length} tasks`, count: tasksToCreate.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PATCH /api/tasks/:id/complete
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
