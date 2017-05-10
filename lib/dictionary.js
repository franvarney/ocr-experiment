const Assert = require('assert');
/**
* Dictionary - contains a values of unique words, maps functions to `Set`
    functions, and has a spell check method. Expects clean text
* @contructor
*/

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

class Dictionary {
  constructor(options={}) {
    if (options && options.chars) {
      Assert.equal(Array.isArray(options.chars), true, '`options.chars` must be an array');
      Assert.equal(options.chars.length > 0, true, '`options.chars` must have length greater than 0');
    }
    this.chars = options && options.chars || CHARS; // used with .correct()
    this.list = new Set();
  }

  /**
  * Get the amount of values in the dictionary
  * @returns {Number}
  */
  get length() {
    return this.list.size;
  }

  /**
  * Add a value to the dictionary
  * @param {String} value - the value to add
  * @returns {Dictionary} this
  */
  add(value) {
    this.list.add(value);
    return this;
  }

  /** Remove a value from the dictionary
  * @param {String} value - the value to Remove
  * @returns {Dictionary} this
  */
  remove(value) {
    this.list.delete(value);
    return this;
  }

  /**
  * Checks if the value exists in the dictionary
  * @param {String} value - the value to check for
  * @returns {Boolean} if the value is in the dictionary
  */
  has(value) {
    return this.list.has(value);
  }

  /**
  * Gets the full list of values
  * @returns {Array} the array of all values
  */
  values() {
    return Array.from(this.list);
  }

  /**
  * Get spelling suggestions based on added words
  * @todo may want to only return one value, which means a count of how many
      times a word is added may need to be tracked
  * @param {String} value - a value to correct
  * @param {String} delimiter - a value to split/rejoin with
  * @returns {Array} corrected values within one edit distance
  */
  correct(value, delimiter='') {
    // get parts
    const parts = [];

    value = value.split(delimiter);

    for (let i = 0; i < value.length + 1; ++i) {
      parts.push([value.slice(0, i), value.slice(i)]);
    }

    console.log(parts);

    // get edits
    const edits = [];

    parts.forEach(([l, r]) => {
      if (r) edits.push(l + delimiter + r.slice(1)); // insert
      if (r && r.length > 1) edits.push(l + r[1] + r[0] + r.slice(2)); // transposes
      this.chars.map((char) => {
        if (r) edits.push(l + char + r.slice(1)); // replaces
        edits.push(l + char + r); // inserts
      });
    });

    // console.log(edits);

    const formatted = edits.map((edit) => edit.split(',').join(delimiter));

    // filter by added values
    const results = formatted.filter((edit) => {
      return this.list.has(edit);
    });

    console.log('res', results);

    return results;
  }
}

module.exports = Dictionary;
