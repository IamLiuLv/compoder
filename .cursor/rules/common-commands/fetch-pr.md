---
description:
globs:
alwaysApply: false
---

# Fetch PR Rules

## Description

This rule defines the standard process for fetching and checking out pull requests locally.

## Steps

1. Fetch the PR using PR number:

```bash
git fetch origin pull/<PR_NUMBER>/head:pr<PR_NUMBER>
```

2. Switch to the PR branch:

```bash
git checkout pr<PR_NUMBER>
```

## Example

For PR #18:

```bash
git fetch origin pull/18/head:pr18
git checkout pr18
```

## Benefits

- Branch name directly corresponds to PR number for easy reference
- Consistent naming convention across team
- Simplified PR review process
