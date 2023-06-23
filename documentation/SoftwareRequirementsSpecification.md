# Summary

- each day a new object is selected (globally the same for every user)
  - nouns, adjectives and adverbs
- user can practice an exercise for the given object
- user can have automatic rotation of exercises (e.g. object writing or metaphors), subtypes (e.g. expressed identity metaphor, verbal metaphor, etc.), etc.
- user can access past entries (archive)

# Entries

**Create:**

- user selects to start daily exercise

**Read (archive):**

- user selects entry by date (calendar)
- user select entry by object name (search bar)

**Update (daily exercise):**

- user can immediately edit after starting the daily exercise

**Update (archive):**

- user is on page of the entry
- user starts the edit mode first
- user can now edit
- user needs to save changes (or discard)

**Delete:**

- user clicks delete button on entry page (needs to confirm)

# Exercise Types

## General

- user can add subtitle (for translation/comment) to current object
- user can manually change exercise type per day (object writing or metaphors)
- user can manually change “rotating”/"guided" or “free” on daily exercise
- user can set a timer for the daily exercise
- maybe WYSIWYG editor

## Object Writing

### Explanation

- an object is described using your 5 senses + 2 additional ones

### Use Cases

#### Rotation enabled:

- all 7 senses automatically rotate on a daily basis
- one textarea per sense
- user simply writes in the object description for the given sense
- question mark icon behind sense name: hover explains sense (maybe with example)

#### Rotation disabled:

- one textarea for the whole daily exercise
- user writes all sense descriptions into the textarea

## Metaphors

### Explanation

- a metaphor is "making sense of two ideas that don't belong together at first sight"
- process:
  - list characteristics for the given word
  - which other words have one or more of the same characteristics?
  - example: "A sunflower sparkles" (both sunflowers and sparkles can be fascinating to look at)
- there are three types of metaphors: expressed identity, qualifying metaphor, verbal metaphor
- for two of them there are also subtypes

### Use Cases

#### "Guided" enabled:

- sections:
  - characteristics: add words that can be selected
  - chosen characteristic: add words that can be selected
  - resulting metaphor: automatically assembled of daily object and selected characteristic

#### "Guided" disabled:

- all the text that lead to a metaphor can be written into a textarea

#### "Rotation" enabled:

- all 3 types of metaphors (+ subtypes) automatically rotate
- metaphor type (e.g. expressed identity, qualifying metaphor) is shown at the top
  - question mark icon: hover explains metaphor type + example

#### "Rotation" disabled:

- user simply writes any metaphor

# Settings

- user can choose rotation of exercises
  - one day object writing, next metaphor, etc.
  - only object writing
  - only metaphor
- user can activate/deactivate the timer for exercises + set default time
- object writing:
  - rotating: enable/disable (see object writing use cases for explanation)
- metaphor:
  - rotating: enable/disable (see metaphor use cases for explanation)
  - guided: enable/disable (see metaphor use cases for explanation)
- UI theme: light/dark
- app language: en/de
