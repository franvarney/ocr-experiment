const Assert = require('assert');

const Node = require('./node');

const internals = {
  nodeOptions: {}
};

function validateIsString(string) {
  Assert.equal(string && typeof string === 'string', true, 'Input should be a string');
}

function validateOptions([options]) {
  if (options && options.separator) {
    const {separator} = options;
    Assert.equal(typeof separator == 'string' && !Number(separator), true, '`separator` should be a string with length of 1 or more');
  }
}

/**
  * DAWG (Direct Acyclic Word Graph)
  * Builds a trie and then checks for duplicates and minimizes
  * @constructor
  */

class Dawg {
  constructor(options={}) {
    // validate options
    validateOptions.call(this, arguments);
    // set node options
    options.separator = options.separator || '_';
    Object.assign(internals.nodeOptions, { separator: options.separator });
    // set graph data
    this.id = 0;
    this.root = new Node(this.id, this.nodeOptions); // init
    this.unchecked = new Array(); // unchecked for duplicate nodes [parent, value, child]
    this.minimized = new Map(); // checked for duplicate nodes
    this.counter = new Map(); // a count for all distinct words
    // this.data = []; // data for all nodes
  }

  // TODO
  get edges() {
    let count = 0;
    for (let key in this.minimized) {
      count += this.minimized[key].edgeCount;
    }
    return count;
  }

  // TODO
  get nodes() {
    return Object.keys(this.minimized).length;
  }

  /**
  * Update the counter
  * @param {String} value - increment the count for a value
  */
  _updateCounter(value) {
    if (this.counter.has(value)) {
      this.counter.set(value, this.counter.get(value) + 1);
    } else this.counter.set(value, 1);
  }

  /**
  * Update the hash value if already minimized
  * @param {String} oldHash - the hash before edges are added
  * @param {Node} node - the updated node
  */
  _updateHash(oldHash, node) {
    if (this.minimized.has(oldHash)) {
      this.minimized.delete(oldHash);
      this.minimized.set({node});
    }
  }

  /**
  * Add a phrase to the graph
  * @param {String} phrase - a phrase or string of words
  * @todo
  * @param {Any} data - data associated with the value
  */
  add(phrase) {
    validateIsString(phrase);

    let words = phrase.split(' ');
    let node = this.root;

    // add phrase
    while (words.length) {
      let word = words.shift();
      let edge = node.edges[word];

      if (!edge) {
        let hash = node.toString();
        let next = new Node(++this.id, internals.nodeOptions);

        this.unchecked.push([node, word, next]);
        node.add(word, next);
        this._updateHash(hash, node);
        this._updateCounter(word);
        node = next;
      } else node = edge;
    }

    // mark end of phrase
    node.isFinal = true;

    // compress data
    while (this.unchecked.length) {
      let [parent, word, child] = this.unchecked.pop();
      if (this.minimized.has(child)) {
        parent.edges[word] = this.minimized.get(child);
      } else {
        this.minimized.set(child, child);
      }
    }
  }

  /**
  * List all phrases
  * @returns {Array} array of phrases
  */
  values() {
    // TODO validate root?
    const results = [];

    function traverse(node, phrases, phrase) {
      for (let word in node.edges) {
        if (word in node.edges) {
          let edge = node.edges[word];
          phrase.push(word);
          if (edge.isFinal) {
            phrases.push(phrase.join(' '));
          }
          traverse(edge, phrases, phrase);
          phrase.pop();
        }
      }
    }

    traverse(this.root, results, []);
    return results;
  }

  /**
  * Find an exact match
  * @todo could return -1/0/1 for does not exist, partial match (trailing
      values left), and exact match
  * @param {String} value - a phrase to search for
  * @returns {Boolean}
  */
  contains(value) {
    // TODO validate root?
    validateIsString(value);

    let node = this.root;
    let words = value.split(' ').reverse(); // allows .pop()

    while (words.length) {
      node = node.edges[words.pop()];
      if (!node) return false;
      if (!words.length && node.isFinal === true) {
        return true;
      }
    }

    return false;
  }

  /**
  * Find phrases that contain a word or prefix
  * @param {String} word - find phrases with this word/prefix
  * @param {Number} n - number of matches to return
  * @returns {Array} matches
  */
  matches(value) {
    // TODO validate root?
    validateIsString(value);

    return this.values().filter((result) => {
      return result.indexOf(value) >= 0;
    });
  }

  /**
  * Find closest matches
  * @param {String} value - a phrase with or without all words
  * @returns {Array} closest matches
  */
  closest(value) {
    // TODO validate root?
    validateIsString(value);

    // n-grams...weight less common words higher and build n-grams from those, then see if the input matches any
  }
}

module.exports = Dawg;
