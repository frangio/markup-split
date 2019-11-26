# markup-split

**Split a file into many parts.**

## Usage

```
markup-split [--force|-f] [--no-adjust|-A] [FILE...]
```

The supported file formats are AsciiDoc (`*.adoc`) and Markdown (`*.md`).

The input files will be scanned for `markup-split` directives (see Syntax below), and the contents that follow each directive will be copied to new files at the specified paths.

Use `--force` to overwrite existing files.

Use `--no-adjust` to disable decrementing heading levels.

## Syntax

The directives are written in comments, and have the form `markup-split: [PATH]`.

### Markdown

```markdown
# Introduction

<-- markup-split: part-1.md -->

## Part 1

<-- markup-split: part-2.md -->

## Part 2
```

### AsciiDoc

```asciidoc
= Introduction

// markup-split: part-1.md

== Part 1

// markup-split: part-2.md

== Part 2
```
