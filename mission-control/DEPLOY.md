# Mission Control Deploy

## Status
- Vercel CLI is installed on this machine.
- Persistent deploy is blocked only by missing Vercel login token/session.

## One-time setup (Alex)

```bash
cd /Users/alexpotter/.openclaw/workspace/mission-control
vercel login
```

After login, deploy:

```bash
vercel --prod
```

## Ongoing updates
Whenever files change, redeploy:

```bash
cd /Users/alexpotter/.openclaw/workspace/mission-control
vercel --prod
```

## Optional: custom domain
In Vercel dashboard, attach your domain and point DNS records.

## Temporary public URL (already available)
- https://common-rats-retire.loca.lt
