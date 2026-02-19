# Biggest OpenClaw Security Mistakes on a Self-Hosted Mac mini

_Last updated: 2026-02-19_

## TL;DR
Most incidents come from one pattern: users expose OpenClaw (or adjacent control surfaces) to broader networks before tightening auth, tool scope, and OS hardening.

## Top Mistakes (ranked by risk)

1. **Binding Gateway beyond loopback too early**
   - Mistake: running with LAN/public exposure (`0.0.0.0` style posture) during setup.
   - Why it hurts: anyone on reachable networks can hit control surfaces if auth/policies are weak.
   - Better: start with `bind: loopback`, then add controlled remote access (VPN/tailnet + auth).

2. **Assuming `openclaw security audit --fix` hardens the entire host**
   - Mistake: believing `--fix` configures macOS firewall, SSH, updates, or all network policy.
   - Why it hurts: host-level attack paths stay open.
   - Better: treat OpenClaw audit as app-level hardening + separately harden macOS (firewall, SSH, update policy).

3. **Weak or missing gateway auth / short shared secrets**
   - Mistake: token/password auth not set strongly, or insecure UI auth exceptions left on.
   - Why it hurts: brute-force or credential reuse risk increases sharply.
   - Better: long random secrets, no insecure auth fallbacks in normal operation.

4. **Overly broad tool permissions in reachable chats/surfaces**
   - Mistake: allowing runtime/shell/filesystem tools in contexts where untrusted prompts can reach the bot.
   - Why it hurts: prompt-injection becomes system-command/file-action blast radius.
   - Better: least privilege by default, deny sensitive tool groups unless explicitly needed.

5. **Permissive DM/group policies**
   - Mistake: broad DM policies in shared inbox scenarios.
   - Why it hurts: strangers or unintended users can trigger high-impact actions.
   - Better: pairing/allowlists + per-peer session scoping.

6. **Reverse proxy misconfiguration (trusting wrong proxy hops)**
   - Mistake: using proxy headers without a correct `trustedProxies` setup.
   - Why it hurts: client-IP trust and local-client assumptions can be wrong.
   - Better: explicitly set trusted proxies and ensure proxy overwrites forwarding headers.

7. **No regular audit cadence**
   - Mistake: one-time setup, then no re-check after config drift or new tools/channels.
   - Why it hurts: posture silently regresses.
   - Better: run `openclaw security audit` regularly (and `--deep` periodically), plus update-status checks.

8. **macOS baseline gaps (outside OpenClaw)**
   - Mistake: FileVault disabled, weak account hygiene, stale OS updates, unnecessary services exposed.
   - Why it hurts: host compromise bypasses app-level safeguards.
   - Better: enable FileVault, keep macOS patched, minimize remote exposure, use strong admin hygiene.

## Practical “safe baseline” for a Mac mini

- Keep Gateway local-only first (`bind: loopback`).
- Require strong auth, avoid insecure auth exceptions.
- Use strict DM policy + allowlists for who can trigger the assistant.
- Keep dangerous tool groups disabled by default.
- Re-run security audit after each meaningful config/tool/channel change.
- Treat host hardening (firewall/SSH/updates/FileVault) as a separate checklist.

## What to monitor weekly

- OpenClaw: `security audit`, `security audit --deep`, update status.
- Host: firewall state, listening ports, SSH policy, macOS update state, FileVault status.

## Sources

- OpenClaw Security docs: https://docs.openclaw.ai/gateway/security
- Community hardening discussions and incident write-ups (cross-checked):
  - https://www.bitsight.com/blog/openclaw-ai-security-risks-exposed-instances
  - https://innfactory.ai/en/blog/openclaw-ai-agent-security/
  - https://coder.com/blog/why-i-ditched-openclaw-and-built-a-more-secure-ai-agent-on-blink-mac-mini

> Note: third-party articles vary in quality. OpenClaw official docs were treated as primary authority; external posts used for recurring real-world failure patterns.
