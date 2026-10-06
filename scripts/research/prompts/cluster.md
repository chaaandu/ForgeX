version: 1

# Cluster signals into candidate problems

You are helping build a bank of open problem statements for 119 first-year business-school
founders in India (Mesa School of Business). Each founder picks one problem and spends a
three-week sprint building a first answer to it while learning modern tech and AI by building.

You will receive a batch of **signals**. Each is one piece of public evidence, 2025 or 2026 where
possible, that somebody has a problem: an ID, a source (`hn`, `reddit`, `fixmyitch`, `yc`, ...),
a date, a geography (`IN` or `global`), optional industry and side hints, and a paraphrase of 25
words or fewer.

## Your task

Group signals that describe **the same underlying problem** into candidate problems. Then write
each candidate in the house style below.

- A good cluster is specific enough that a founder knows whose day is broken and how, and broad
  enough that several independent people, ideally on different sources, are describing it.
  "Small businesses struggle with operations" is too broad. "One shop's billing software crashed
  on Tuesday" is too narrow.
- Aim for clusters of 3 or more signals drawn from 2 or more source types. A cluster with fewer
  is allowed, but it will be dropped later unless more evidence arrives, so do not pad it with
  loosely related signals to reach the number.
- A signal belongs to at most one candidate. Leave a signal out rather than force it in.
- Use only the signal IDs you were given. Never invent an ID, a statistic or a source.
- Do not filter for quality, buildability or ambition. Scoring and dropping happen later.
- Prefer clusters that matter in India. When the evidence is mostly global, keep the cluster if
  the problem plausibly exists for Indian businesses, consumers or creators too.

## Writing rules for each candidate

- **title**: under ten words. Concrete nouns, a little provocative. No colons, no question marks,
  no brand or company names.
- **problem**: two or three sentences on what is broken in the world and what it costs (time,
  money, health, trust). Do not name a target persona (no invented people, no "meet Priya") and
  do not describe a solution. Never use the words `app`, `platform`, `AI-powered` or `tool that`.
  80 to 600 characters.
- **challenge**: one line in the imperative that sets the task without naming the product, at
  most 160 characters. Good: "Make the weekly stock check take ten minutes, not two hours."
  Bad: "Build an inventory app."
- **signalIds**: every signal in the cluster.
- **industries**: 1 to 3 IDs from the industry list, most relevant first. The first is the
  primary industry.
- **side**: the one side that lives the problem most: `business`, `consumer` or `creator`.
- **learn**: 1 to 3 learn IDs naming what building a serious answer would most likely teach.
  Choose honestly; do not add `agents` or `voice` to everything.
- **geo**: `IN` if the problem is specific to India or most of its evidence is Indian, else
  `global`.

## Vocabulary

The user message lists the allowed IDs for industries, sides and learn tags. Use no others.

## Output

Return JSON matching the given schema: `{ "candidates": [ ... ] }`.
