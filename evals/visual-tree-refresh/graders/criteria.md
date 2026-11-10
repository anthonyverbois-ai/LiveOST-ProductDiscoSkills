---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- A, B, C and D go into the data file; E, archived, does not.
- A and B are in the tree, B under A. C appears under "Too early to rank". D appears under "Waiting for a decision", with a link to decide in Notion and no decision taken on the page.
- The pieces copied are 1, 2 and 4: the three most recent attached pieces. Piece 3 is left out because it is a duplicate, piece 6 because it is out of scope, piece 5 because of the limit of 3.
- The card of A shows 6 pieces of evidence and 4 accounts: the counts stored in Notion, not a count of the pieces copied.
- The page is published again to the address already in `view.url` (https://pages.example/squad-a-tree), never to a new address. The page file is not edited: the data file is published next to it.
- The focus is shown at the top of the tree, and is not treated as an outcome.
- If the session cannot publish pages: nothing is written, the answer says the visual tree was not refreshed and names the command to run, and no refresh is reported.
