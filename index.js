// ═══════════════════════════════════════════════════════════════════════════════
// POLITICIAN TEST FRAMEWORK
// Classification: UNCLASSIFIED
// Document Control Number: PTF-1984-001
// Effective Date: 1984-01-01
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * BUREAUCRATIC TEST SUITE
 *
 * A test framework with the gravitas of 1980s government documentation.
 * Supports configurable verbosity and generates print-ready markdown reports.
 */

import { argv } from 'node:process';
import { Reporter } from './reporters/superclass.js';
import { TerminalReporter } from './reporters/terminal.js';
import { MarkdownReporter } from './reporters/markdown.js';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 1: CONFIGURATION AND STATE MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

const VERBOSITY_LEVELS = {
  SILENT: 0,      // No output
  QUIET: 1,       // Errors only
  NORMAL: 2,      // Errors and test results
  VERBOSE: 3,     // All output including successes
  DEBUG: 4        // Everything including debug info
};

// Parse format from command line arguments
function parseFormat() {
  const formatArg = argv.find(arg => arg.startsWith('--format='));
  if (formatArg) {
    const format = formatArg.split('=')[1];
    return format;
  }
  return 'terminal'; // Default format
}

// Create appropriate reporter based on format
function createReporter(format, metadata) {
  switch (format) {
    case 'markdown':
      return new MarkdownReporter(metadata);
    case 'terminal':
      return new TerminalReporter(metadata);
    case 'ascii':
      return new Reporter(metadata);
    default:
      return new TerminalReporter(metadata);
  }
}

class TestSuite {
  constructor(name, options = {}) {
    this.name = name;
    this.verbosity = options.verbosity ?? VERBOSITY_LEVELS.VERBOSE;
    this.testNumber = 0;
    this.sectionNumber = 0;
    this.failures = [];
    this.successes = [];
    this.startTime = Date.now();

    const metadata = {
      date: new Date().toISOString().split('T')[0],
      classification: options.classification ?? 'UNCLASSIFIED',
      documentId: options.documentId ?? `PTF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...options.metadata
    };

    // Create reporter based on format option or auto-detect from argv
    const format = options.format ?? parseFormat();
    this.reporter = options.reporter ?? createReporter(format, metadata);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.1: Document Header and Structure
  // ────────────────────────────────────────────────────────────────────────────

  header() {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;
    this.reporter.header(this.name);
    return this;
  }

  section(title) {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;

    this.sectionNumber++;
    this.testNumber = 0;
    this.reporter.section(this.sectionNumber, title);

    return this;
  }

  subsection(title) {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;
    this.reporter.subsection(this.sectionNumber, this.testNumber + 1, title);
    return this;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.2: Code Display and Formatting
  // ────────────────────────────────────────────────────────────────────────────

  code(language, content, label = null) {
    if (this.verbosity < VERBOSITY_LEVELS.VERBOSE) return this;
    this.reporter.code(language, content, label);
    return this;
  }

  javascript(content, label = null) {
    return this.code('javascript', content, label);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.3: Test Execution and Assertion
  // ────────────────────────────────────────────────────────────────────────────

  test(description, assertion) {
    this.testNumber++;
    const testId = `${this.sectionNumber}.${this.testNumber}`;

    const result = {
      id: testId,
      description,
      passed: false,
      actual: null,
      expected: null,
      message: null
    };

    try {
      const assertionResult = assertion();

      if (typeof assertionResult === 'boolean') {
        result.passed = assertionResult;
      } else if (assertionResult && typeof assertionResult === 'object') {
        result.passed = assertionResult.passed ?? false;
        result.actual = assertionResult.actual;
        result.expected = assertionResult.expected;
        result.message = assertionResult.message;
      }
    } catch (error) {
      result.passed = false;
      result.message = error.message;
    }

    if (result.passed) {
      this.successes.push(result);
      if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
        this.reporter.testPassed(testId, description);
      }
    } else {
      this.failures.push(result);
      if (this.verbosity >= VERBOSITY_LEVELS.QUIET) {
        this.reporter.testFailed(testId, description, result);
      }
    }

    return this;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.4: Comparison Utilities
  // ────────────────────────────────────────────────────────────────────────────

  assertEqual(actual, expected, description) {
    return this.test(description, () => ({
      passed: actual === expected,
      actual,
      expected,
      message: actual === expected ? null : 'Values do not match'
    }));
  }

  assertArraysEqual(actual, expected, description) {
    const arraysEqual = (a, b) =>
      Array.isArray(a) && Array.isArray(b) &&
      a.length === b.length &&
      a.every((element, index) => element === b[index]);

    return this.test(description, () => ({
      passed: arraysEqual(actual, expected),
      actual,
      expected,
      message: arraysEqual(actual, expected) ? null : 'Arrays do not match'
    }));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.5: Report Generation and Summary
  // ────────────────────────────────────────────────────────────────────────────

  summary() {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) {
      return this.failures.length === 0;
    }

    const duration = Date.now() - this.startTime;
    const total = this.successes.length + this.failures.length;
    const passed = this.successes.length;
    const failed = this.failures.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : 0;

    const stats = { total, passed, failed, passRate, duration };
    this.reporter.summary(stats);

    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE && failed > 0) {
      this.reporter.failureDetails(this.failures);
    }

    return failed === 0;
  }

  exit() {
    const success = this.summary();
    process.exit(success ? 0 : 1);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.6: Differential Analysis
  // ────────────────────────────────────────────────────────────────────────────

  diff(expected, actual, label = null) {
    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
      this.reporter.diff(expected, actual, label);
    }
    return this;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.7: Utility Methods
  // ────────────────────────────────────────────────────────────────────────────

  log(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
      this.reporter.log(...args);
    }
    return this;
  }

  info(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.NORMAL) {
      this.reporter.info(...args);
    }
    return this;
  }

  warn(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.NORMAL) {
      this.reporter.warn(...args);
    }
    return this;
  }

  error(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.QUIET) {
      this.reporter.error(...args);
    }
    return this;
  }

  success(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
      this.reporter.success(...args);
    }
    return this;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION 2: PUBLIC API
// ──────────────────────────────────────────────────────────────────────────────

export function createTestSuite(name, options = {}) {
  return new TestSuite(name, options);
}

// Legacy compatibility exports
export function arraysEqual(a, b) {
  return a.length === b.length && a.every((element, index) => element === b[index]);
}

export function print(...args) {
  console.log(...args);
}

export function printInfo(...string) {
  console.log(`\x1b[34m${string.join(' ')}\x1b[0m`);
}

export function printSuccess(...string) {
  console.log(`\x1b[32m${string.join(' ')}\x1b[0m`);
}

export function printError(...string) {
  console.log(`\x1b[31m${string.join(' ')}\x1b[0m`);
}

export function printDivider(string) {
  console.log(`=== ${string} ===\n`);
}

export function printCode(string) {
  console.log(`${string.trim()}\n`);
}

export function printJavaScript(string) {
  console.log('```JavaScript\n', `${string.trim()}\n`, '```\n');
}

export { VERBOSITY_LEVELS };

// ═══════════════════════════════════════════════════════════════════════════════
// END OF DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
