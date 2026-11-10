---
type: llm
---
PASS only if all of these hold, FAIL otherwise:
- P1: evidence count 5, accounts 3, prospects 1, revenue 130,000.
- In P1, the two Contoso teams are one account, which brings 30,000; Fabrikam Germany and Fabrikam France, named in one message, are two accounts; "Fabrikam" named without its entity is not counted as an account and adds no revenue; Fabrikam Spain is not added; Tailspin counts only as a prospect.
- P2: evidence count 3, accounts 3 (Woodgrove, Litware, and Adatum as an unknown account), prospects 0, revenue 75,000.
- In P2, Woodgrove brings the 60,000 of its group, read from the accounts query, not the 0 of the insight platform's record; the answer says the revenue is a floor (or incomplete) because Adatum could not be matched.
- P: evidence count 8, accounts 6, prospects 1, revenue 205,000, although P has no evidence of its own.
- P1 ranks before P2: their scores are equal (3 each) and revenue breaks the tie. Revenue is not added to a score.
