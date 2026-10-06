# Knowledge hub

One lesson per file, written by whoever (person or agent) paid for it: a wrong assumption
corrected, a trap that cost real time, an approach confirmed to work and why. Not a changelog
and not a copy of what the source or the README already says. Read this directory before
starting work in an unfamiliar area; update an existing note rather than adding a
near-duplicate; delete a note that turns out to be wrong.

This directory sits at the repository root instead of `docs/knowledge-hub/` because `/docs` is
git-ignored here.

File name: `YYYY-MM-DD-short-slug.md`. Every entry carries this frontmatter (the
same shape across Bucket Protocol repositories):

```yaml
---
title: One-line summary of the lesson
date: 2026-10-02
domain: oracle                 # area the lesson is about (oracle, cdp, psm, saving, config, build, tests, …)
knowledge_type: gotcha         # gotcha | pattern | decision | incident
source: human                  # human | agent
project: bucket-protocol-sdk
tags: []
affected_files:
  - src/client.ts
related_errors: []             # error codes or messages, when there are any
---
```

Body: what happened, why it mattered, what to do instead, and the command or check that proves
the fix. Keep it to what a reader needs to avoid the same cost.
