# OpenAI and Anthropic Model Configuration Snippets for OpenClaw

## OpenAI Models

```yaml
agents:
  gpt-4:
    id: gpt-4
    name: "OpenAI GPT-4"
    model: openai/gpt-4
    description: "Top-tier GPT-4 for advanced tasks, high quality output."
  gpt-3.5:
    id: gpt-3.5
    name: "OpenAI GPT-3.5"
    model: openai/gpt-3.5-turbo
    description: "Cheaper and fast GPT-3.5 for everyday tasks, balanced power and cost."
  codex:
    id: codex
    name: "OpenAI Codex"
    model: openai-codex/gpt-5.3-codex
    description: "OpenAI Codex specialized for code generation and understanding."
```

## Anthropic Models

```yaml
agents:
  claude-opus:
    id: claude-opus
    name: "Anthropic Claude Opus"
    model: anthropic/claude-opus-4-6
    description: "Powerful Anthropic Claude Opus model for advanced conversational AI."
  claude-sonnet:
    id: claude-sonnet
    name: "Anthropic Claude Sonnet"
    model: anthropic/claude-sonnet-4-6
    description: "More cost-effective Anthropic Claude Sonnet model for thoughtful dialogues."
```

## Usage

- Add these snippets to your OpenClaw agents or model definition config file.
- Then you can spawn sessions specifying the `agentId` or `model` accordingly.
- This setup provides a spectrum from budget-friendly to top-tier powerful AI to fit your needs.