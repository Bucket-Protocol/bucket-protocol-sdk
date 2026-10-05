#!/usr/bin/env bash
# waterx-commons/harness/lint/check-harness.sh v1.2.1
#
# Checks a repository against the WaterX agent-harness standard
# (Bucket-Protocol/waterx-commons, harness/STANDARD.md). Repos vendor this file as
# scripts/agent-hooks/check-harness.sh; keep the version line above intact so the
# "vendored copies" job in waterx-commons can tell which version a repo carries.
#
# Usage: check-harness.sh [--root <dir>] [--hub <dir>] [--allow-vendored <glob>]... [--report-only]
#                         [--version] [--help]
#   --root <dir>              repository root to check (default: the git toplevel of the cwd, else cwd)
#   --hub <dir>               knowledge-hub directory, relative to the root (default: docs/knowledge-hub,
#                             or knowledge-hub when docs/ is a git submodule)
#   --allow-vendored <glob>   a third-party tree whose CLAUDE.md files check 1 lists but does not fail
#                             (shell glob on the path from the root, '*' crosses '/'; repeatable)
#   --report-only             print every finding but always exit 0
# Exit 1 when a blocking finding exists (and --report-only is not set), 0 otherwise, 64 on a
# bad argument. Inside a git checkout the scan covers tracked and untracked-but-not-ignored
# files (submodule contents excluded); elsewhere it walks the tree minus build directories.
#
# Portability: bash 3.2 (macOS /bin/bash) and up; coreutils, find, grep, awk, sed, git.
# JSON and .codex/rules are read with awk, so the result is the same with or without jq.
set -u

VERSION="1.2.1"
# Released versions of harness/hooks/lib/shell-segments.sh and their sha256, for check 10.
# Every release of the segmenter adds a line here (CI fails when the current one is missing).
KNOWN_SEGMENTERS="
1.1.0 7123ebaf34af6b32e84576fc293e04a563efc00138854aedcad9f50e0531dc52
"
ROOT=""
HUB=""
REPORT_ONLY=0
ALLOW_VENDORED=""
ROOT_LIMIT_LINES=200
ROOT_LIMIT_BYTES=24576
DESCRIPTION_LIMIT_CHARS=1536
CODEX_DEFAULT_CAP=32768
CODEX_WARN_BYTES=30720
CODEX_REQUIRED_CAP=131072

usage() { sed -n '2,21p' "$0"; }

while [ $# -gt 0 ]; do
  case "$1" in
    --root|--hub)
      [ $# -ge 2 ] && [ -n "$2" ] || { echo "$1 needs a directory" >&2; usage >&2; exit 64; }
      if [ "$1" = --root ]; then ROOT=$2; else HUB=$2; fi
      shift 2 ;;
    --allow-vendored)
      [ $# -ge 2 ] && [ -n "$2" ] || { echo "$1 needs a glob" >&2; usage >&2; exit 64; }
      ALLOW_VENDORED="$ALLOW_VENDORED$2
"; shift 2 ;;
    --allow-vendored=*) ALLOW_VENDORED="$ALLOW_VENDORED${1#--allow-vendored=}
"; shift ;;
    --root=*) ROOT=${1#--root=}; shift ;;
    --hub=*) HUB=${1#--hub=}; shift ;;
    --report-only) REPORT_ONLY=1; shift ;;
    --version) echo "check-harness.sh v$VERSION"; exit 0 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown argument: $1" >&2; usage >&2; exit 64 ;;
  esac
done

if [ -z "$ROOT" ]; then
  ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
fi
ROOT_ARG=$ROOT
ROOT=$(cd "$ROOT_ARG" 2>/dev/null && pwd -P) || { echo "root not found: $ROOT_ARG" >&2; exit 64; }
cd "$ROOT" || exit 64

BLOCKING=0
ADVISORY=0
CHECK_FINDINGS=0

phys() { # physical path of a directory, empty when it does not resolve
  (cd "$1" 2>/dev/null && pwd -P)
}

# The file set every check reads. In a git checkout rooted here: tracked plus untracked files
# that .gitignore does not exclude, so local worktree copies, build output and submodule
# contents (each a separate repository with its own harness) stay out. Elsewhere: a walk
# that skips dependency and build trees.
PRUNE_DIRS='.git node_modules target dist build .next vendor .venv'
SUBMODULES=""
if [ "$(phys "$(git rev-parse --show-toplevel 2>/dev/null || echo /nonexistent)")" = "$ROOT" ]; then
  ALL_FILES=$(git -c core.quotepath=off ls-files --cached --others --exclude-standard 2>/dev/null |
    while IFS= read -r p; do { [ -e "$p" ] || [ -L "$p" ]; } && printf '%s\n' "$p"; done)
  [ -f .gitmodules ] && SUBMODULES=$(git config -f .gitmodules --get-regexp '^submodule\..*\.path$' 2>/dev/null | awk '{ print $2 }')
else
  prune=""
  for d in $PRUNE_DIRS; do prune="$prune${prune:+ -o }-name $d"; done
  # shellcheck disable=SC2086
  ALL_FILES=$(find . \( $prune \) -prune -o \( -type f -o -type l \) -print 2>/dev/null | sed 's|^\./||')
fi

# find_files <basename>: paths relative to ROOT with that basename, sorted.
find_files() {
  printf '%s\n' "$ALL_FILES" | awk -F/ -v n="$1" '$NF == n' | sort
}

is_submodule_path() { # <relative path>: 0 when it lies inside a git submodule
  local m
  for m in $SUBMODULES; do case "$1" in "$m"|"$m"/*) return 0;; esac; done
  return 1
}

# The lesson store. A repo whose docs/ is a submodule (another repository) keeps it at the root.
if [ -z "$HUB" ]; then
  if is_submodule_path docs; then HUB=knowledge-hub; else HUB=docs/knowledge-hub; fi
fi
HUB=${HUB%/}

file_bytes() { wc -c < "$1" | tr -d ' '; }
file_lines() { wc -l < "$1" | tr -d ' '; }

# A UTF-8 locale for counting characters: Linux lists it as C.utf8, macOS as en_US.UTF-8.
UTF8_LOCALE=$(locale -a 2>/dev/null | grep -iE '^(c|en_us)\.utf-?8$' | head -1)
char_count() { # characters on stdin; bytes (an overcount, never an undercount) without a UTF-8 locale
  if [ -n "$UTF8_LOCALE" ]; then LC_ALL=$UTF8_LOCALE wc -m | tr -d ' '; else wc -c | tr -d ' '; fi
}

git_ignored() { # 0 when the path is ignored by git (only meaningful inside a git repo)
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || return 1
  git check-ignore -q "$1" 2>/dev/null
}

begin_check() { # <number> <title> <reason>
  CHECK_FINDINGS=0
  printf '[%s] %s\n    why: %s\n' "$1" "$2" "$3"
}
fail() { # blocking finding
  CHECK_FINDINGS=$((CHECK_FINDINGS + 1))
  if [ $REPORT_ONLY -eq 1 ]; then ADVISORY=$((ADVISORY + 1)); printf '    FAIL(report-only) %s\n' "$1"
  else BLOCKING=$((BLOCKING + 1)); printf '    FAIL %s\n' "$1"; fi
}
warn() { # advisory finding
  CHECK_FINDINGS=$((CHECK_FINDINGS + 1)); ADVISORY=$((ADVISORY + 1)); printf '    WARN %s\n' "$1"
}
end_check() { [ $CHECK_FINDINGS -eq 0 ] && printf '    ok\n'; return 0; }

# A directory under .claude/skills or .agents/skills belongs to checks 3/4, not 1, 5 or 7:
# vendored skill bundles ship their own AGENTS.md / CLAUDE.md, which hide nothing outside the bundle.
in_skill_tree() { case "$1" in .claude/skills/*|.agents/skills/*|*/.claude/skills/*|*/.agents/skills/*) return 0;; esac; return 1; }

echo "check-harness v$VERSION — root: $ROOT$( [ $REPORT_ONLY -eq 1 ] && printf ' (report-only)')"
echo

# ---------------------------------------------------------------------------------------------
begin_check 1 "AGENTS.md is the only instruction file: no committed CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md; every AGENTS.md a real file" \
  "Claude Code (v2.1.281+) reads AGENTS.md only while no CLAUDE.md, .claude/CLAUDE.md or CLAUDE.local.md sits in that directory or above it, so one stray CLAUDE.md silently hides every AGENTS.md at and below it; Codex reads only AGENTS.md. A symlinked AGENTS.md is the retired CLAUDE.md layout."
is_vendored() { # <relative path>: 0 when it matches an --allow-vendored glob
  local g
  [ -n "$ALLOW_VENDORED" ] || return 1
  while IFS= read -r g; do
    [ -n "$g" ] || continue
    # shellcheck disable=SC2254
    case "$1" in $g) return 0;; esac
  done <<EOF
$ALLOW_VENDORED
EOF
  return 1
}
in_dir() { if [ "$1" = . ]; then printf '%s' "$2"; else printf '%s/%s' "$1" "$2"; fi; }
vendored_listed=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  in_skill_tree "$f" && continue
  if is_vendored "$f"; then vendored_listed="$vendored_listed $f"; continue; fi
  d=$(dirname "$f")
  case "$f" in
    .claude/CLAUDE.md|*/.claude/CLAUDE.md) owner=$(dirname "$d"); hint="move its text into $(in_dir "$owner" AGENTS.md), then git rm $f" ;;
    *CLAUDE.local.md) owner=$d; hint="git rm --cached $f; a personal file does not belong in the repo, and even untracked it hides AGENTS.md in that checkout" ;;
    *) owner=$d; a=$(in_dir "$d" AGENTS.md)
       if [ -L "$a" ]; then hint="the retired layout: git rm -q --cached $a && rm $a && git mv $f $a"
       elif [ -e "$a" ]; then hint="fold its text into $a, then git rm $f"
       else hint="git mv $f $a"; fi ;;
  esac
  where=$owner; [ "$where" = . ] && where="the repository root"
  fail "$f: committed; Claude Code ignores every AGENTS.md at or below $where while it exists ($hint)"
done <<EOF
$( { find_files CLAUDE.md; find_files CLAUDE.local.md; } | sort)
EOF
[ -n "$vendored_listed" ] && printf '    note: CLAUDE files allowed by --allow-vendored:%s\n' "$vendored_listed"
while IFS= read -r f; do
  [ -n "$f" ] || continue
  in_skill_tree "$f" && continue
  if [ -L "$f" ]; then
    fail "$f: is a symlink (-> $(readlink "$f")); AGENTS.md must be the real file holding the text"
  elif [ ! -f "$f" ]; then
    fail "$f: is not a regular file"
  fi
done <<EOF
$(find_files AGENTS.md)
EOF
# Not committed, so advisory: each still hides the root AGENTS.md from Claude Code in this checkout.
for f in CLAUDE.md .claude/CLAUDE.md CLAUDE.local.md; do
  if { [ -f "$f" ] || [ -L "$f" ]; } && git_ignored "$f"; then
    warn "$f: present locally (git-ignored); Claude Code ignores this repo's AGENTS.md in this checkout while it exists"
  fi
done
p=$(dirname "$ROOT")
while :; do
  for n in CLAUDE.md .claude/CLAUDE.md CLAUDE.local.md; do
    # ~/.claude/CLAUDE.md is the user-level file; it does not hide AGENTS.md.
    [ "$p/$n" = "${HOME:-/nonexistent}/.claude/CLAUDE.md" ] && continue
    [ -f "$p/$n" ] && warn "$p/$n: above the repository root; Claude Code ignores this repo's AGENTS.md in sessions started under it"
  done
  [ "$p" = "/" ] && break
  p=$(dirname "$p")
done
end_check

# ---------------------------------------------------------------------------------------------
begin_check 2 "root AGENTS.md ≤ $ROOT_LIMIT_LINES lines, ≤ $ROOT_LIMIT_BYTES bytes, no @path import lines" \
  "The root file loads in every session of both tools; Claude Code's guidance targets <200 lines, Codex truncates silently past its byte cap, and Codex shows a Claude @path import as plain text."
if [ -L AGENTS.md ]; then
  : # check 1 reports the symlink; there is no real root file to measure
elif [ ! -f AGENTS.md ]; then
  fail "AGENTS.md: missing at the root (every WaterX repo carries one; Claude Code and Codex both read it)"
else
  lines=$(file_lines AGENTS.md); bytes=$(file_bytes AGENTS.md)
  [ "$lines" -gt "$ROOT_LIMIT_LINES" ] && fail "AGENTS.md: $lines lines (limit $ROOT_LIMIT_LINES); move area-specific text to <area>/AGENTS.md, .claude/rules/, or a skill"
  [ "$bytes" -gt "$ROOT_LIMIT_BYTES" ] && fail "AGENTS.md: $bytes bytes (limit $ROOT_LIMIT_BYTES)"
  # An import is a line whose first token is @<path>, outside fenced code blocks.
  imports=$(awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    !fence && $0 ~ /^[[:space:]]*@[A-Za-z0-9_~.\/-]/ { printf "%d:%s\n", NR, $0 }
  ' AGENTS.md)
  if [ -n "$imports" ]; then
    while IFS= read -r line; do
      fail "AGENTS.md:$line — @path import line; inline the text or link the file in prose"
    done <<EOF
$imports
EOF
  fi
fi
end_check

# ---------------------------------------------------------------------------------------------
begin_check 3 ".claude/skills and .agents/skills mirror each other by symlink" \
  "Claude Code discovers only .claude/skills/<name>/SKILL.md; Codex scans .agents/skills. Codex follows symlinked skill directories but skips a symlinked SKILL.md file and a symlinked .agents/skills directory."
if [ -L .agents/skills ]; then
  fail ".agents/skills: is itself a symlink; Codex does not discover a symlinked skills directory (make it a real directory of per-skill symlinks)"
fi
if [ -L .claude/skills ]; then
  fail ".claude/skills: is itself a symlink; make it a real directory"
fi
names=$( { [ -d .claude/skills ] && ls -1 .claude/skills; [ -d .agents/skills ] && ls -1 .agents/skills; } 2>/dev/null | sort -u )
for n in $names; do
  c=".claude/skills/$n"; a=".agents/skills/$n"
  # Regular files in either tree (README, lock files) are not skills.
  if [ ! -d "$c" ] && [ ! -L "$c" ] && [ ! -d "$a" ] && [ ! -L "$a" ]; then continue; fi
  if [ -L "$c" ] && [ ! -e "$c" ]; then fail "$c: dangling symlink ($(readlink "$c"))"; continue; fi
  if [ -L "$a" ] && [ ! -e "$a" ]; then fail "$a: dangling symlink ($(readlink "$a"))"; continue; fi
  if [ -L "$c" ] && [ -L "$a" ]; then fail "$n: both sides are symlinks; one must be the real directory"; continue; fi
  if [ ! -e "$c" ] && [ ! -L "$c" ]; then fail "$a: no .claude/skills/$n beside it, so Claude Code never loads this skill (ln -s ../../.agents/skills/$n $c for a vendored bundle)"; continue; fi
  if [ ! -e "$a" ] && [ ! -L "$a" ]; then fail "$c: no .agents/skills/$n, so Codex never loads this skill (ln -s ../../.claude/skills/$n $a)"; continue; fi
  if [ ! -L "$c" ] && [ ! -L "$a" ]; then fail "$n: two real copies (.claude/skills and .agents/skills); keep one and symlink the other, or the two drift apart"; continue; fi
  if [ -L "$c" ]; then link=$c; real=$a; else link=$a; real=$c; fi
  if [ ! -d "$real" ]; then fail "$real: expected a real directory"; continue; fi
  lp=$(phys "$link"); rp=$(phys "$real")
  if [ "$lp" != "$rp" ]; then fail "$link: points to $(readlink "$link"), not to $real"; continue; fi
  if [ ! -f "$real/SKILL.md" ]; then fail "$real/SKILL.md: missing"; continue; fi
  if [ -L "$real/SKILL.md" ]; then fail "$real/SKILL.md: is a file symlink; Codex skips symlinked SKILL.md files (symlink the directory instead)"; fi
done
end_check

# ---------------------------------------------------------------------------------------------
begin_check 4 "every .claude/skills/*/SKILL.md has a frontmatter description ≤ $DESCRIPTION_LIMIT_CHARS chars" \
  "Claude Code loads every skill's description into every session and caps it at 1,536 characters; the body loads only on trigger, so the description is what decides whether the skill fires."
if [ -d .claude/skills ]; then
  for s in .claude/skills/*/; do
    [ -d "$s" ] || continue
    sk="${s}SKILL.md"
    [ -f "$sk" ] || { fail "$sk: missing"; continue; }
    fm=$(awk '{ sub(/\r$/, "") } NR==1 && $0 != "---" { exit } NR>1 && $0 == "---" { exit } NR>1 { print }' "$sk")
    if [ -z "$fm" ]; then fail "$sk: no YAML frontmatter (needs name + description)"; continue; fi
    desc=$(printf '%s\n' "$fm" | awk '
      /^description:/ { on = 1; sub(/^description:[[:space:]]*/, ""); sub(/^[>|][-+]?[[:space:]]*$/, ""); if ($0 != "") print; next }
      on && /^[[:space:]]/ { sub(/^[[:space:]]+/, ""); print; next }
      on { exit }
    ')
    if [ -z "$(printf '%s' "$desc" | tr -d '[:space:]')" ]; then fail "$sk: frontmatter has no description"; continue; fi
    n=$(printf '%s' "$desc" | char_count)
    [ "$n" -gt "$DESCRIPTION_LIMIT_CHARS" ] && fail "$sk: description is $n chars (limit $DESCRIPTION_LIMIT_CHARS)"
  done
fi
end_check

# ---------------------------------------------------------------------------------------------
begin_check 5 ".codex/config.toml raises project_doc_max_bytes to ≥ $CODEX_REQUIRED_CAP" \
  "Codex concatenates AGENTS.md from the root down to the cwd and stops at project_doc_max_bytes (32 KiB by default), truncating the file that crosses it without any visible warning."
# Largest single file and largest root→dir chain.
max_single=0; max_chain=0; max_chain_dir=.
while IFS= read -r f; do
  [ -n "$f" ] || continue
  in_skill_tree "$f" && continue
  b=$(file_bytes "$f"); [ "$b" -gt "$max_single" ] && max_single=$b
  d=$(dirname "$f"); chain=0; p=$d
  while :; do
    [ -f "$p/AGENTS.md" ] && [ ! -L "$p/AGENTS.md" ] && chain=$((chain + $(file_bytes "$p/AGENTS.md")))
    [ "$p" = "." ] && break
    p=$(dirname "$p")
  done
  if [ "$chain" -gt "$max_chain" ]; then max_chain=$chain; max_chain_dir=$d; fi
done <<EOF
$(find_files AGENTS.md)
EOF
cap=""
if [ -f .codex/config.toml ]; then
  cap=$(sed -n 's/^[[:space:]]*project_doc_max_bytes[[:space:]]*=[[:space:]]*\([0-9_]*\).*/\1/p' .codex/config.toml | tr -d _ | head -1)
fi
needs_cap=0
[ "$max_single" -gt "$CODEX_WARN_BYTES" ] && needs_cap=1
[ "$max_chain" -gt "$CODEX_WARN_BYTES" ] && needs_cap=1
ignored_note=""
if git_ignored .codex/config.toml; then ignored_note=" (.codex/ is git-ignored here; add '!.codex/' or remove the ignore line so the file can be committed)"; fi
if [ ! -f .codex/config.toml ]; then
  if [ $needs_cap -eq 1 ]; then
    if [ -n "$ignored_note" ]; then warn ".codex/config.toml: missing while an AGENTS.md chain reaches $max_chain bytes (dir: $max_chain_dir) — Codex would truncate at $CODEX_DEFAULT_CAP$ignored_note"
    else fail ".codex/config.toml: missing while an AGENTS.md chain reaches $max_chain bytes (dir: $max_chain_dir) — Codex would truncate at $CODEX_DEFAULT_CAP; commit the file with project_doc_max_bytes = $CODEX_REQUIRED_CAP"; fi
  else
    warn ".codex/config.toml: missing; the standard commits it in every repo (largest chain today: $max_chain bytes, under the $CODEX_DEFAULT_CAP default)$ignored_note"
  fi
elif [ -z "$cap" ]; then
  fail ".codex/config.toml: no project_doc_max_bytes line (set it to $CODEX_REQUIRED_CAP)"
elif [ "$cap" -lt "$CODEX_REQUIRED_CAP" ]; then
  if [ $needs_cap -eq 1 ] || [ "$cap" -lt "$max_chain" ]; then
    fail ".codex/config.toml: project_doc_max_bytes = $cap, below $CODEX_REQUIRED_CAP while an AGENTS.md chain reaches $max_chain bytes"
  else
    warn ".codex/config.toml: project_doc_max_bytes = $cap; the standard sets $CODEX_REQUIRED_CAP"
  fi
fi
end_check

# ---------------------------------------------------------------------------------------------
# JSON and Starlark readers shared by checks 6 and 9. Plain awk, so the result does not depend on
# whether jq is installed.
JSON_LEAVES_AWK='
function ws() { while (i <= n && index(" \t\r\n", substr(s, i, 1))) i++ }
function pstring(    c, out) {
  i++; out = ""
  while (i <= n) {
    c = substr(s, i, 1)
    if (c == "\"") { i++; STR = out; return 1 }
    if (c == "\\") {
      c = substr(s, i + 1, 1); i += 2
      if (c == "n") out = out "\\n"; else if (c == "t") out = out "\\t"; else if (c == "r") out = out "\\r"
      else if (c == "u") { out = out "?"; i += 4 } else if (c == "b" || c == "f") out = out " "
      else out = out c
      continue
    }
    out = out c; i++
  }
  return 0
}
function pvalue(path,    c, key, idx, tok) {
  ws(); c = substr(s, i, 1)
  if (c == "{") {
    i++; ws(); if (substr(s, i, 1) == "}") { i++; return 1 }
    while (1) {
      ws(); if (substr(s, i, 1) != "\"" || !pstring()) return 0
      key = STR; ws(); if (substr(s, i, 1) != ":") return 0
      i++; if (!pvalue(path == "" ? key : path "." key)) return 0
      ws(); c = substr(s, i, 1); i++
      if (c == ",") continue
      return c == "}"
    }
  }
  if (c == "[") {
    i++; ws(); idx = 0; if (substr(s, i, 1) == "]") { i++; return 1 }
    while (1) {
      if (!pvalue(path "." idx)) return 0
      idx++; ws(); c = substr(s, i, 1); i++
      if (c == ",") continue
      return c == "]"
    }
  }
  if (c == "\"") { if (!pstring()) return 0; OUT = OUT path "\t" STR "\n"; return 1 }
  tok = ""
  while (i <= n && index("-+.0123456789eEtruefalsn", substr(s, i, 1))) { tok = tok substr(s, i, 1); i++ }
  if (tok == "") return 0
  OUT = OUT path "\t" tok "\n"; return 1
}
BEGIN {
  s = ""; cnt = 0
  while ((getline line) > 0) s = (cnt++ ? s "\n" : "") line
  n = length(s); i = 1
  if (!pvalue("")) exit 2
  ws(); if (i <= n) exit 2
  printf "%s", OUT
}'
json_leaves() { # <file>: "<dotted.path>\t<value>" per scalar leaf; exit 2 on invalid JSON
  LC_ALL=C awk "$JSON_LEAVES_AWK" < "$1"
}

# Every prefix_rule(..., decision = "prompt") pattern in the .rules files on stdin, one per line,
# words space-joined; a list of alternatives inside a pattern expands to one line per choice.
PROMPT_RULES_AWK='
function addtok(t, v) { NT++; TT[NT] = t; TV[NT] = v }
function expand(e, prefix,    k, m, parts) {
  if (e > NE) { print substr(prefix, 2); return }
  m = split(EL[e], parts, "\034")
  for (k = 1; k <= m; k++) expand(e + 1, prefix " " parts[k])
}
BEGIN {
  s = ""; while ((getline line) > 0) s = s line "\n"
  n = length(s); i = 1; NT = 0
  while (i <= n) {
    c = substr(s, i, 1)
    if (index(" \t\r\n", c)) { i++; continue }
    if (c == "#") { while (i <= n && substr(s, i, 1) != "\n") i++; continue }
    if (c == "\"" || c == "\047") {
      q = c; v = ""; i++
      while (i <= n && substr(s, i, 1) != q) { if (substr(s, i, 1) == "\\") { i++ } v = v substr(s, i, 1); i++ }
      i++; addtok("S", v); continue
    }
    if (c ~ /[A-Za-z_]/) { v = ""; while (i <= n && substr(s, i, 1) ~ /[A-Za-z0-9_]/) { v = v substr(s, i, 1); i++ } addtok("I", v); continue }
    addtok("P", c); i++
  }
  for (t = 1; t <= NT; t++) {
    if (!(TT[t] == "I" && TV[t] == "prefix_rule" && TV[t + 1] == "(")) continue
    t += 2; d = 1; key = ""; decision = "allow"; NE = 0; inpat = 0; depth = 0
    for (; t <= NT && d > 0; t++) {
      if (TT[t] == "P" && (TV[t] == "(" || TV[t] == "[" || TV[t] == "{")) { d++; if (inpat && TV[t] == "[") { depth++; if (depth == 2) { NE++; EL[NE] = ""; alt = 1 } } continue }
      if (TT[t] == "P" && (TV[t] == ")" || TV[t] == "]" || TV[t] == "}")) { d--; if (inpat && TV[t] == "]") { depth--; if (depth == 0) inpat = 0 } continue }
      if (d == 1 && TT[t] == "I" && TV[t + 1] == "=") { key = TV[t]; t++; if (key == "pattern") inpat = 1; continue }
      if (d == 1 && TT[t] == "S" && key == "decision") { decision = TV[t]; continue }
      if (inpat && TT[t] == "S") {
        if (depth == 1) { NE++; EL[NE] = TV[t] }
        else if (depth == 2) { EL[NE] = EL[NE] (EL[NE] == "" ? "" : "\034") TV[t] }
      }
    }
    t--
    if (decision == "prompt" && NE > 0) expand(1, "")
  }
}'

# A Claude permissions.ask entry as the command prefix it asks for: "Bash(gh workflow run:*)" and
# "Bash(gh workflow run *)" both become "gh workflow run"; a wildcard inside the last word stays
# ("Bash(npx tsx scripts/*)" -> "npx tsx scripts/*") and matches Codex patterns by that stem;
# other tools print nothing.
claude_ask_prefixes() { # <settings.json>
  json_leaves "$1" 2>/dev/null | awk -F'\t' '$1 ~ /^permissions\.ask\.[0-9]+$/ { print $2 }' |
    sed -n 's/^Bash(\(.*\))$/\1/p' | sed 's/:\*$//; s/[[:space:]]\*$//; s/[[:space:]][[:space:]]*/ /g; s/^ //; s/ $//' | grep -v '^$' | sort -u
}
codex_prompt_prefixes() { # <rules files...>
  cat "$@" 2>/dev/null | LC_ALL=C awk "$PROMPT_RULES_AWK" | sed 's/[[:space:]][[:space:]]*/ /g' | sort -u
}
hook_commands() { # <json file>: one hook command per line ("<command> <args...>" for exec form)
  json_leaves "$1" 2>/dev/null | awk -F'\t' '
    $1 ~ /^hooks\.[^.]+\.[0-9]+\.hooks\.[0-9]+\.command$/ { k = $1; sub(/\.command$/, "", k); order[++n] = k; cmd[k] = $2 }
    $1 ~ /^hooks\.[^.]+\.[0-9]+\.hooks\.[0-9]+\.args\.[0-9]+$/ { k = $1; sub(/\.args\.[0-9]+$/, "", k); args[k] = args[k] " " $2; exec[k] = 1 }
    END { for (j = 1; j <= n; j++) print (exec[order[j]] ? "EXEC" : "SHELL") "\t" cmd[order[j]] args[order[j]] }'
}

begin_check 6 "Claude hooks and ask-permissions have Codex twins (same scripts; the same set of prompted command prefixes)" \
  "A Claude Code hook never runs under Codex. Codex reads .codex/hooks.json with the same schema, so the same scripts should be wired there; the Bash prefixes in permissions.ask and the prefix_rule(..., decision=\"prompt\") patterns in .codex/rules must be the same set, or a command needs a human in one tool and runs silently in the other."
hook_scripts() { # <json file>: basenames of the scripts hook commands run
  # The script is the first word that is a path (`bash scripts/x.sh` -> x.sh), else the first word.
  hook_commands "$1" | cut -f2- | sed 's/\\"//g; s/"//g' |
    awk '{ w = $1; for (i = 1; i <= NF; i++) if ($i ~ /\//) { w = $i; break }; n = split(w, p, "/"); if (p[n] != "") print p[n] }' | sort -u
}
for jf in .claude/settings.json .codex/hooks.json; do
  if [ -f "$jf" ] && ! json_leaves "$jf" >/dev/null 2>&1; then fail "$jf: not valid JSON"; fi
done
if [ -f .claude/settings.json ]; then
  claude_hooks=$(hook_scripts .claude/settings.json)
  if [ -n "$claude_hooks" ]; then
    ignored_note=""
    git_ignored .codex/hooks.json && ignored_note=" (.codex/ is git-ignored here; the team has to un-ignore it before the twin can be committed)"
    if [ ! -f .codex/hooks.json ]; then
      msg=".codex/hooks.json: missing while .claude/settings.json wires hooks ($(printf '%s' "$claude_hooks" | tr '\n' ' '))$ignored_note"
      if [ -n "$ignored_note" ]; then warn "$msg"; else fail "$msg"; fi
    else
      codex_hooks=$(hook_scripts .codex/hooks.json)
      for h in $claude_hooks; do
        printf '%s\n' "$codex_hooks" | grep -qx "$h" || fail ".codex/hooks.json: does not reference $h, which .claude/settings.json runs"
      done
      for h in $codex_hooks; do
        printf '%s\n' "$claude_hooks" | grep -qx "$h" || warn ".claude/settings.json: does not reference $h, which .codex/hooks.json runs"
      done
    fi
  fi
fi
asks=""; [ -f .claude/settings.json ] && asks=$(claude_ask_prefixes .claude/settings.json)
rules=$(ls .codex/rules/*.rules 2>/dev/null)
prompts=""; [ -n "$rules" ] && prompts=$(codex_prompt_prefixes $rules)
if [ -n "$asks" ] || [ -n "$prompts" ]; then
  rules_ignored=0; git_ignored .codex/rules/x.rules && rules_ignored=1
  # side<TAB>prefix for each prefix missing on the other side; "word*" on the Claude side matches by stem.
  diff_sets=$(
    { printf '%s\n' "$asks" | awk 'NF { print "A\t" $0 }'; printf '%s\n' "$prompts" | awk 'NF { print "C\t" $0 }'; } |
      awk -F'\t' '
        $1 == "A" { na++; a[na] = $2 } $1 == "C" { nc++; c[nc] = $2 }
        function covers(x, y,    stem) { if (x == y) return 1; if (x ~ /\*$/) { stem = substr(x, 1, length(x) - 1); return substr(y, 1, length(stem)) == stem } return 0 }
        END {
          for (i = 1; i <= na; i++) { f = 0; for (j = 1; j <= nc; j++) if (covers(a[i], c[j])) f = 1; if (!f) print "A\t" a[i] }
          for (j = 1; j <= nc; j++) { f = 0; for (i = 1; i <= na; i++) if (covers(a[i], c[j])) f = 1; if (!f) print "C\t" c[j] }
        }')
  only_claude=$(printf '%s\n' "$diff_sets" | awk -F'\t' '$1 == "A" { print $2 }')
  only_codex=$(printf '%s\n' "$diff_sets" | awk -F'\t' '$1 == "C" { print $2 }')
  while IFS= read -r p; do
    [ -n "$p" ] || continue
    msg=".codex/rules: no prefix_rule(pattern = [$(printf '%s' "$p" | awk '{ for (i = 1; i <= NF; i++) printf "%s\"%s\"", (i > 1 ? ", " : ""), $i }')], decision = \"prompt\") for permissions.ask \"Bash($p:*)\""
    if [ $rules_ignored -eq 1 ]; then warn "$msg (.codex/ is git-ignored here)"; else fail "$msg"; fi
  done <<EOF
$only_claude
EOF
  while IFS= read -r p; do
    [ -n "$p" ] || continue
    fail ".claude/settings.json: no permissions.ask \"Bash($p:*)\" for the Codex prompt rule [$p]"
  done <<EOF
$only_codex
EOF
fi
end_check

# ---------------------------------------------------------------------------------------------
begin_check 7 "relative paths (with a slash) in backticks inside AGENTS.md files exist (report-only)" \
  "A path the file names and the tree no longer has sends an agent looking for a file that is not there; this is a heuristic, so it never blocks."
while IFS= read -r f; do
  [ -n "$f" ] || continue
  in_skill_tree "$f" && continue
  d=$(dirname "$f")
  # Inline code spans outside fenced blocks; keep spans that look like a single relative path.
  spans=$(awk '
    /^[[:space:]]*(```|~~~)/ { fence = !fence; next }
    fence { next }
    { line = $0
      while (match(line, /`[^`]+`/)) {
        s = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
        if (s ~ /^[A-Za-z0-9_.][A-Za-z0-9_.\/-]*(\/|\.[A-Za-z0-9]+)$/ && s ~ /[\/.]/ && s !~ /^\.\.?$/ && s !~ /^(http|www\.)/) print NR "\t" s
      }
    }' "$f")
  [ -n "$spans" ] || continue
  while IFS="$(printf '\t')" read -r ln s; do
    [ -n "$s" ] || continue
    case "$s" in *'*'*|*'<'*|*'>'*|*'{'*|*'$'*) continue;; esac
    # Skip things that are not paths even though they look like one: versions, domains.
    case "$s" in *.app|*.com|*.io|*.dev|*.org|*.net) continue;; esac
    printf '%s' "$s" | grep -Eq '^[0-9]+(\.[0-9]+)+' && continue
    # A bare name (`index.ts`, `knex.raw`) is as often a convention or an identifier as a file.
    case "$s" in */*) ;; *) continue ;; esac
    # Paths into build trees (node_modules/..., .next/) and submodules are outside this tree.
    first=${s%%/*}; skip=0; for pd in $PRUNE_DIRS; do [ "$first" = "$pd" ] && skip=1; done; [ $skip -eq 1 ] && continue
    is_submodule_path "${s%/}" && continue
    [ -e "$d/$s" ] && continue
    [ -e "$s" ] && continue
    # A path that exists nowhere under the root is the finding; one that exists elsewhere is a
    # relative-path imprecision the heuristic cannot judge, so it passes.
    base=$(basename "$s")
    if ! printf '%s\n' "$ALL_FILES" | awk -F/ -v n="$base" '{ for (i = 1; i <= NF; i++) if ($i == n) { f = 1; exit } } END { exit !f }'; then
      warn "$f:$ln: \`$s\` does not exist (relative to $d, the root, or anywhere in the tree)"
    fi
  done <<EOF
$spans
EOF
done <<EOF
$(find_files AGENTS.md)
EOF
end_check

# ---------------------------------------------------------------------------------------------
begin_check 8 "$HUB/README.md exists" \
  "The memory surface every root points agents at: one lesson per file in $HUB/ (schema in waterx-commons/knowledge-hub/SCHEMA.md), with a README that states the format."
if [ ! -f "$HUB/README.md" ]; then
  if [ -f docs/agent-notes/README.md ]; then
    fail "$HUB/README.md: missing; docs/agent-notes/ exists instead — rename it to $HUB/ and point the root AGENTS.md there (the standard names one directory so every repo's lessons can be read as one set)"
  else
    fail "$HUB/README.md: missing (copy harness/templates/docs/knowledge-hub/README.md from waterx-commons, or pass --hub <dir> when the hub lives elsewhere)"
  fi
fi
end_check

# ---------------------------------------------------------------------------------------------
begin_check 9 "hook commands resolve their scripts from the repository root" \
  "Both tools run a hook in the session's working directory, which is a subdirectory whenever the session starts in one, so a relative script path exits 127 and the hook silently does nothing. Claude Code documents \${CLAUDE_PROJECT_DIR} (\"the project root where the session started\"; double-quoted in shell form, https://code.claude.com/docs/en/hooks); Codex documents \"\$(git rev-parse --show-toplevel)\" for repo-local hooks (https://learn.chatgpt.com/docs/hooks)."
# relative_words <command>: words that name a repository-relative path (contain a slash, do not
# start with /, ~, $ or a quote, and are not an option or URL).
relative_words() {
  printf '%s\n' "$1" | sed 's/\$([^)]*)/ROOT/g' | tr ' ' '\n' | sed "s/^[\"']//; s/[\"']\$//" |
    awk '/\// && $0 !~ /^(\/|~|\$|ROOT|-|[a-z]+:\/\/)/ { print }'
}
check_hook_roots() { # <file> <tool>
  local f=$1 tool=$2 kind cmd rel
  [ -f "$f" ] || return 0
  while IFS="$(printf '\t')" read -r kind cmd; do
    [ -n "$cmd" ] || continue
    rel=$(relative_words "$cmd" | head -1)
    if [ "$tool" = claude ]; then
      if [ -n "$rel" ]; then
        fail "$f: hook command \"$cmd\" runs $rel relative to the session cwd; write \"\$CLAUDE_PROJECT_DIR/$rel\" (or \${CLAUDE_PROJECT_DIR} in exec form)"
      elif printf '%s' "$cmd" | grep -q 'git rev-parse --show-toplevel'; then
        fail "$f: hook command \"$cmd\" resolves the root with git; Claude Code documents \$CLAUDE_PROJECT_DIR, which also works outside a git checkout"
      elif [ "$kind" = SHELL ] && printf '%s' "$cmd" | grep -q 'CLAUDE_PROJECT_DIR' && ! printf '%s' "$cmd" | grep -q '"\${\{0,1\}CLAUDE_PROJECT_DIR'; then
        fail "$f: hook command \"$cmd\" leaves \$CLAUDE_PROJECT_DIR unquoted; a project path with a space splits it (wrap it in double quotes)"
      fi
    else
      if [ -n "$rel" ]; then
        fail "$f: hook command \"$cmd\" runs $rel relative to the session cwd; write \"\$(git rev-parse --show-toplevel)/$rel\""
      elif printf '%s' "$cmd" | grep -q 'CLAUDE_PROJECT_DIR'; then
        fail "$f: hook command \"$cmd\" uses \$CLAUDE_PROJECT_DIR, which Codex does not set; write \"\$(git rev-parse --show-toplevel)/...\""
      fi
    fi
  done <<EOF
$(hook_commands "$f")
EOF
}
check_hook_roots .claude/settings.json claude
check_hook_roots .codex/hooks.json codex
end_check

# ---------------------------------------------------------------------------------------------
begin_check 10 "a vendored scripts/agent-hooks/lib/shell-segments.sh is a released version, unedited (advisory)" \
  "Hooks in every repo classify commands through the same segmenter (STANDARD.md rule 12); a copy that says one version and holds other code makes two repos with the same version line behave differently."
seg=scripts/agent-hooks/lib/shell-segments.sh
sha256_of() {
  if command -v shasum >/dev/null 2>&1; then shasum -a 256 "$1" | awk '{ print $1 }'
  elif command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{ print $1 }'
  elif command -v openssl >/dev/null 2>&1; then openssl dgst -sha256 "$1" | awk '{ print $NF }'
  fi
}
if [ -f "$seg" ]; then
  seg_v=$(sed -n '2p' "$seg" | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+$' | sed 's/^v//')
  seg_sha=$(sha256_of "$seg")
  released=$(printf '%s\n' "$KNOWN_SEGMENTERS" | awk 'NF == 2 { printf "%sv%s", (n++ ? ", " : ""), $1 }')
  want=$(printf '%s\n' "$KNOWN_SEGMENTERS" | awk -v v="$seg_v" 'NF == 2 && $1 == v { print $2 }')
  if [ -z "$seg_v" ]; then
    warn "$seg: no version line on line 2; re-vendor a released copy ($released)"
  elif [ -z "$want" ]; then
    warn "$seg: v$seg_v is not a released version (this lint knows $released); re-vendor it from waterx-commons"
  elif [ -z "$seg_sha" ]; then
    printf '    note: no sha256 tool found; %s content not compared\n' "$seg"
  elif [ "$seg_sha" != "$want" ]; then
    warn "$seg: says v$seg_v but its content differs from the released v$seg_v (sha256 $seg_sha); re-vendor it unchanged"
  fi
fi
end_check

echo
echo "summary: $BLOCKING blocking, $ADVISORY advisory"
if [ $BLOCKING -gt 0 ]; then exit 1; fi
exit 0
