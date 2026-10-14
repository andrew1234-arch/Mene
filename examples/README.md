# Fixtures

These lockfiles are **scanned, never installed**. `chalk-attack/` pins the compromised
`chalk@5.6.1` and `debug@4.4.2` from the 8 Sep 2025 incident; `clean/` pins the known-good
`chalk@5.6.0` and `debug@4.4.1`. Do not run `npm install` / `npm ci` in these folders.
