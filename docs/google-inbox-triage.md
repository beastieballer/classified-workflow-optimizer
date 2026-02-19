# Daily Important Inbox Filter (Gmail + GOG)

Use this query to surface likely-important, non-promo messages from the last 24 hours:

```bash
gog gmail search 'newer_than:1d in:inbox -category:promotions -category:social -from:(no-reply) -subject:("unsubscribe" OR "sale" OR "deal")' --max 50 --json
```

## Higher-signal finance/ops query (recommended)

```bash
gog gmail search 'newer_than:1d in:inbox (from:(openrouter.ai OR em.gemini.com OR newrez.com OR stripe.com OR paypal.com OR bank OR credit) OR subject:(receipt OR invoice OR payment OR billing OR "important notice" OR alert OR due OR security OR policy)) -category:promotions' --max 50 --json
```

## Fast “only truly urgent” query

```bash
gog gmail search 'newer_than:1d in:inbox (subject:(urgent OR action required OR "important notice" OR due OR failed OR declined OR security) OR from:(bank OR stripe.com OR paypal.com)) -category:promotions -category:social' --max 30 --json
```

## Suggested daily run pattern

1. Run **Higher-signal finance/ops query**
2. Then run **Daily Important Inbox Filter**
3. Triage each result into:
   - Do Now
   - This Week
   - Archive

## Optional account pinning

If needed:

```bash
export GOG_ACCOUNT="beastieballer@gmail.com"
```
