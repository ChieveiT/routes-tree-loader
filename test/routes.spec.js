import expect from 'expect';
import foo from './stub/foo';
import bar from './stub/bar';

describe('Routes generated from Routes Loader', () => {
  it('exports match function to match routes', () => {
    let { match } = require('./routes/match_function');

    return Promise.all([
      match('/').then(function({ components, args, name }) {
        expect(components).toEqual([
          [ foo ],
          [ foo, bar ],
          [ bar ]
        ]);

        expect(args).toEqual({ });

        expect(name).toEqual('default');
      }),
      match('/default_child_one').then(function({
        components, args, name
      }) {
        expect(components).toEqual([
          [ foo ],
          [ foo, bar ],
          [ foo ]
        ]);

        expect(args).toEqual({ });

        expect(name).toEqual('default1');
      }),
      match('/default_child_two').then(function({
        components, args, name
      }) {
        expect(components).toEqual([
          [ foo ],
          [ foo, bar ],
          [ bar ]
        ]);

        expect(args).toEqual({ });

        expect(name).toEqual('default2');
      }),
      match('/foo').then(function({ components, args, name }) {
        expect(components).toEqual([
          [ foo ]
        ]);

        expect(args).toEqual({ });

        expect(name).toEqual(undefined);
      }),
      match('/foo123abc_bar').then(function({
        components, args, name
      }) {
        expect(components).toEqual([
          [ foo ],
          [ bar ]
        ]);

        expect(args).toEqual({ bar: '123', foo: 'abc_' });

        expect(name).toEqual(undefined);
      }),
      match('/foo123bar?banana%26=123%3D321').then(function({
        components, args, name
      }) {
        expect(components).toEqual([
          [ foo ],
          [ bar ]
        ]);

        expect(args).toEqual({ bar: '123', 'banana&': '123=321' });

        expect(name).toEqual(undefined);
      }),
      match('/foobar').then(function(r) {
        expect(r).toEqual(false);
      })
    ]);
  });

  it('exports check function to check routes', () => {
    let { check } = require('./routes/match_function');

    expect(check('/')).toEqual(true);
    expect(check('/default_child_one')).toEqual(true);
    expect(check('/default_child_two')).toEqual(true);
    expect(check('/foo')).toEqual(true);
    expect(check('/foo123abc_bar')).toEqual(true);
    expect(check('/foo123bar')).toEqual(true);
    expect(check('/foobar')).toEqual(false);
    expect(check('/not_found')).toEqual(false);
  });

  it('exports linkByName function to return a named route\'s link', () => {
    let { linkByName } = require('./routes/link_function');

    expect(linkByName('foo', { bar: 0, foo: 'abc' })).toEqual(
      '/foo0/bar.fooabc_tail_'
    );

    expect(linkByName('foo', {
      foo: 'abc', 'banana&': '123=321'
    })).toEqual(
      '/foo/bar.fooabc_tail_?banana%26=123%3D321'
    );

    expect(() => {
      linkByName('name');
    }).toThrow(/Unknown name.*/);

    expect(() => {
      linkByName('foo');
    }).toThrow(/Argument.*required/);

    expect(() => {
      linkByName('foo', { foo: 233 });
    }).toThrow(/Argument.*illegal/);
  });

  it('exports linkByPath function to return a path\'s link', () => {
    let { linkByPath } = require('./routes/link_function');

    expect(linkByPath('/foo/bar', { bar: 1, foo: 'abc' })).toEqual(
      '/foo/bar?bar=1&foo=abc'
    );

    expect(linkByPath('/foo/bar', { 'banana&': '123=321' })).toEqual(
      '/foo/bar?banana%26=123%3D321'
    );
  });

  it('fix the end condition in matching, should not ' +
    'match "a path with no default tail"', () => {
    let { check, match } = require('./routes/match_function');

    expect(check('/no_default_child')).toEqual(false);

    return match('/no_default_child').then(function(result) {
      expect(result).toEqual(false);
    })
  });
});
