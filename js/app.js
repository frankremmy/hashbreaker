function formatCrackTime(entropy) {
  // Assume 10 billion guesses/sec (GPU crack rate)
  const guesses = Math.pow(2, entropy);
  const secs = guesses / 1e10;
  if (secs < 1) return 'instantly';
  if (secs < 60) return `~${secs.toFixed(1)} seconds`;
  if (secs < 3600) return `~${(secs/60).toFixed(1)} minutes`;
  if (secs < 86400) return `~${(secs/3600).toFixed(1)} hours`;
  if (secs < 31536000) return `~${(secs/86400).toFixed(1)} days`;
  if (secs < 3.15e9) return `~${(secs/31536000).toFixed(1)} years`;
  return `~${(secs/3.15e9).toFixed(1)} billion years`;
}

// ─── Copy hash ─────────────────────────────────────────────────────────────────
function copyHash(id) {
  const txt = document.getElementById(id).textContent;
  navigator.clipboard.writeText(txt).catch(() => {});
  const btn = event.target;
  btn.textContent = '✓ COPIED';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 1500);
}