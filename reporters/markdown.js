// ═══════════════════════════════════════════════════════════════════════════════
// POLITICIAN MARKDOWN REPORTER
// Classification: UNCLASSIFIED
// Document Control Number: PTF-1984-004-MD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MARKDOWN DOCUMENTATION REPORTER
 *
 * Generates standards-compliant markdown output suitable for archival,
 * documentation systems, and transmission via text-based protocols.
 * Output may be redirected to file systems for permanent record keeping.
 */

import { Reporter } from './superclass.js';

export class MarkdownReporter extends Reporter {
  constructor(metadata = {}) {
    super(metadata);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 1: MARKDOWN DOCUMENT STRUCTURE
  // ────────────────────────────────────────────────────────────────────────────

  header(testSuiteName) {
    this.output('```');
    this.output('╔═══════════════════════════════════════════════════════════════════════════════╗');
    this.output(`║ ${this._pad(this.metadata.classification, 77)} ║`);
    this.output('╠═══════════════════════════════════════════════════════════════════════════════╣');
    this.output(`║ OPERATIONAL TEST REPORT                                                       ║`);
    this.output(`║ Facility: ${this._pad(testSuiteName, 67)} ║`);
    this.output(`║ Document Control: ${this._pad(this.metadata.documentId, 59)} ║`);
    this.output(`║ Transmission Date: ${this._pad(this.metadata.date, 58)} ║`);
    this.output(`║ Timestamp: ${this._pad(this.metadata.time, 66)} ║`);
    this.output('╚═══════════════════════════════════════════════════════════════════════════════╝');
    this.output('```');
    this.output('');
  }

  section(sectionNumber, title) {
    this.output('');
    this.output(`## Section ${sectionNumber}: ${title}`);
    this.output('');
  }

  subsection(sectionNumber, testNumber, title) {
    this.output('');
    this.output(`### ${sectionNumber}.${testNumber} ${title}`);
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 2: MARKDOWN CODE BLOCKS
  // ────────────────────────────────────────────────────────────────────────────

  code(language, content, label = null) {
    if (label) {
      this.output(`**${label}**`);
      this.output('');
    }
    this.output('```' + language);
    this.output(content.trim());
    this.output('```');
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 3: MARKDOWN TEST RESULTS
  // ────────────────────────────────────────────────────────────────────────────

  testPassed(testId, description) {
    this.output(`- ✓ **TEST ${testId} PASSED**: ${description}`);
  }

  testFailed(testId, description, result) {
    this.output(`- ✗ **TEST ${testId} FAILED**: ${description}`);
    if (result.message) {
      this.output(`  - Reason: ${result.message}`);
    }
    if (result.expected !== null && result.actual !== null) {
      this.output(`  - Expected: \`${JSON.stringify(result.expected)}\``);
      this.output(`  - Actual: \`${JSON.stringify(result.actual)}\``);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 4: MARKDOWN SUMMARY
  // ────────────────────────────────────────────────────────────────────────────

  summary(stats) {
    const { total, passed, failed, passRate, duration } = stats;

    this.output('');
    this.output('```');
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
    this.output('```');
    this.output('');
  }

  failureDetails(failures) {
    if (failures.length === 0) return;

    this.output('## Failed Operations Registry');
    this.output('');
    failures.forEach(f => {
      this.output(`- **[${f.id}]** ${f.description}`);
      if (f.message) this.output(`  - ${f.message}`);
    });
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 5: MARKDOWN DIFFERENTIAL ANALYSIS
  // ────────────────────────────────────────────────────────────────────────────

  diff(expected, actual, label = 'DIFFERENTIAL ANALYSIS') {
    this.output('');
    this.output(`### ${label}`);
    this.output('');

    const expectedStr = this._stringify(expected);
    const actualStr = this._stringify(actual);

    if (expectedStr === actualStr) {
      this.output('**[NO VARIANCE DETECTED]**');
      this.output('');
    } else {
      this.output('**Expected State:**');
      this.output('');
      this.output('```diff');
      expectedStr.split('\n').forEach(line => {
        this.output('- ' + line);
      });
      this.output('```');
      this.output('');
      this.output('**Actual State:**');
      this.output('');
      this.output('```diff');
      actualStr.split('\n').forEach(line => {
        this.output('+ ' + line);
      });
      this.output('```');
      this.output('');
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 6: MARKDOWN LOGGING
  // ────────────────────────────────────────────────────────────────────────────

  info(...args) {
    this.output(`ℹ️ ${args.join(' ')}`);
  }

  warn(...args) {
    this.output(`⚠️ **Warning:** ${args.join(' ')}`);
  }

  error(...args) {
    this.output(`❌ **Error:** ${args.join(' ')}`);
  }

  success(...args) {
    this.output(`✅ ${args.join(' ')}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
