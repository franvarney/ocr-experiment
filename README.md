# ocr-experiment

#### Steps?

These probably need review...

##### Part 1
1. Get product list (narrow down to names only)
2. Format names (remove punctuation, lowercase, etc)
3. Put into dictionary
4. Add formatted product names to DAWG (Could add all permutations? Or weigh the words?)

##### Part 2
1. Submit a product photo and send to OCR API
2. Parse results for words (Might be beneficial to keep in order?)
3. Filter words based on dictionary. Keep track of words that don't exist in dictionary.
4. Use correct method on dictionary and try to spell check the filtered words?
5. For remaining words, search DAWG for a product (this is the hard part)
