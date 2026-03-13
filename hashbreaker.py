#!/usr/bin/env python3
"""
HashBreaker: A Password Strength Analyzer & Dictionary Attack Demo
=================================================================
A portfolio project demonstrating knowledge of:
  - Cryptographic hash functions (MD5, SHA-1, SHA-256)
  - Password strength analysis & entropy calculation
  - Dictionary attack simulation (as used by John the Ripper)
  - Secure password principles

For learning purposes only.
"""

import hashlib
import math
import time
import sys
import argparse
from pathlib import Path


# ─── ANSI colours ─────────────────────────────────────────────────────────────
class C:
    RESET  = '\033[0m'
    BOLD   = '\033[1m'
    RED    = '\033[91m'
    GREEN  = '\033[92m'
    YELLOW = '\033[93m'
    BLUE   = '\033[94m'
    CYAN   = '\033[96m'
    DIM    = '\033[2m'
    AMBER  = '\033[38;5;214m'

def colour(text, *codes):
    return ''.join(codes) + text + C.RESET


# ─── Banner ────────────────────────────────────────────────────────────────────
BANNER = f"""
{C.AMBER}{C.BOLD}
  ██╗  ██╗ █████╗ ███████╗██╗  ██╗
  ██║  ██║██╔══██╗██╔════╝██║  ██║
  ███████║███████║███████╗███████║
  ██╔══██║██╔══██║╚════██║██╔══██║
  ██║  ██║██║  ██║███████║██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  ██████╗ ██████╗ ███████╗ █████╗ ██╗  ██╗███████╗██████╗
  ██╔══██╗██╔══██╗██╔════╝██╔══██╗██║ ██╔╝██╔════╝██╔══██╗
  ██████╔╝██████╔╝█████╗  ███████║█████╔╝ █████╗  ██████╔╝
  ██╔══██╗██╔══██╗██╔══╝  ██╔══██║██╔═██╗ ██╔══╝  ██╔══██╗
  ██████╔╝██║  ██║███████╗██║  ██║██║  ██╗███████╗██║  ██║
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
{C.RESET}
{C.DIM}  Password Strength Analyzer & Dictionary Attack Demo{C.RESET}
{C.DIM}  Inspired by John the Ripper | Educational Use Only{C.RESET}
"""


# ─── Hashing ───────────────────────────────────────────────────────────────────
def compute_hashes(password: str) -> dict:
    """Compute MD5, SHA-1, and SHA-256 hashes for a password."""
    encoded = password.encode('utf-8')
    return {
        'MD5':    hashlib.md5(encoded).hexdigest(),
        'SHA-1':  hashlib.sha1(encoded).hexdigest(),
        'SHA-256': hashlib.sha256(encoded).hexdigest(),
    }


# ─── Strength Analysis ─────────────────────────────────────────────────────────
def analyse_strength(password: str) -> dict:
    """Analyse password strength and compute entropy."""
    length    = len(password)
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_sym   = any(not c.isalnum() for c in password)

    charset = 0
    if has_upper: charset += 26
    if has_lower: charset += 26
    if has_digit: charset += 10
    if has_sym:   charset += 32
    if charset == 0: charset = 1

    entropy = length * math.log2(charset)

    score = 0
    if length >= 8:  score += 1
    if length >= 12: score += 1
    if length >= 16: score += 1
    if has_upper:    score += 1
    if has_lower:    score += 1
    if has_digit:    score += 1
    if has_sym:      score += 1

    return {
        'length': length,
        'has_upper': has_upper,
        'has_lower': has_lower,
        'has_digit': has_digit,
        'has_sym': has_sym,
        'charset_size': charset,
        'entropy': entropy,
        'score': score,
    }


def format_crack_time(entropy: float) -> str:
    """Estimate crack time assuming 10 billion guesses/sec (modern GPU)."""
    guesses = 2 ** entropy
    secs = guesses / 1e10
    if secs < 1:          return colour('instantly', C.RED, C.BOLD)
    if secs < 60:         return colour(f'~{secs:.1f} seconds', C.RED)
    if secs < 3600:       return colour(f'~{secs/60:.1f} minutes', C.YELLOW)
    if secs < 86400:      return colour(f'~{secs/3600:.1f} hours', C.YELLOW)
    if secs < 31536000:   return colour(f'~{secs/86400:.1f} days', C.CYAN)
    if secs < 3.15e9:     return colour(f'~{secs/31536000:.1f} years', C.GREEN)
    return colour(f'~{secs/3.15e9:.2e} billion years', C.GREEN, C.BOLD)


def strength_label(score: int) -> tuple:
    """Return (label, colour_code) for a score."""
    if score <= 1: return ('CRITICAL', C.RED + C.BOLD)
    if score <= 2: return ('WEAK',     C.RED)
    if score <= 4: return ('MODERATE', C.YELLOW)
    if score <= 5: return ('STRONG',   C.GREEN)
    return ('VERY STRONG', C.GREEN + C.BOLD)


def strength_bar(score: int, width: int = 30) -> str:
    """Render a visual strength bar."""
    filled = int((score / 7) * width)
    _, col = strength_label(score)
    bar = col + '█' * filled + C.DIM + '░' * (width - filled) + C.RESET
    return f'[{bar}]'


# ─── Display Functions ─────────────────────────────────────────────────────────
def print_hashes(hashes: dict):
    print(f"\n{colour('  HASH DIGESTS', C.AMBER, C.BOLD)}")
    print(f"  {C.DIM}{'─' * 68}{C.RESET}")
    labels = {
        'MD5':     ('128-bit', 'BROKEN — collision attacks exist'),
        'SHA-1':   ('160-bit', 'DEPRECATED — SHAttered (2017)'),
        'SHA-256': ('256-bit', 'SECURE — current standard'),
    }
    for algo, digest in hashes.items():
        bits, note = labels[algo]
        status_col = C.RED if algo in ('MD5', 'SHA-1') else C.GREEN
        print(f"\n  {colour(f'{algo:<8}', C.AMBER)} {colour(bits, C.DIM)}  {colour(note, status_col)}")
        print(f"  {colour(digest, C.BLUE)}")
    print(f"\n  {C.DIM}{'─' * 68}{C.RESET}")


def print_strength(stats: dict):
    score = stats['score']
    label, col = strength_label(score)
    entropy = stats['entropy']

    print(f"\n{colour('  STRENGTH ANALYSIS', C.AMBER, C.BOLD)}")
    print(f"  {C.DIM}{'─' * 68}{C.RESET}")

    print(f"\n  Strength:  {strength_bar(score)}  {colour(label, col)}")
    print(f"  Entropy:   {colour(f'{entropy:.2f} bits', C.CYAN)}")
    print(f"  Crack est: {format_crack_time(entropy)}  {C.DIM}(@ 10B guesses/sec GPU){C.RESET}")
    print(f"\n  Length:    {stats['length']} chars  "
          f"{'✓' if stats['length'] >= 8 else '✗'} (min 8)")

    checks = [
        ('Uppercase',  stats['has_upper']),
        ('Lowercase',  stats['has_lower']),
        ('Digits',     stats['has_digit']),
        ('Symbols',    stats['has_sym']),
    ]
    for name, ok in checks:
        icon = colour('✓', C.GREEN) if ok else colour('✗', C.RED)
        print(f"  {icon} {name}")

    print(f"\n  {C.DIM}Charset size: {stats['charset_size']} possible characters{C.RESET}")
    print(f"  {C.DIM}{'─' * 68}{C.RESET}")


# ─── Built-in Wordlists ────────────────────────────────────────────────────────
BUILT_IN_WORDLISTS = {
    'top100': [
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
        'P@ssw0rd','letme1n','welcome1','changeme','secret','mypass',
    ]
}


# ─── Dictionary Attack ─────────────────────────────────────────────────────────
def dictionary_attack(target_password: str, wordlist: list, algo: str = 'SHA-256', delay: float = 0.02):
    """
    Simulate a John the Ripper-style dictionary attack.
    Returns the cracked password or None.
    """
    hashes = compute_hashes(target_password)
    target_hash = hashes[algo]

    def hash_candidate(word):
        enc = word.encode('utf-8')
        if algo == 'MD5':    return hashlib.md5(enc).hexdigest()
        if algo == 'SHA-1':  return hashlib.sha1(enc).hexdigest()
        return hashlib.sha256(enc).hexdigest()

    print(f"\n{colour('  DICTIONARY ATTACK SIMULATION', C.AMBER, C.BOLD)}")
    print(f"  {C.DIM}{'─' * 68}{C.RESET}")
    print(f"\n  {colour('$', C.GREEN)} john --wordlist=wordlist.txt --format={algo.lower().replace('-','')} hash.txt")
    print(f"\n  {C.DIM}Loaded 1 password hash ({algo})")
    print(f"  Target: {target_hash[:32]}...{C.RESET}\n")

    start = time.time()
    total = len(wordlist)

    for i, candidate in enumerate(wordlist):
        candidate_hash = hash_candidate(candidate)
        pct = int(((i + 1) / total) * 100)

        # Progress bar
        bar_len = 30
        filled = int((pct / 100) * bar_len)
        bar = C.AMBER + '█' * filled + C.DIM + '░' * (bar_len - filled) + C.RESET
        print(f"\r  [{bar}] {pct:3d}%  {C.DIM}Trying: {candidate:<20}{C.RESET}", end='', flush=True)

        if delay: time.sleep(delay)

        if candidate_hash == target_hash:
            elapsed = time.time() - start
            print()  # newline after progress bar
            print(f"\n  {colour('█' * 50, C.GREEN)}")
            print(f"  {colour('  ✓ PASSWORD CRACKED!', C.GREEN, C.BOLD)}")
            print(f"  {colour(f'  HASH  : {target_hash}', C.GREEN)}")
            print(f"  {colour(f'  PLAIN : {candidate}', C.GREEN, C.BOLD)}")
            print(f"  {colour(f'  TRIES : {i + 1} / {total}', C.GREEN)}")
            print(f"  {colour(f'  TIME  : {elapsed:.2f}s', C.GREEN)}")
            print(f"  {colour('█' * 50, C.GREEN)}")
            print(f"\n  {colour('⚠  This password is in common wordlists!', C.YELLOW, C.BOLD)}")
            print(f"  {colour('   Use a long, unique passphrase instead.', C.YELLOW)}")
            return candidate

    elapsed = time.time() - start
    print()
    print(f"\n  {colour('─' * 50, C.BLUE)}")
    print(f"  {colour('  ✓ NOT FOUND in dictionary', C.BLUE, C.BOLD)}")
    print(f"  {colour(f'  Tried {total} candidates in {elapsed:.2f}s', C.BLUE)}")
    print(f"  {colour('─' * 50, C.BLUE)}")
    print(f"\n  {C.DIM}Note: rockyou.txt contains 14M+ entries.")
    print(f"  A real John the Ripper attack would also try")
    print(f"  rule-based mutations, hybrid attacks, and more.{C.RESET}")
    return None


# ─── Load external wordlist ────────────────────────────────────────────────────
def load_wordlist(path: str) -> list:
    p = Path(path)
    if not p.exists():
        print(colour(f"  ERROR: Wordlist file not found: {path}", C.RED))
        sys.exit(1)
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        words = [line.strip() for line in f if line.strip()]
    print(colour(f"  Loaded {len(words):,} words from {p.name}", C.DIM))
    return words


# ─── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description='HashBreaker — Password Strength Analyzer & Dictionary Attack Demo',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python hashbreaker.py -p "mypassword"
  python hashbreaker.py -p "mypassword" --attack --algo SHA-256
  python hashbreaker.py -p "mypassword" --attack --wordlist /usr/share/wordlists/rockyou.txt
  python hashbreaker.py -p "mypassword" --hashes-only
        """
    )
    parser.add_argument('-p', '--password',    required=True,  help='Password to analyse')
    parser.add_argument('--attack',            action='store_true', help='Run dictionary attack simulation')
    parser.add_argument('--algo',              default='SHA-256', choices=['MD5','SHA-1','SHA-256'],
                        help='Hash algorithm for attack (default: SHA-256)')
    parser.add_argument('--wordlist',          default=None,   help='Path to wordlist file (default: built-in top100)')
    parser.add_argument('--hashes-only',       action='store_true', help='Only output hash values (no colour)')
    parser.add_argument('--no-delay',          action='store_true', help='Remove artificial delay in attack simulation')

    args = parser.parse_args()
    password = args.password

    if args.hashes_only:
        hashes = compute_hashes(password)
        for algo, digest in hashes.items():
            print(f"{algo}: {digest}")
        return

    print(BANNER)

    # ── Analysis
    hashes = compute_hashes(password)
    stats  = analyse_strength(password)

    print_hashes(hashes)
    print_strength(stats)

    # ── Dictionary attack
    if args.attack:
        wordlist = load_wordlist(args.wordlist) if args.wordlist else BUILT_IN_WORDLISTS['top100']
        delay = 0.0 if args.no_delay else 0.03
        dictionary_attack(password, wordlist, algo=args.algo, delay=delay)

    print(f"\n  {C.DIM}{'─' * 68}")
    print(f"  Session complete.")
    print(f"  HashBreaker | Educational Use Only{C.RESET}\n")


if __name__ == '__main__':
    main()
