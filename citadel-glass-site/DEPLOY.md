# DEPLOY.md — Citadel Glass Site

## Local Preview

From inside `citadel-glass-site`:

```bash
cd /Users/alexpotter/.openclaw/workspace/citadel-glass-site
python3 -m http.server 4173
```

Then open:

- http://localhost:4173

Alternative local static server:

```bash
npx serve . -l 4173
```

---

## Vercel Deploy (CLI)

### 1) Verify CLI + auth

```bash
vercel --version
vercel whoami
```

### 2) Deploy preview

```bash
cd /Users/alexpotter/.openclaw/workspace/citadel-glass-site
vercel deploy
```

### 3) Deploy production

```bash
vercel deploy --prod
```

Vercel will return a live URL after each deploy.

---

## Notes

- This project is static (`index.html` + inline CSS), no build step required.
- If prompted to link a new Vercel project, accept defaults or choose the desired scope/team.
