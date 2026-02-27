#!/usr/bin/env node
/**
 * GitAgent Validation Script
 * 
 * Validates agent definition files against the GitAgent schema
 * Usage: node scripts/validate-agents.js
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const SCHEMA_FILE = path.join(AGENTS_DIR, 'gitagent-schema.json');
const EXAMPLES_DIR = path.join(AGENTS_DIR, 'examples');

// ANSI colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadSchema() {
  try {
    const schemaData = fs.readFileSync(SCHEMA_FILE, 'utf-8');
    return JSON.parse(schemaData);
  } catch (error) {
    log(`❌ Failed to load schema: ${error.message}`, 'red');
    process.exit(1);
  }
}

function validateAgentFile(filePath, schema) {
  const results = {
    file: path.basename(filePath),
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const agent = JSON.parse(content);

    // Check required fields
    const requiredFields = ['name', 'version', 'description', 'runtime', 'capabilities'];
    for (const field of requiredFields) {
      if (!agent[field]) {
        results.errors.push(`Missing required field: ${field}`);
        results.valid = false;
      }
    }

    // Validate name format
    if (agent.name && !/^[a-z0-9-]+$/.test(agent.name)) {
      results.warnings.push('Name should use kebab-case (lowercase with hyphens)');
    }

    // Validate version format (semver)
    if (agent.version && !/^\d+\.\d+\.\d+/.test(agent.version)) {
      results.warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
    }

    // Validate runtime
    if (agent.runtime) {
      const validRuntimes = ['openclaw', 'claude-code', 'gpt', 'custom'];
      if (!validRuntimes.includes(agent.runtime.type)) {
        results.warnings.push(`Runtime type '${agent.runtime.type}' is not standard. Valid: ${validRuntimes.join(', ')}`);
      }
    }

    // Validate capabilities
    if (agent.capabilities) {
      const validCapabilities = ['read', 'write', 'exec', 'network', 'browser', 'vision'];
      for (const cap of agent.capabilities) {
        if (!validCapabilities.includes(cap)) {
          results.warnings.push(`Capability '${cap}' is not standard. Valid: ${validCapabilities.join(', ')}`);
        }
      }
    }

    // Validate budget if present
    if (agent.config?.budget) {
      if (typeof agent.config.budget.maxMonthly !== 'number') {
        results.warnings.push('Budget maxMonthly should be a number');
      }
      if (agent.config.budget.maxMonthly > 200) {
        results.warnings.push(`Budget $${agent.config.budget.maxMonthly}/mo exceeds recommended $200/mo`);
      }
    }

    // Validate triggers
    if (agent.triggers?.schedule) {
      // Basic cron validation
      const cronParts = agent.triggers.schedule.split(' ');
      if (cronParts.length !== 5) {
        results.warnings.push('Schedule should be a valid 5-part cron expression (e.g., "0 6 * * 3,5")');
      }
    }

    // Check for secrets
    if (agent.secrets) {
      for (const secret of agent.secrets) {
        if (secret.includes('=') || secret.includes(' ')) {
          results.errors.push(`Secret '${secret}' should be just the env var name, not a value`);
          results.valid = false;
        }
      }
    }

    return results;

  } catch (error) {
    results.valid = false;
    results.errors.push(`Failed to parse JSON: ${error.message}`);
    return results;
  }
}

function main() {
  log('🔍 GitAgent Validation', 'blue');
  log('=' .repeat(50), 'blue');

  const schema = loadSchema();
  log(`✓ Loaded schema: ${schema.title || 'GitAgent Schema'}`, 'green');

  // Find all .agent.json files
  const agentFiles = [];
  
  if (fs.existsSync(EXAMPLES_DIR)) {
    const files = fs.readdirSync(EXAMPLES_DIR);
    for (const file of files) {
      if (file.endsWith('.agent.json')) {
        agentFiles.push(path.join(EXAMPLES_DIR, file));
      }
    }
  }

  if (agentFiles.length === 0) {
    log('\n⚠️  No agent definition files found', 'yellow');
    log('   Expected: agents/examples/*.agent.json', 'yellow');
    return;
  }

  log(`\n📁 Found ${agentFiles.length} agent definition(s)\n`, 'blue');

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const filePath of agentFiles) {
    const results = validateAgentFile(filePath, schema);

    if (results.valid && results.warnings.length === 0) {
      log(`✅ ${results.file}`, 'green');
    } else if (results.valid) {
      log(`⚠️  ${results.file}`, 'yellow');
      totalWarnings += results.warnings.length;
    } else {
      log(`❌ ${results.file}`, 'red');
      totalErrors += results.errors.length;
      totalWarnings += results.warnings.length;
    }

    for (const error of results.errors) {
      log(`   ❌ ${error}`, 'red');
    }

    for (const warning of results.warnings) {
      log(`   ⚠️  ${warning}`, 'yellow');
    }

    if (results.errors.length === 0 && results.warnings.length === 0) {
      log('   ✓ All checks passed', 'green');
    }

    console.log('');
  }

  // Summary
  log('=' .repeat(50), 'blue');
  if (totalErrors === 0 && totalWarnings === 0) {
    log('✅ All agents valid!', 'green');
    process.exit(0);
  } else if (totalErrors === 0) {
    log(`⚠️  ${totalWarnings} warning(s) found`, 'yellow');
    process.exit(0);
  } else {
    log(`❌ ${totalErrors} error(s), ${totalWarnings} warning(s) found`, 'red');
    process.exit(1);
  }
}

main();
