# HashBreaker: A Password Analysis Lab

> A cybersecurity portfolio project demonstrating cryptographic hashing, password strength analysis, and dictionary attack simulation (as used by John the Ripper).

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-Vanilla%20JS-orange?style=flat-square)
![Topic](https://img.shields.io/badge/Topic-Cryptography%20%7C%20Password%20Security-red?style=flat-square)

---

## What This Project Demonstrates

- **Cryptographic hashing** — MD5, SHA-1, SHA-256 computed in real time
- **Password entropy analysis** — bit entropy calculation, charset analysis, estimated crack time
- **Dictionary attack simulation** — mimics how John the Ripper processes wordlists against password hashes
- **Python scripting** — CLI tool with argument parsing, colour output, progress display
- **Web fundamentals** — vanilla JS Web Crypto API, real-time DOM updates, no dependencies

---

## Files

| File | Description |
|---|---|
| `index.html` | Interactive web app. Open in any browser, no server needed |
| `hashbreaker.py` | Python CLI tool |

---

## Web App

Open `index.html` directly in your browser. No server or dependencies required.

**Features:**
- Real-time hashing as you type
- Visual strength meter with character class detection
- Entropy display + GPU crack time estimate
- Dictionary attack simulation with 4 wordlist presets
- Terminal-style animated output

---

## Python CLI

### Basic usage: Analyse a password

```bash
python hashbreaker.py -p "mypassword"
```

### Show hashes only (scriptable output)

```bash
python hashbreaker.py -p "mypassword" --hashes-only
```

### Run dictionary attack simulation (built-in wordlist)

```bash
python hashbreaker.py -p "123456" --attack --algo SHA-256
```

### Run against a real wordlist (e.g. rockyou.txt)

```bash
python hashbreaker.py -p "mypassword" --attack --wordlist /usr/share/wordlists/rockyou.txt --no-delay
```

### All options

```
  -p, --password     Password to analyse (required)
  --attack           Run dictionary attack simulation
  --algo             Hash algorithm to attack: MD5 | SHA-1 | SHA-256 (default: SHA-256)
  --wordlist         Path to a wordlist file (default: built-in top 100)
  --hashes-only      Output only hash values, no colour (useful for piping)
  --no-delay         Remove artificial delay (for real wordlist runs)
```

---

## Concepts Covered

### Cryptographic Hashing
A hash function takes an input of any length and produces a fixed-length digest. The same input always produces the same output, but you cannot reverse a hash to find the original input (one-way function).

| Algorithm | Output Length | Status |
|---|---|---|
| MD5 | 128-bit (32 hex chars) | **Broken** — collision attacks exist |
| SHA-1 | 160-bit (40 hex chars) | **Deprecated** — SHAttered (2017) |
| SHA-256 | 256-bit (64 hex chars) | **Secure** — current standard |

### Entropy
Password entropy measures how unpredictable a password is:

```
Entropy (bits) = Password Length × log₂(Charset Size)
```

A charset of 94 printable ASCII characters gives ~6.5 bits per character. A 12-character password using the full charset has ~78 bits of entropy, practically uncrackable with today's hardware.

### Dictionary Attacks (John the Ripper)
Rather than trying every possible combination (brute force), a dictionary attack tests passwords from a pre-built list against captured hashes. John the Ripper can also apply **rules** to mutate words (e.g. `password` → `P@ssw0rd`).

This is why even "clever" substitutions on common words are weak. The rules are already in the tool.

---

## How This Relates to TryHackMe

This project covers practical applications of the John the Ripper: The Basics module:

- Understanding why hash formats matter for attack selection
- How wordlists (like `rockyou.txt`) are used in real attacks
- Why password complexity directly affects resistance to cracking
- The difference between fast hashes (MD5/SHA-1) and slow/salted hashes (bcrypt) for storage

---

## Ethical Note

This tool is for educational purposes only. All attack simulations use fictional or public wordlists against passwords you enter yourself. Never use these techniques against systems or accounts you do not own.

---

*Part of a cybersecurity portfolio built while completing the [TryHackMe Cybersecurity 101](https://tryhackme.com/paths) learning path.*
