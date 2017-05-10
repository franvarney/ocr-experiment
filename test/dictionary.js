const {expect} = require('code');
const Fs = require('fs');
const Lab = require('lab');
const Path = require('path');

const {describe, it} = exports.lab = Lab.script();

const Dictionary = require('../lib/dictionary');

const PhrasesPath = Path.resolve(__dirname, './fixtures/phrases.txt');
const PhrasesFixture = Fs.readFileSync(PhrasesPath, 'utf8');
const WordsPath = Path.resolve(__dirname, './fixtures/words.txt');
const WordsFixture = Fs.readFileSync(WordsPath, 'utf8');

function cleanText(text) {
  return text.toLowerCase().replace(/[^\w\s]|-/g, '').replace(/\s+/g, ' ');
}

describe('Dictionary', () => {
  it('is a function', (done) => {
    expect(typeof Dictionary).to.equal('function');
    return done();
  });

  describe('works with characters/words', () => {
    const text = cleanText(WordsFixture);
    const dictionary = new Dictionary();

    describe('sets chars', () => {
      it('uses default chars', (done) => {
        expect(dictionary.chars).to.equal('abcdefghijklmnopqrstuvwxyz0123456789'.split(''));
        return done();
      });

      it('allows custom chars', (done) => {
        const dict = new Dictionary({ chars: 'abc123'.split('') });
        expect(dict.chars).to.equal(['a', 'b', 'c', '1', '2', '3']);
        return done();
      });

      it('throws an error if chars is not an array', (done) => {
        expect(() => new Dictionary({ chars: 'abc '})()).to.throw();
        return done();
      });

      it('throws an error if chars is empty array', (done) => {
        expect(() => new Dictionary({ chars: [] })()).to.throw();
        return done();
      });
    });

    describe('#length', () => {
      describe('has no values', () => {
        it('returns 0', (done) => {
          expect(dictionary.length).to.be.a.number();
          expect(dictionary.length).to.equal(0);
          return done();
        });
      });

      describe('has values', () => {
        it('returns a number', (done) => {
          text.split(' ').forEach((word) => dictionary.add(word));
          expect(dictionary.length).to.be.a.number();
          expect(dictionary.length).to.equal(64);
          return done();
        });
      });
    });

    describe('#add', () => {
      describe('adds a value', () => {
        it('has the value', (done) => {
          dictionary.add('cheese');
          expect(dictionary.list.has('cheese')).to.be.true();
          return done();
        });

        it('is chainable', (done) => {
          dictionary.add('dairy').add('milk');
          expect(dictionary.list.has('dairy')).to.be.true();
          expect(dictionary.list.has('milk')).to.be.true();
          return done();
        });
      });
    });

    describe('#remove', () => {
      describe('removes a value', (done) => {
        it('does not have the value', (done) => {
          dictionary.remove('cheese');
          expect(dictionary.list.has('cheese')).to.be.false();
          return done();
        });

        it('is chainable', (done) => {
          dictionary.remove('dairy').remove('milk');
          expect(dictionary.list.has('dairy')).to.be.false();
          expect(dictionary.list.has('milk')).to.be.false();
          return done();
        });
      });
    });

    describe('#has', () => {
      describe('has the value', () => {
        it('returns true', (done) => {
          expect(dictionary.has('lorem')).to.be.true();
          return done();
        });
      });

      describe('does not have the value', () => {
        it('returns false', (done) => {
          expect(dictionary.has('cheese')).to.be.false();
          return done();
        });
      })
    });

    describe('#values', () => {
      describe('lists the values', () => {
        it('returns an array', (done) => {
          expect(dictionary.values()).to.be.an.array();
          expect(dictionary.values().length).to.equal(64);
          return done();
        });
      });
    });

    describe('#correct', () => {
      describe('suggests corrections', () => {
        it('returns an array', (done) => {
          expect(dictionary.correct('lore').length).to.equal(1); // insert
          expect(dictionary.correct('eit').length).to.equal(4); // insert
          expect(dictionary.correct('dos').length).to.equal(1); // delete
          expect(dictionary.correct('ispum').length).to.equal(1); // transpose
          expect(dictionary.correct('labors').length).to.equal(2); // replace
          return done();
        });
      });
    });
  });

  describe('works with words/phrases', () => {
    const words = cleanText(PhrasesFixture).split(' ');
    const phrases = PhrasesFixture.split(/\n/).map((line) => {
      return cleanText(line);
    }).filter((line) => line.length);
    const dictionary = new Dictionary({ chars: words });

    describe('sets chars', () => {
      it('allows custom chars', (done) => {
        expect(dictionary.chars.length).to.equal(167);
        return done();
      });
    });

    describe('#length', () => {
      describe('has values', () => {
        it('returns a number', (done) => {
          phrases.forEach((phrase) => dictionary.add(phrase));
          expect(dictionary.length).to.be.a.number();
          expect(dictionary.length).to.equal(19);
          return done();
        });
      });
    });

    describe('#has', () => {
      describe('has the value', () => {
        it('returns true', (done) => {
          expect(dictionary.has('lorem ipsum dolor sit amet consectetur adipiscing elit')).to.be.true();
          return done();
        });
      });

      describe('does not have the value', () => {
        it('returns false', (done) => {
          expect(dictionary.has('lorem ipsum dolor')).to.be.false();
          return done();
        });
      })
    });

    describe('#values', () => {
      describe('lists the values', () => {
        it('returns an array', (done) => {
          expect(dictionary.values()).to.be.an.array();
          expect(dictionary.values().length).to.equal(19);
          return done();
        });
      });
    });

    describe('#correct', () => {
      describe('suggests corrections', () => {
        it('returns an array', (done) => {
          expect(dictionary.correct('aenean convallis sem non hendrerit', ' ').length).to.equal(1); // insert
          expect(dictionary.correct('morbi in mauris accumsan rhoncus arcu nec finibus odio word', ' ').length).to.equal(1); // delete
          expect(dictionary.correct('nulla rhoncus nulla ut ipsum condimentum varius', ' ').length).to.equal(1); // transpose
          expect(dictionary.correct('etiam ut ipsum in sapien accumsan scelerisque vitae at condimentum', ' ').length).to.equal(2); // replace
          return done();
        });
      });
    });
  });
});
