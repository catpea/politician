// ═══════════════════════════════════════════════════════════════════════════════
// POLITICIAN REPORTER SUPERCLASS
// Classification: UNCLASSIFIED
// Document Control Number: PTF-1984-002-BASE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * BASE ASCII REPORTER
 *
 * Foundation class for all output formatters in the Politician Test Framework.
 * Provides basic ASCII formatting capabilities suitable for archival and
 * transmission across legacy systems.
 */

export class Reporter {
  constructor(metadata = {}) {
    this.metadata = {
      classification: metadata.classification ?? 'UNCLASSIFIED',
      documentId: metadata.documentId ?? `PTF-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      ...metadata
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 1: DOCUMENT STRUCTURE
  // ────────────────────────────────────────────────────────────────────────────

  header(testSuiteName) {
    this.output('');
    this.output('╔═══════════════════════════════════════════════════════════════════════════════╗');
    this.output(`║ ${this._pad(this.metadata.classification, 77)} ║`);
    this.output('╠═══════════════════════════════════════════════════════════════════════════════╣');
    this.output(`║ OPERATIONAL TEST REPORT                                                       ║`);
    this.output(`║ Facility: ${this._pad(testSuiteName, 70)} ║`);
    this.output(`║ Document Control: ${this._pad(this.metadata.documentId, 60)} ║`);
    this.output(`║ Transmission Date: ${this._pad(this.metadata.date, 57)} ║`);
    this.output(`║ Timestamp: ${this._pad(this.metadata.time, 65)} ║`);
    this.output('╚═══════════════════════════════════════════════════════════════════════════════╝');
    this.output('');
  }

  section(sectionNumber, title) {
    this.output('');
    this.output('═'.repeat(80));
    this.output(`SECTION ${sectionNumber}: ${title}`);
    this.output('═'.repeat(80));
    this.output('');
  }

  subsection(sectionNumber, testNumber, title) {
    this.output('');
    this.output('─'.repeat(80));
    this.output(`${sectionNumber}.${testNumber} ${title}`);
    this.output('─'.repeat(80));
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 2: CODE DISPLAY
  // ────────────────────────────────────────────────────────────────────────────

  code(language, content, label = null) {
    if (label) {
      this.output(`┌─[ ${label} ]${'─'.repeat(Math.max(0, 74 - label.length))}`);
    }
    this.output(content.trim());
    if (label) {
      this.output('└' + '─'.repeat(79));
    }
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 3: TEST RESULTS
  // ────────────────────────────────────────────────────────────────────────────

  testPassed(testId, description) {
    this.output(`[PASS] TEST ${testId}: ${description}`);
  }

  testFailed(testId, description, result) {
    this.output(`[FAIL] TEST ${testId}: ${description}`);
    if (result.message) {
      this.output(`       Reason: ${result.message}`);
    }
    if (result.expected !== null && result.actual !== null) {
      this.output(`       Expected: ${JSON.stringify(result.expected)}`);
      this.output(`       Actual:   ${JSON.stringify(result.actual)}`);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 4: SUMMARY AND STATISTICS
  // ────────────────────────────────────────────────────────────────────────────

  summary(stats) {
    const { total, passed, failed, passRate, duration } = stats;

    this.output('');
    this.output('╔═══════════════════════════════════════════════════════════════════════════════╗');
    this.output('║ MISSION STATUS REPORT                                                         ║');
    this.output('╠═══════════════════════════════════════════════════════════════════════════════╣');
    this.output(`║ Total Operations:    ${this._pad(String(total), 56)} ║`);
    this.output(`║ Successful:          ${this._pad(String(passed), 56)} ║`);
    this.output(`║ Failed:              ${this._pad(String(failed), 56)} ║`);
    this.output(`║ Success Rate:        ${this._pad(`${passRate}%`, 56)} ║`);
    this.output(`║ Execution Duration:  ${this._pad(`${duration}ms`, 56)} ║`);
    this.output('╠═══════════════════════════════════════════════════════════════════════════════╣');

    if (failed === 0) {
      this.output('║ CLEARANCE: ALL OPERATIONS SUCCESSFUL                                          ║');
    } else {
      this.output(`║ ALERT: ${this._pad(`${failed} OPERATION(S) FAILED`, 72)} ║`);
    }

    this.output('╚═══════════════════════════════════════════════════════════════════════════════╝');
    this.output('');
  }

  failureDetails(failures) {
    if (failures.length === 0) return;

    this.output('FAILED OPERATIONS REGISTRY:');
    this.output('');
    failures.forEach(f => {
      this.output(`  [${f.id}] ${f.description}`);
      if (f.message) this.output(`       ${f.message}`);
    });
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 5: DIFFERENTIAL ANALYSIS
  // ────────────────────────────────────────────────────────────────────────────

  diff(expected, actual, label = 'DIFFERENTIAL ANALYSIS') {
    this.output('');
    this.output('┌─[ ' + label + ' ]' + '─'.repeat(Math.max(0, 74 - label.length)));
    this.output('');

    const expectedStr = this._stringify(expected);
    const actualStr = this._stringify(actual);

    if (expectedStr === actualStr) {
      this.output('  [NO VARIANCE DETECTED]');
    } else {
      this.output('  EXPECTED STATE:');
      expectedStr.split('\n').forEach(line => {
        this.output('  - ' + line);
      });
      this.output('');
      this.output('  ACTUAL STATE:');
      actualStr.split('\n').forEach(line => {
        this.output('  + ' + line);
      });
    }

    this.output('');
    this.output('└' + '─'.repeat(79));
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 6: LOGGING AND MESSAGING
  // ────────────────────────────────────────────────────────────────────────────

  log(...args) {
    this.output(args.join(' '));
  }

  info(...args) {
    this.output(`[INFO] ${args.join(' ')}`);
  }

  warn(...args) {
    this.output(`[WARN] ${args.join(' ')}`);
  }

  error(...args) {
    this.output(`[ERROR] ${args.join(' ')}`);
  }

  success(...args) {
    this.output(`[SUCCESS] ${args.join(' ')}`);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 7: OUTPUT AND UTILITIES
  // ────────────────────────────────────────────────────────────────────────────

  output(message) {
    console.log(message);
  }

  _pad(str, length) {
    return str + ' '.repeat(Math.max(0, length - str.length));
  }

  _stringify(value) {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
