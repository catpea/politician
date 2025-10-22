# POLITICIAN TEST FRAMEWORK

```
═══════════════════════════════════════════════════════════════════════════════
POLITICIAN TEST FRAMEWORK v1.0
Classification: UNCLASSIFIED
Document Control Number: PTF-1984-001
Effective Date: 1984-01-01
═══════════════════════════════════════════════════════════════════════════════
```

A bureaucratic test framework with the gravitas of 1980s government documentation. Designed for tests that are as easy to write as they are beautiful to read.

## Features

- **Bureaucratic Aesthetic**: 1980s IBM/NASA/NSA-inspired documentation style
- **Configurable Verbosity**: From silent to debug, control your output
- **Beautiful Markdown**: Print-ready reports with proper formatting
- **Chainable API**: Write tests in a fluent, readable style
- **Low Indirection**: Simple, straightforward test authoring

## Quick Start

```javascript
import { createTestSuite, VERBOSITY_LEVELS } from './assert.js';

const suite = createTestSuite('My Test Suite', {
  verbosity: VERBOSITY_LEVELS.VERBOSE,
  classification: 'UNCLASSIFIED',
  documentId: 'TEST-001'
});

suite
  .header()
  .section('UNIT TESTS')
  .test('Basic arithmetic works', () => 2 + 2 === 4)
  .test('String comparison works', () => ({
    passed: 'hello' === 'hello',
    actual: 'hello',
    expected: 'hello'
  }))
  .exit();
```

## Verbosity Levels

```javascript
VERBOSITY_LEVELS = {
  SILENT: 0,      // No output
  QUIET: 1,       // Errors only
  NORMAL: 2,      // Errors and test results (no success messages)
  VERBOSE: 3,     // All output including successes (default)
  DEBUG: 4        // Everything including debug info
}
```

## API Reference

### Document Structure

- `.header()` - Display document header with classification and metadata
- `.section(title)` - Create a numbered section
- `.subsection(title)` - Create a numbered subsection

### Code Display

- `.code(language, content, label)` - Display code block with optional label
- `.javascript(content, label)` - Display JavaScript code (shorthand)

### Testing

- `.test(description, assertion)` - Run a test
- `.assertEqual(actual, expected, description)` - Assert equality
- `.assertArraysEqual(actual, expected, description)` - Assert array equality

### Output

- `.log(...args)` - Log at VERBOSE level
- `.info(...args)` - Info message at NORMAL level
- `.warn(...args)` - Warning at NORMAL level
- `.error(...args)` - Error at QUIET level
- `.success(...args)` - Success message at VERBOSE level

### Completion

- `.summary()` - Display test summary
- `.exit()` - Display summary and exit with appropriate code

## Example: Full Test Suite

```javascript
#!/usr/bin/env node
import { createTestSuite, VERBOSITY_LEVELS } from './assert.js';
import { transform } from '../index.js';

const suite = createTestSuite('Transformation Compliance', {
  verbosity: VERBOSITY_LEVELS.VERBOSE,
  classification: 'UNCLASSIFIED',
  documentId: 'TC-2025-001'
});

const input = 'class A {}';
const output = transform(input);

suite
  .header()
  .section('PRELIMINARY DOCUMENTATION')
  .javascript(input, 'INPUT: Source Code')
  .javascript(output, 'OUTPUT: Transformed Code')

  .section('COMPLIANCE VERIFICATION')
  .test('Transformation succeeds', () => output !== null)
  .test('Output is valid', () => ({
    passed: output.includes('class'),
    actual: output,
    expected: 'Code containing class declaration'
  }))

  .exit();
```

## Design Philosophy

**"If it's worth testing, it's worth documenting with bureaucratic precision."**

The Politician Test Framework treats every test as an official government document, complete with:
- Document control numbers
- Classification markings
- Formal section numbering
- Professional formatting
- Audit-ready output

Tests should be:
1. **Easy to write** - Minimal boilerplate, chainable API
2. **Beautiful to read** - Print-ready markdown formatting
3. **Professional** - Government-grade documentation standards
4. **Informative** - Clear reporting at every verbosity level

---

```
═══════════════════════════════════════════════════════════════════════════════
END OF DOCUMENT
═══════════════════════════════════════════════════════════════════════════════
```
