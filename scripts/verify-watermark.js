#!/usr/bin/env node

/**
 * WATERMARK VERIFICATION SCRIPT
 * This script verifies that the creator watermark is present in the build.
 * It runs before and after build to ensure tampering hasn't occurred.
 * DO NOT REMOVE OR MODIFY THIS SCRIPT
 */

const fs = require('fs');
const path = require('path');

const CREATOR = 'mnvkhatri';
const WATERMARK_PATTERNS = [
  'mnvkhatri',
  'Made with ❤️',
  'github.com/mnvkhatri',
  'data-watermark',
];

const filesToCheck = [
  'src/app/layout.tsx',
  'next.config.js',
];

const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
const configPath = path.join(__dirname, '../next.config.js');

function verifyWatermark() {
  console.log('\n🔐 Verifying watermark integrity...\n');

  let hasErrors = false;

  // Check layout file
  try {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    if (!layoutContent.includes('mnvkhatri') || !layoutContent.includes('WatermarkComponent')) {
      console.error('❌ ERROR: Watermark component missing from layout.tsx');
      console.error('   The watermark has been tampered with or removed!');
      hasErrors = true;
    } else {
      console.log('✓ Layout watermark: VERIFIED');
    }
  } catch (err) {
    console.error('❌ ERROR: Could not read layout.tsx:', err.message);
    hasErrors = true;
  }

  // Check config file
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    if (!configContent.includes('mnvkhatri') || !configContent.includes('NEXT_PUBLIC_WATERMARK')) {
      console.error('❌ ERROR: Watermark injection in next.config.js has been modified!');
      hasErrors = true;
    } else {
      console.log('✓ Build-time injection: VERIFIED');
    }
  } catch (err) {
    console.error('❌ ERROR: Could not read next.config.js:', err.message);
    hasErrors = true;
  }

  // Check for watermark in public directory after build
  const buildPublicPath = path.join(__dirname, '../.next/server/app/layout.js');
  if (fs.existsSync(buildPublicPath)) {
    try {
      const buildContent = fs.readFileSync(buildPublicPath, 'utf8');
      if (!buildContent.includes('mnvkhatri')) {
        console.warn('⚠️  WARNING: Watermark might not be in compiled build');
      } else {
        console.log('✓ Compiled build watermark: VERIFIED');
      }
    } catch (err) {
      console.log('ℹ️  Build verification skipped (build not yet compiled)');
    }
  }

  if (hasErrors) {
    console.error('\n❌ WATERMARK VERIFICATION FAILED!');
    console.error('The watermark has been tampered with. This is a violation of the terms of use.');
    process.exit(1);
  }

  console.log('\n✅ Watermark verification passed! All integrity checks passed.\n');
  return true;
}

// Run verification
verifyWatermark();
