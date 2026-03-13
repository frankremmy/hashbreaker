// ─── Clock ────────────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toTimeString().slice(0, 8);
}
setInterval(updateClock, 1000);
updateClock();

// ─── Toggle password visibility ───────────────────────────────────────────────
function toggleVisible() {
  const inp = document.getElementById('passwordInput');
  const btn = document.getElementById('toggleBtn');
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = 'HIDE'; }
  else { inp.type = 'password'; btn.textContent = 'SHOW'; }
}

document.getElementById('toggleBtn').addEventListener('click', toggleVisible);

// ─── MD5 implementation (pure JS, educational) ────────────────────────────────
function md5(str) {
  function safeAdd(x, y) { let lsw = (x & 0xFFFF) + (y & 0xFFFF); let msw = (x >> 16) + (y >> 16) + (lsw >> 16); return (msw << 16) | (lsw & 0xFFFF); }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function sbstr2binl(str) { let bin = {}; let mask = (1 << 8) - 1; for (let i = 0; i < str.length * 8; i += 8) { bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32); } return bin; }
  function binl2hex(binarray) { let hexcases = '0123456789abcdef'; let str = ''; for (let i = 0; i < binarray.length * 4; i++) { str += hexcases.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hexcases.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF); } return str; }
  function md5binl(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32); x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      let olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a, b, c, d, x[i + 0], 7, -680876936); d = md5ff(d, a, b, c, x[i + 1], 12, -389564586); c = md5ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426); c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417); c = md5ff(c, d, a, b, x[i + 10], 17, -42063); b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5ff(d, a, b, c, x[i + 13], 12, -40341101); c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632); c = md5gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5gg(d, a, b, c, x[i + 10], 9, 38016083); c = md5gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690); c = md5gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5gg(d, a, b, c, x[i + 2], 9, -51403784); c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558); d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463); c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353); c = md5hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5hh(d, a, b, c, x[i + 0], 11, -358537222); c = md5hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5hh(d, a, b, c, x[i + 12], 11, -421815835); c = md5hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i + 0], 6, -198630844); d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415); c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606); c = md5ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5ii(d, a, b, c, x[i + 15], 10, -30611744); c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379); c = md5ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  let utf8 = unescape(encodeURIComponent(str));
  return binl2hex(md5binl(sbstr2binl(utf8), utf8.length * 8));
}

// ─── SHA via Web Crypto ────────────────────────────────────────────────────────
async function sha(algo, str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest(algo, enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Hash Cache ────────────────────────────────────────────────────────────────
let hashCache = { md5: '', sha1: '', sha256: '' };

// ─── Strength Analysis ─────────────────────────────────────────────────────────
function analyseStrength(pwd) {
  const len = pwd.length;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNum   = /[0-9]/.test(pwd);
  const hasSym   = /[^A-Za-z0-9]/.test(pwd);

  let charset = 0;
  if (hasUpper) charset += 26;
  if (hasLower) charset += 26;
  if (hasNum)   charset += 10;
  if (hasSym)   charset += 32;
  if (charset === 0) charset = 1;

  const entropy = len * Math.log2(charset);

  let score = 0;
  if (len >= 8)  score++;
  if (len >= 12) score++;
  if (len >= 16) score++;
  if (hasUpper)  score++;
  if (hasLower)  score++;
  if (hasNum)    score++;
  if (hasSym)    score++;

  return { score, entropy, hasUpper, hasLower, hasNum, hasSym, len };
}

// ─── Crack Time Estimator ──────────────────────────────────────────────────────
function formatCrackTime(entropy) {
  // Assumes 10 billion guesses/sec (modern GPU crack rate)
  const guesses = Math.pow(2, entropy);
  const secs = guesses / 1e10;
  if (secs < 1)           return 'instantly';
  if (secs < 60)          return `~${secs.toFixed(1)} seconds`;
  if (secs < 3600)        return `~${(secs / 60).toFixed(1)} minutes`;
  if (secs < 86400)       return `~${(secs / 3600).toFixed(1)} hours`;
  if (secs < 31536000)    return `~${(secs / 86400).toFixed(1)} days`;
  if (secs < 3.15e9)      return `~${(secs / 31536000).toFixed(1)} years`;
  return `~${(secs / 3.15e9).toFixed(1)} billion years`;
}

// ─── Update All UI ─────────────────────────────────────────────────────────────
async function updateAll() {
  const pwd = document.getElementById('passwordInput').value;

  if (!pwd) {
    document.getElementById('strengthBar').style.width = '0%';
    document.getElementById('strengthText').textContent = '—';
    document.getElementById('strengthText').style.color = '';
    ['stat-len', 'stat-upper', 'stat-lower', 'stat-num', 'stat-sym'].forEach(id => {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById('stat-len').textContent = 'LENGTH: 0';
    setHash('hash-md5',    'awaiting input...', true);
    setHash('hash-sha1',   'awaiting input...', true);
    setHash('hash-sha256', 'awaiting input...', true);
    document.getElementById('entropyVal').textContent = '0.00';
    document.getElementById('crackTime').textContent = 'Estimated crack time: —';
    hashCache = { md5: '', sha1: '', sha256: '' };
    return;
  }

  const { score, entropy, hasUpper, hasLower, hasNum, hasSym, len } = analyseStrength(pwd);
  const pct = Math.min((score / 7) * 100, 100);

  const bar = document.getElementById('strengthBar');
  bar.style.width = pct + '%';

  let label, color;
  if (score <= 1)      { label = 'CRITICAL';     color = '#e05252'; }
  else if (score <= 2) { label = 'WEAK';          color = '#e08a52'; }
  else if (score <= 4) { label = 'MODERATE';      color = '#f5a623'; }
  else if (score <= 5) { label = 'STRONG';        color = '#7ecb52'; }
  else                 { label = 'VERY STRONG';   color = '#4ecb71'; }

  bar.style.background = color;
  bar.style.color = color;

  const st = document.getElementById('strengthText');
  st.textContent = label;
  st.style.color = color;

  document.getElementById('stat-len').textContent = `LENGTH: ${len}`;
  document.getElementById('stat-len').classList.toggle('active', len >= 8);
  document.getElementById('stat-upper').classList.toggle('active', hasUpper);
  document.getElementById('stat-lower').classList.toggle('active', hasLower);
  document.getElementById('stat-num').classList.toggle('active', hasNum);
  document.getElementById('stat-sym').classList.toggle('active', hasSym);

  document.getElementById('entropyVal').textContent = entropy.toFixed(2) + ' bits';
  document.getElementById('crackTime').textContent =
    `Estimated crack time (10B guesses/sec GPU): ${formatCrackTime(entropy)}`;

  // Compute and cache hashes
  const m    = md5(pwd);
  const s1   = await sha('SHA-1', pwd);
  const s256 = await sha('SHA-256', pwd);
  hashCache  = { md5: m, sha1: s1, sha256: s256 };

  setHash('hash-md5',    m);
  setHash('hash-sha1',   s1);
  setHash('hash-sha256', s256);
}

// ─── Set Hash Display ──────────────────────────────────────────────────────────
function setHash(id, val, empty = false) {
  const el = document.getElementById(id);
  el.textContent = val;
  el.className = empty ? 'hash-value empty' : 'hash-value';
}

// ─── Copy Hash ─────────────────────────────────────────────────────────────────
function copyHash(targetId) {
  const txt = document.getElementById(targetId).textContent;
  navigator.clipboard.writeText(txt).catch(() => {});
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById('passwordInput').addEventListener('input', updateAll);

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    copyHash(targetId);
    btn.textContent = '✓ COPIED';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 1500);
  });
});

// ─── Wordlists ─────────────────────────────────────────────────────────────────
const WORDLISTS = {
  top10: [
    '123456', 'password', '123456789', '12345678', '12345',
    '1234567', 'password1', 'iloveyou', 'admin', 'qwerty'
  ],
  top100: [
    '123456','password','123456789','12345678','12345','1234567','password1',
    'iloveyou','admin','qwerty','welcome','monkey','dragon','master','letmein',
    'login','hello','sunshine','shadow','princess','abc123','football','baseball',
    'soccer','michael','superman','batman','trustno1','passw0rd','starwars',
    'charlie','donald','password2','qwerty123','111111','1q2w3e4r','admin123',
    'root','toor','pass','test','guest','123123','000000','654321','666666',
    '888888','123321','qwertyuiop','987654321','zxcvbnm','asdfghjkl','1234',
    '1111','0000','55555','99999','77777','88888','66666','jessica','jordan',
    'jennifer','william','daniel','matthew','andrew','joshua','george','thomas',
    'hunter','harley','ranger','buster','dakota','tigger','diamond','summer',
    'winter','spring','autumn','freedom','america','london','liverpool','arsenal',
    'chelsea','warrior','thunder','password3','pass123','p@ssword','pa$$word',
    'P@ssw0rd','letme1n','welcome1','changeme','secret','mypass'
  ],
  names: [
    'alice123','bob123','charlie1','david123','emma2024','james123','john1234',
    'mary1234','mike2023','sarah123','jennifer','michael1','william1','thomas123',
    'robert12','olivia12','sophia12','mason123','noah1234','liam1234','admin1',
    'user1234','guest123','demo1234','test1234','root1234','info1234','contact1',
    'support1','help1234'
  ],
  leet: [
    'p@ssword','p4ssword','passw0rd','pa55word','p@55w0rd','@dmin123','s3cur1ty',
    'h@cker12','l33th4x0r','c0mputer','1ntern3t','fr33dom!','s3cret!1','l0g1n123',
    'w3lc0me1','$ecure12','m0nk3y12','dr@gon12','h3ll0123'
  ]
};

// ─── Attack State ──────────────────────────────────────────────────────────────
let cracking = false;

// ─── Dictionary Attack ─────────────────────────────────────────────────────────
async function startCrack() {
  const pwd = document.getElementById('passwordInput').value;

  if (!pwd) {
    appendTerminal('<span class="t-red">ERROR: No password entered. Set target first.</span>');
    return;
  }

  if (cracking) return;

  const listKey  = document.getElementById('wordlistSelect').value;
  const hashType = document.getElementById('hashTypeSelect').value;
  const wordlist = WORDLISTS[listKey];

  const targetHash = hashCache[hashType === 'sha256' ? 'sha256' : hashType === 'sha1' ? 'sha1' : 'md5'];

  if (!targetHash) {
    appendTerminal('<span class="t-red">ERROR: Compute hashes first by typing a password.</span>');
    return;
  }

  cracking = true;
  document.getElementById('crackBtn').disabled = true;

  const progress = document.getElementById('crackProgress');
  progress.classList.add('visible');

  // Clear terminal
  document.getElementById('terminalOutput').innerHTML = '';

  const algo = hashType === 'sha256' ? 'SHA-256' : hashType === 'sha1' ? 'SHA-1' : 'MD5';

  appendTerminal(`<span class="t-amber">$ john --wordlist=${listKey}.txt --format=${algo.toLowerCase().replace('-', '')} hash.txt</span>`);
  appendTerminal(`<span class="t-dim">Loaded 1 password hash (${algo})</span>`);
  appendTerminal(`<span class="t-dim">Wordlist: ${wordlist.length} candidates</span>`);
  appendTerminal(`<span class="t-dim">Press 'q' or Ctrl-C to abort</span>`);
  appendTerminal('');

  let found = false;

  for (let i = 0; i < wordlist.length; i++) {
    const candidate = wordlist[i];
    const pct = Math.round(((i + 1) / wordlist.length) * 100);

    // Update progress bar
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressPct').textContent  = pct + '%';
    document.getElementById('progressLabel').textContent = `Trying: ${candidate}`;

    // Compute hash for candidate
    let candidateHash;
    if (hashType === 'md5')        candidateHash = md5(candidate);
    else if (hashType === 'sha1')  candidateHash = await sha('SHA-1', candidate);
    else                           candidateHash = await sha('SHA-256', candidate);

    // Print progress to terminal every 10 attempts
    if (i % 10 === 0 || i < 5) {
      appendTerminal(`<span class="t-dim">  [${String(i + 1).padStart(3, '0')}/${wordlist.length}] trying: ${candidate}</span>`);
    }

    await new Promise(r => setTimeout(r, 30));

    if (candidateHash === targetHash) {
      appendTerminal('');
      appendTerminal(`<span class="t-green">████████████████████████████████████████</span>`);
      appendTerminal(`<span class="t-green">  ✓ PASSWORD CRACKED IN ${i + 1} ATTEMPT${i === 0 ? '' : 'S'}!</span>`);
      appendTerminal(`<span class="t-green">  HASH : ${targetHash.slice(0, 32)}...</span>`);
      appendTerminal(`<span class="t-green">  PLAIN: ${candidate}</span>`);
      appendTerminal(`<span class="t-green">████████████████████████████████████████</span>`);
      appendTerminal('');
      appendTerminal(`<span class="t-amber">⚠ This password exists in common wordlists.</span>`);
      appendTerminal(`<span class="t-amber">  Use a longer, unique passphrase instead.</span>`);
      found = true;
      break;
    }
  }

  if (!found) {
    appendTerminal('');
    appendTerminal(`<span class="t-blue">─────────────────────────────────────────</span>`);
    appendTerminal(`<span class="t-blue">  ✓ NOT FOUND in ${wordlist.length}-word dictionary</span>`);
    appendTerminal(`<span class="t-blue">  Password survived this attack vector.</span>`);
    appendTerminal(`<span class="t-blue">─────────────────────────────────────────</span>`);
    appendTerminal(`<span class="t-dim">  Note: larger wordlists (rockyou.txt has</span>`);
    appendTerminal(`<span class="t-dim">  14M+ entries) may still find this password.</span>`);
  }

  appendTerminal('');
  appendTerminal(`<span class="t-dim">Session completed. <span class="cursor"></span></span>`);

  cracking = false;
  document.getElementById('crackBtn').disabled = false;
}

// ─── Append line to terminal output ───────────────────────────────────────────
function appendTerminal(html) {
  const term = document.getElementById('terminalOutput');
  const line = document.createElement('div');
  line.innerHTML = html;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
}

// ─── Wire up attack button ─────────────────────────────────────────────────────
document.getElementById('crackBtn').addEventListener('click', startCrack);