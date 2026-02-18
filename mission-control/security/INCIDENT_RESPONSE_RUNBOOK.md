# Incident Response Runbook

## Severity
- **SEV-1:** confirmed compromise/exfil risk
- **SEV-2:** suspected compromise or major policy breach
- **SEV-3:** minor policy violation/no exposure

## Response Workflow
1. Detect + classify severity
2. Contain (revoke sessions, freeze sharing, isolate endpoint)
3. Notify internal chain (Founder -> Ops -> Security Liaison)
4. Investigate and document timeline
5. Recover (credential reset, patch, policy fix)
6. Lessons learned + control improvement

## Time Targets
- SEV-1 initial response: 15 minutes
- SEV-2 initial response: 60 minutes
- SEV-3 initial response: same day

## Evidence Requirements
- Time discovered
- Affected systems/data class
- Containment actions
- Recovery actions
- Preventive changes applied
