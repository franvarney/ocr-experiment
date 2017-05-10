const {expect} = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const {before, describe, it} = lab;

const Dawg = require('../lib/dawg');

const dawg = new Dawg();

const values = [
  'lorem ipsum dolor sit amet consectetur adipisicing elit',
  'ut enim ad minim veniam quis nostrud exercitation',
  'duis aute irure dolor in reprehenderit elit',
  'excepteur sint occaecat cupidatat non proident sunt in culpa',
  'lorem enim ad sit veniam quis nostrud exercitation'
];

describe('Dawg', () => {
  before((done) => {
    values.forEach((value) => dawg.add(value));
    return done();
  });

  it('is a function', (done) => {
    expect(typeof Dawg).to.equal('function');
    return done();
  });

  describe('#add', () => {
    describe('adds a phrase', () => {
      it('contains the phrase');
    });

    describe('input is a not a string', () => {
      it('throws an error');
    })
  });

  describe('#contains', () => {
    describe('exact value exists', () => {
      it('returns true', (done) => {
        let result = dawg.contains('lorem ipsum dolor sit amet consectetur adipisicing elit');
        expect(result).to.be.a.boolean();
        expect(result).to.be.true();
        return done();
      });
    });

    describe('partial value exists', () => {
      it('returns false', (done) => {
        let result = dawg.contains('lorem ipsum dolor sit amet');
        expect(result).to.be.a.boolean();
        expect(result).to.be.false();
        return done();
      });
    });

    describe('value does not exist', () => {
      it('returns false', (done) => {
        let result = dawg.contains('cheese is gud');
        expect(result).to.be.a.boolean();
        expect(result).to.be.false();
        return done();
      });
    });
  });

  describe('#values', () => {
    describe('has values', () => {
      it('returns array of values', (done) => {
        let results = dawg.values();
        expect(results).to.be.array();
        expect(results.length).to.equal(5);
        results.forEach((result) => {
          expect(values.indexOf(result) >= 0).to.be.true();
        });
        return done();
      });
    });
  });

  describe('#matches', () => {
    describe('has matches for a word', () => {
      it('returns array of phrases', (done) => {
        let results = dawg.matches('elit');
        expect(results).to.be.array();
        expect(results.length).to.equal(2);
        return done();
      });
    });

    describe('has matches for a prefix', () => {
      it('returns an array of matches', (done) => {
        let results = dawg.matches('duis aute irure');
        expect(results).to.be.array();
        expect(results.length).to.equal(1);
        return done();
      });
    });

    describe('has no matches', () => {
      it('returns an empty array', (done) => {
        let results = dawg.matches('cheese');
        expect(results).to.be.array();
        expect(results.length).to.equal(0);
        return done();
      });
    });
  });
});
