// ═══════════════════════════════════════════════════════════════════════════════
// POLITICIAN TERMINAL REPORTER
// Classification: UNCLASSIFIED
// Document Control Number: PTF-1984-003-TERM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ADVANCED TERMINAL REPORTER
 *
 * Enhanced output formatter utilizing ANSI escape sequences for real-time
 * visual feedback on compatible terminal systems. Recommended for interactive
 * diagnostic sessions and field operations.
 */

import { Reporter } from './superclass.js';

const ANSI = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',

  // Classification colors
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',

  // Background colors
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
};

export class TerminalReporter extends Reporter {
  constructor(metadata = {}) {
    super(metadata);
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 1: ENHANCED DOCUMENT STRUCTURE
  // ────────────────────────────────────────────────────────────────────────────

  header(testSuiteName) {
    this.output('');
    this.output(ANSI.CYAN + '╔═══════════════════════════════════════════════════════════════════════════════╗' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.BOLD + ANSI.YELLOW + this._pad(this.metadata.classification, 77) + ANSI.RESET + ANSI.CYAN + ' ║' + ANSI.RESET);
    this.output(ANSI.CYAN + '╠═══════════════════════════════════════════════════════════════════════════════╣' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.BOLD + 'OPERATIONAL TEST REPORT' + ANSI.RESET + this._pad('', 55) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.WHITE + 'Facility: ' + ANSI.RESET + this._pad(testSuiteName, 68) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.WHITE + 'Document Control: ' + ANSI.RESET + this._pad(this.metadata.documentId, 60) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.WHITE + 'Transmission Date: ' + ANSI.RESET + this._pad(this.metadata.date, 59) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.WHITE + 'Timestamp: ' + ANSI.RESET + this._pad(this.metadata.time, 67) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '╚═══════════════════════════════════════════════════════════════════════════════╝' + ANSI.RESET);
    this.output('');
  }

  section(sectionNumber, title) {
    this.output('');
    this.output(ANSI.BLUE + '═'.repeat(80) + ANSI.RESET);
    this.output(ANSI.BOLD + ANSI.BLUE + `SECTION ${sectionNumber}: ` + ANSI.WHITE + title + ANSI.RESET);
    this.output(ANSI.BLUE + '═'.repeat(80) + ANSI.RESET);
    this.output('');
  }

  subsection(sectionNumber, testNumber, title) {
    this.output('');
    this.output(ANSI.CYAN + '─'.repeat(80) + ANSI.RESET);
    this.output(ANSI.CYAN + `${sectionNumber}.${testNumber} ` + ANSI.WHITE + title + ANSI.RESET);
    this.output(ANSI.CYAN + '─'.repeat(80) + ANSI.RESET);
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 2: ENHANCED CODE DISPLAY
  // ────────────────────────────────────────────────────────────────────────────

  code(language, content, label = null) {
    if (label) {
      this.output(ANSI.DIM + `┌─[ ${ANSI.RESET}${ANSI.MAGENTA}${label}${ANSI.RESET}${ANSI.DIM} ]${'─'.repeat(Math.max(0, 74 - label.length))}` + ANSI.RESET);
    }
    this.output(ANSI.DIM + content.trim() + ANSI.RESET);
    if (label) {
      this.output(ANSI.DIM + '└' + '─'.repeat(79) + ANSI.RESET);
    }
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 3: ENHANCED TEST RESULTS
  // ────────────────────────────────────────────────────────────────────────────

  testPassed(testId, description) {
    this.output(`${ANSI.GREEN}✓ TEST ${testId} PASSED${ANSI.RESET}: ${description}`);
  }

  testFailed(testId, description, result) {
    this.output(`${ANSI.RED}✗ TEST ${testId} FAILED${ANSI.RESET}: ${description}`);
    if (result.message) {
      this.output(`  ${ANSI.YELLOW}Reason: ${result.message}${ANSI.RESET}`);
    }
    if (result.expected !== null && result.actual !== null) {
      this.output(`  ${ANSI.CYAN}Expected: ${JSON.stringify(result.expected)}${ANSI.RESET}`);
      this.output(`  ${ANSI.MAGENTA}Actual:   ${JSON.stringify(result.actual)}${ANSI.RESET}`);
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 4: ENHANCED SUMMARY
  // ────────────────────────────────────────────────────────────────────────────

  summary(stats) {
    const { total, passed, failed, passRate, duration } = stats;

    this.output('');
    this.output(ANSI.CYAN + '╔═══════════════════════════════════════════════════════════════════════════════╗' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.BOLD + ANSI.WHITE + 'MISSION STATUS REPORT' + ANSI.RESET + this._pad('', 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '╠═══════════════════════════════════════════════════════════════════════════════╣' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.WHITE + 'Total Operations:    ' + ANSI.RESET + this._pad(String(total), 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.GREEN + 'Successful:          ' + ANSI.RESET + this._pad(String(passed), 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.RED + 'Failed:              ' + ANSI.RESET + this._pad(String(failed), 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.YELLOW + 'Success Rate:        ' + ANSI.RESET + this._pad(`${passRate}%`, 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '║ ' + ANSI.BLUE + 'Execution Duration:  ' + ANSI.RESET + this._pad(`${duration}ms`, 57) + ANSI.CYAN + '║' + ANSI.RESET);
    this.output(ANSI.CYAN + '╠═══════════════════════════════════════════════════════════════════════════════╣' + ANSI.RESET);

    if (failed === 0) {
      this.output(ANSI.CYAN + '║ ' + ANSI.BOLD + ANSI.GREEN + 'CLEARANCE: ALL OPERATIONS SUCCESSFUL' + ANSI.RESET + this._pad('', 42) + ANSI.CYAN + '║' + ANSI.RESET);
    } else {
      this.output(ANSI.CYAN + '║ ' + ANSI.BOLD + ANSI.RED + `ALERT: ${failed} OPERATION(S) FAILED` + ANSI.RESET + this._pad('', 74 - 23 - String(failed).length) + ANSI.CYAN + '║' + ANSI.RESET);
    }

    this.output(ANSI.CYAN + '╚═══════════════════════════════════════════════════════════════════════════════╝' + ANSI.RESET);
    this.output('');
  }

  failureDetails(failures) {
    if (failures.length === 0) return;

    this.output(ANSI.RED + ANSI.BOLD + 'FAILED OPERATIONS REGISTRY:' + ANSI.RESET);
    this.output('');
    failures.forEach(f => {
      this.output(`  ${ANSI.RED}[${f.id}]${ANSI.RESET} ${f.description}`);
      if (f.message) this.output(`       ${ANSI.YELLOW}${f.message}${ANSI.RESET}`);
    });
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 5: ENHANCED DIFFERENTIAL ANALYSIS
  // ────────────────────────────────────────────────────────────────────────────

  diff(expected, actual, label = 'DIFFERENTIAL ANALYSIS') {
    this.output('');
    this.output(ANSI.YELLOW + '┌─[ ' + ANSI.BOLD + label + ANSI.RESET + ANSI.YELLOW + ' ]' + '─'.repeat(Math.max(0, 74 - label.length)) + ANSI.RESET);
    this.output('');

    const expectedStr = this._stringify(expected);
    const actualStr = this._stringify(actual);

    if (expectedStr === actualStr) {
      this.output(`  ${ANSI.GREEN}[NO VARIANCE DETECTED]${ANSI.RESET}`);
    } else {
      this.output(`  ${ANSI.CYAN}EXPECTED STATE:${ANSI.RESET}`);
      expectedStr.split('\n').forEach(line => {
        this.output(`  ${ANSI.RED}- ${line}${ANSI.RESET}`);
      });
      this.output('');
      this.output(`  ${ANSI.CYAN}ACTUAL STATE:${ANSI.RESET}`);
      actualStr.split('\n').forEach(line => {
        this.output(`  ${ANSI.GREEN}+ ${line}${ANSI.RESET}`);
      });
    }

    this.output('');
    this.output(ANSI.YELLOW + '└' + '─'.repeat(79) + ANSI.RESET);
    this.output('');
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SECTION 6: ENHANCED LOGGING
  // ────────────────────────────────────────────────────────────────────────────

  info(...args) {
    this.output(`${ANSI.BLUE}ℹ ${args.join(' ')}${ANSI.RESET}`);
  }

  warn(...args) {
    this.output(`${ANSI.YELLOW}⚠ ${args.join(' ')}${ANSI.RESET}`);
  }

  error(...args) {
    this.output(`${ANSI.RED}✗ ${args.join(' ')}${ANSI.RESET}`);
  }

  success(...args) {
    this.output(`${ANSI.GREEN}✓ ${args.join(' ')}${ANSI.RESET}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// END OF DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
