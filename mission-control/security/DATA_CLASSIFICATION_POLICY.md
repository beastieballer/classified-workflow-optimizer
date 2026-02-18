# Data Classification Policy

## Levels
1. **Public** — safe for website/marketing
2. **Internal** — team-only operational content
3. **Sensitive** — pricing, contracts, customer details, candidate info
4. **Restricted** — clearance-linked workflows, secure-facility details, authority coordination artifacts

## Handling Rules
| Level | Storage | Sharing | Access | Retention |
|---|---|---|---|---|
| Public | approved public repos/CMS | open | all team | indefinite |
| Internal | approved cloud workspace | internal only | role-based | 24 months |
| Sensitive | encrypted approved workspace/CRM | need-to-know only | named-role + MFA | 36 months |
| Restricted | isolated encrypted workspace | no external forwarding | explicit allowlist + MFA + device trust | 60 months / legal |

## Non-Negotiables
- No personal email/cloud for Sensitive/Restricted data
- Every incoming file tagged at intake
- Restricted exports must be tracked in `EVIDENCE_LOG.md`
