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

class TestSuite {
  constructor(name, options = {}) {
    this.name = name;
    this.verbosity = options.verbosity ?? VERBOSITY_LEVELS.VERBOSE;
    this.testNumber = 0;
    this.sectionNumber = 0;
    this.failures = [];
    this.successes = [];
    this.startTime = Date.now();
    this.metadata = {
      date: new Date().toISOString().split('T')[0],
      classification: options.classification ?? 'UNCLASSIFIED',
      documentId: options.documentId ?? `TEST-${Date.now()}`,
      ...options.metadata
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.1: Document Header and Structure
  // ────────────────────────────────────────────────────────────────────────────

  header() {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;

    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗ ');
    console.log(`║ ${this._pad(this.metadata.classification, 77)} ║ `);
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣ ');
    console.log(`║ TEST REPORT: ${this._pad(this.name, 64)} ║ `);
    console.log(`║ Document ID: ${this._pad(this.metadata.documentId, 64)} ║ `);
    console.log(`║ Date: ${this._pad(this.metadata.date, 71)} ║ `);
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝ ');
    console.log('\n');

    return this;
  }

  section(title) {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;

    this.sectionNumber++;
    this.testNumber = 0;
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`SECTION ${this.sectionNumber}: ${title}`);
    console.log(`${'═'.repeat(80)}\n`);

    return this;
  }

  subsection(title) {
    if (this.verbosity < VERBOSITY_LEVELS.NORMAL) return this;

    console.log(`\n${'─'.repeat(80)}`);
    console.log(`${this.sectionNumber}.${this.testNumber + 1} ${title}`);
    console.log(`${'─'.repeat(80)}\n`);

    return this;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.2: Code Display and Formatting
  // ────────────────────────────────────────────────────────────────────────────

  code(language, content, label = null) {
    if (this.verbosity < VERBOSITY_LEVELS.VERBOSE) return this;

    if (label) {
      console.log(`\n┌─[ ${label} ]${'─'.repeat(Math.max(0, 74 - label.length))}`);
    }
    console.log(`\`\`\`${language}`);
    console.log(content.trim());
    console.log('```');
    if (label) {
      console.log(`└${'─'.repeat(79)}\n`);
    } else {
      console.log('');
    }

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
        console.log(`\x1b[32m✓ TEST ${testId} PASSED\x1b[0m: ${description}`);
      }
    } else {
      this.failures.push(result);
      if (this.verbosity >= VERBOSITY_LEVELS.QUIET) {
        console.log(`\x1b[31m✗ TEST ${testId} FAILED\x1b[0m: ${description}`);
        if (result.message) {
          console.log(`  Reason: ${result.message}`);
        }
        if (result.expected !== null && result.actual !== null) {
          console.log(`  Expected: ${JSON.stringify(result.expected)}`);
          console.log(`  Actual:   ${JSON.stringify(result.actual)}`);
        }
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

    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗ ');
    console.log('║ TEST SUMMARY                                                                  ║ ');
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣ ');
    console.log(`║ Total Tests:     ${this._pad(String(total), 60)} ║ `);
    console.log(`║ Passed:          ${this._pad(String(passed), 60)} ║ `);
    console.log(`║ Failed:          ${this._pad(String(failed), 60)} ║ `);
    console.log(`║ Pass Rate:       ${this._pad(`${passRate}%`, 60)} ║ `);
    console.log(`║ Duration:        ${this._pad(`${duration}ms`, 60)} ║ `);
    console.log('╠═══════════════════════════════════════════════════════════════════════════════╣ ');

    if (failed === 0) {
      console.log('║ STATUS: \x1b[32mALL TESTS PASSED\x1b[0m                                                     ║ ');
    } else {
      console.log(`║ STATUS: \x1b[31m${failed} TEST(S) FAILED\x1b[0m                                                      ║ `);
    }

    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝ ');
    console.log('\n');

    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE && failed > 0) {
      console.log('FAILED TESTS:');
      this.failures.forEach(f => {
        console.log(`  [${f.id}] ${f.description}`);
        if (f.message) console.log(`       ${f.message}`);
      });
      console.log('');
    }

    return failed === 0;
  }

  exit() {
    const success = this.summary();
    process.exit(success ? 0 : 1);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUBSECTION 1.6: Utility Methods
  // ────────────────────────────────────────────────────────────────────────────

  _pad(str, length) {
    return str + ' '.repeat(Math.max(0, length - str.length));
  }

  log(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
      console.log(...args);
    }
    return this;
  }

  info(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.NORMAL) {
      console.log(`\x1b[34mℹ ${args.join(' ')}\x1b[0m`);
    }
    return this;
  }

  warn(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.NORMAL) {
      console.log(`\x1b[33m⚠ ${args.join(' ')}\x1b[0m`);
    }
    return this;
  }

  error(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.QUIET) {
      console.log(`\x1b[31m✗ ${args.join(' ')}\x1b[0m`);
    }
    return this;
  }

  success(...args) {
    if (this.verbosity >= VERBOSITY_LEVELS.VERBOSE) {
      console.log(`\x1b[32m✓ ${args.join(' ')}\x1b[0m`);
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
