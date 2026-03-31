/**
 * Download Hero Portraits for Pred Flash Tracker
 * 
 * Run once:  node scripts/download-portraits.js
 * 
 * Downloads hero portrait images from statz.gg (official Predecessor 
 * hero assets) and saves them to src/assets/heroes/ as webp files.
 * 
 * If any portrait fails, the app gracefully falls back to initials.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'heroes');

// Complete hero roster with exact statz.gg filename slugs
const HEROES = [
  "Akeron",
  "Argus",
  "Aurora",
  "Bayle",
  "Boris",
  "Countess",
  "Crunch",
  "Dekker",
  "Drongo",
  "Eden",
  "Feng-Mao",
  "Gadget",
  "Gideon",
  "GRIM.exe",
  "Greystone",
  "Grux",
  "Howitzer",
  "Iggy-&-Scorch",
  "Kallari",
  "Khaimera",
  "Kira",
  "Kwang",
  "Lt.-Belica",
  "Maco",
  "Morigesh",
  "Mourn",
  "Murdock",
  "Muriel",
  "Narbash",
  "Neon",
  "Phase",
  "Rampage",
  "Renna",
  "Revenant",
  "Riktor",
  "Serath",
  "Sevarog",
  "Shinbi",
  "Skylar",
  "Sparrow",
  "Steel",
  "Terra",
  "The-Fey",
  "TwinBlast",
  "Wraith",
  "Wukong",
  "Yin",
  "Yurei",
  "Zarus",
  "Zinx",
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Downloading ${HEROES.length} hero portraits...\n`);

  let success = 0;
  let failed = 0;

  for (const slug of HEROES) {
    const url = `https://statz.gg/images/predecessor/hero-image-data/${slug}.webp`;
    // Normalize filename: lowercase, replace special chars
    const filename = slug.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.webp';
    const dest = path.join(OUTPUT_DIR, filename);

    try {
      await downloadFile(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`  ✓ ${slug.padEnd(20)} → ${filename} (${(size / 1024).toFixed(1)}KB)`);
      success++;
    } catch (err) {
      console.log(`  ✗ ${slug.padEnd(20)} → FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! ${success} downloaded, ${failed} failed.`);
  console.log(`Portraits saved to: ${OUTPUT_DIR}`);
  
  if (failed > 0) {
    console.log(`\nFailed heroes will show initials instead of portraits in the app.`);
  }
}

main().catch(console.error);
