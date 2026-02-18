# Access Control Matrix

## Roles
- Founder/Exec (Alex)
- Operations Lead
- Sales/BD
- PM/Delivery
- Security Liaison
- Contractor (limited)

## Resource Access (Baseline)
| Resource | Founder | Ops | Sales | PM | Security Liaison | Contractor |
|---|---|---|---|---|---|---|
| Mission Control dashboards | RW | RW | R | RW | R | R |
| CRM (ClearedConnect) | RW | RW | RW | R | R | None |
| Scope packages (ShieldSpec) | RW | R | None | RW | RW | R (assigned only) |
| Restricted artifacts | RW | R (approved) | None | R (approved) | RW | None |
| Investor decks/financials | RW | R | R | None | None | None |

## Enforcement
- MFA mandatory for all roles
- Quarterly access review
- Remove access within 24h of role change/offboarding
