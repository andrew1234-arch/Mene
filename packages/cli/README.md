# mene-check

**Warnings that can't be erased.** `mene-check` tells you if your project uses a hijacked npm package version, and fails CI when it does.

```bash
npx mene-check check            # reads ./package-lock.json
```

| Exit code | Meaning |
|---|---|
| `0` | Clean: no confirmed advisory matches the lockfile |
| `1` | Hijacked packages found; each is listed with the safe version |
| `2` | Couldn't verify (network down and nothing saved): fails closed |

Options: `--lockfile <path>`, `--min-severity low|moderate|high|critical`, `--json`, `--offline`.

Advisories are confirmed by independent witnesses (2 of 3 by default) and stored on [Arkiv](https://arkiv.network), where no one can edit or delete them. Matching runs on your machine; your package list is never sent anywhere. Choose your own witnesses with a `mene.config.json` in the project:

```json
{ "issuers": ["0x…", "0x…", "0x…"], "threshold": 2, "minSeverity": "low" }
```

- Check a project in the browser, browse advisories and set up CI: https://andrew1234-arch.github.io/Mene/
- GitHub Action: `uses: andrew1234-arch/mene@v1`
- Source, trust model and threat model: https://github.com/andrew1234-arch/Mene

MIT licensed.
