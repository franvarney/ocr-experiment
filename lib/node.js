const Assert = require('assert');
const EventEmitter = require('events');
const StringHash = require('string-hash');

const internals = {
  options: {},
  count: -1
};

function validate([id, options]) {
  Assert.equal(typeof id, 'number', '`id` must be a number');
}

/**
* Node class for the graph
* @constructor
* @param {Number} id - a unique identifier
* @param {Object} options
* @param {String} options.separator - the separator used in the label
*/
class Node {
  constructor(id, options={}) {
    // validate id
    validate.call(this, arguments);
    // set node options
    Object.assign(internals.options, { separator: options.separator });
    // set node data
    this.id = id;
    Object.freeze(this.id); // TODO is this right?
    this.isFinal = false; // last node in branch
    this.edges = {}; // { label: node }
    // this.edgeCount = 0;
  }

  /**
  * Creates a unique identifier
  * @returns {String}
  */
  toString() {
    let str = this.isFinal ? [1] : [0];

    for (let word in this.edges) {
      str.push(word);
      str.push(this.edges[word].id)
    }

    return str.join(internals.options.separator);
    // return StringHash(str);
  }

  /**
  * Add an edge to the node
  * @param {String} key - the string to use as the key
  * @param {Node} node - a Node object
  */
  add(key, value) {
    this.edges[key] = value;
    // this.edgeCount += 1; // keep ongoing edge count
  }
}

module.exports = Node;
