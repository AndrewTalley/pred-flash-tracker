/**
 * Shared hero data for Pred Flash Tracker
 * 
 * Each hero has:
 *   name     - Display name
 *   role     - mage | fighter | assassin | ranger | support | frontline
 *   img      - Filename in src/assets/heroes/ (downloaded via scripts/download-portraits.js)
 *   initials - Fallback text if image not found
 */

const path = require('path');

const HEROES = [
  { name: "Akeron", role: "fighter", img: "akeron.webp", initials: "AK" },
  { name: "Argus", role: "fighter", img: "argus.webp", initials: "AR" },
  { name: "Aurora", role: "mage", img: "aurora.webp", initials: "AU" },
  { name: "Bayle", role: "frontline", img: "bayle.webp", initials: "BY" },
  { name: "Boris", role: "fighter", img: "boris.webp", initials: "BO" },
  { name: "Countess", role: "assassin", img: "countess.webp", initials: "CO" },
  { name: "Crunch", role: "fighter", img: "crunch.webp", initials: "CR" },
  { name: "Dekker", role: "support", img: "dekker.webp", initials: "DK" },
  { name: "Drongo", role: "ranger", img: "drongo.webp", initials: "DR" },
  { name: "Eden", role: "mage", img: "eden.webp", initials: "ED" },
  { name: "Feng Mao", role: "fighter", img: "feng-mao.webp", initials: "FM" },
  { name: "Gadget", role: "mage", img: "gadget.webp", initials: "GA" },
  { name: "Gideon", role: "mage", img: "gideon.webp", initials: "GI" },
  { name: "GRIM.exe", role: "ranger", img: "grim-exe.webp", initials: "GX" },
  { name: "Greystone", role: "fighter", img: "greystone.webp", initials: "GY" },
  { name: "Grux", role: "fighter", img: "grux.webp", initials: "GR" },
  { name: "Howitzer", role: "mage", img: "howitzer.webp", initials: "HW" },
  { name: "Iggy & Scorch", role: "mage", img: "iggy---scorch.webp", initials: "I&S" },
  { name: "Kallari", role: "assassin", img: "kallari.webp", initials: "KA" },
  { name: "Khaimera", role: "fighter", img: "khaimera.webp", initials: "KH" },
  { name: "Kira", role: "ranger", img: "kira.webp", initials: "KI" },
  { name: "Kwang", role: "fighter", img: "kwang.webp", initials: "KW" },
  { name: "Lt. Belica", role: "mage", img: "lt--belica.webp", initials: "LB" },
  { name: "Maco", role: "frontline", img: "maco.webp", initials: "MA" },
  { name: "Morigesh", role: "mage", img: "morigesh.webp", initials: "MO" },
  { name: "Mourn", role: "assassin", img: "mourn.webp", initials: "MN" },
  { name: "Murdock", role: "ranger", img: "murdock.webp", initials: "MU" },
  { name: "Muriel", role: "support", img: "muriel.webp", initials: "ML" },
  { name: "Narbash", role: "support", img: "narbash.webp", initials: "NB" },
  { name: "Neon", role: "ranger", img: "neon.webp", initials: "N3" },
  { name: "Phase", role: "support", img: "phase.webp", initials: "PH" },
  { name: "Rampage", role: "fighter", img: "rampage.webp", initials: "RA" },
  { name: "Renna", role: "support", img: "renna.webp", initials: "RE" },
  { name: "Revenant", role: "ranger", img: "revenant.webp", initials: "RV" },
  { name: "Riktor", role: "support", img: "riktor.webp", initials: "RI" },
  { name: "Serath", role: "fighter", img: "serath.webp", initials: "SR" },
  { name: "Sevarog", role: "frontline", img: "sevarog.webp", initials: "SV" },
  { name: "Shinbi", role: "assassin", img: "shinbi.webp", initials: "SH" },
  { name: "Skylar", role: "ranger", img: "skylar.webp", initials: "SK" },
  { name: "Sparrow", role: "ranger", img: "sparrow.webp", initials: "SP" },
  { name: "Steel", role: "frontline", img: "steel.webp", initials: "ST" },
  { name: "Terra", role: "frontline", img: "terra.webp", initials: "TE" },
  { name: "The Fey", role: "mage", img: "the-fey.webp", initials: "TF" },
  { name: "TwinBlast", role: "ranger", img: "twinblast.webp", initials: "TB" },
  { name: "Wraith", role: "ranger", img: "wraith.webp", initials: "WR" },
  { name: "Wukong", role: "fighter", img: "wukong.webp", initials: "WK" },
  { name: "Yin", role: "fighter", img: "yin.webp", initials: "YI" },
  { name: "Yurei", role: "assassin", img: "yurei.webp", initials: "YU" },
  { name: "Zarus", role: "fighter", img: "zarus.webp", initials: "ZA" },
  { name: "Zinx", role: "fighter", img: "zinx.webp", initials: "ZI" },
];

function getHeroImagePath(hero) {
  return path.join(__dirname, 'assets', 'heroes', hero.img);
}

module.exports = { HEROES, getHeroImagePath };
