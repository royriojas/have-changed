import flatCache from 'flat-cache';
import process from './lib/process';
import hash from 'hash-string';
import trim from 'jq-trim';
import fs from 'fs';
import objUtil from 'obj-util';
import stringify from 'json-stable-stringify';
import path from 'path';
import exec from './lib/exec';
import { Promise } from 'es6-promise';

function readJSON( file ) {
  return JSON.parse( fs.readFileSync( file, { encoding: 'utf8' } ) );
}

const main = {
  _hasChanged( file, paths = [ ], force ) {
    file = path.resolve( file );
    const jsonContent = readJSON( file );

    const cli = this.cli;

    let content = [ jsonContent ];

    if ( paths.length > 0 ) {
      paths = paths.sort();

      const filtered = paths.reduce( (seq, key) => {
        const keyVal = objUtil.getKeyValue( jsonContent, key );
        if ( typeof keyVal === 'undefined' ) {
          cli.subtle( `key not found "${key}"` );
          return seq;
        }
        seq.push( keyVal );
        return seq;
      }, [ ] );

      if ( filtered.length > 0 ) {
        content = filtered;
      }
    }

    const hashValue = 'c_' + hash( stringify( content ) );

    const prevValue = this._cache.getKey( file );

    this._cache.setKey( file, hashValue );

    return force || hashValue !== prevValue;
  },
  run( cli ) {
    const opts = cli.opts;
    const file = opts._[ 0 ];
    const cacheId = opts.cacheId;

    const cacheIdentifier = 'c_' + hash( process.cwd() + trim( cacheId ) );

    this._cache = flatCache.load( cacheIdentifier );

    let p = Promise.resolve();

    const paths = opts.paths || [ ];

    this.cli = cli;

    const hasChanged = this._hasChanged( file, paths, opts.force );

    if ( hasChanged ) {
      cli.log( 'the file has changed' );
      if ( opts.changedCmd ) {
        cli.subtle( 'executing changedCmd', opts.changedCmd );
        p = exec( opts.changedCmd ).then( () => cli.ok( 'changedCmd done!' ) );
      } else {
        cli.subtle( 'nothing to execute' );
      }
    } else {
      cli.log( 'the file has not changed' );
      if ( opts.notChangedCmd ) {
        cli.subtle( 'executing notChangedCmd', opts.notChangedCmd );
        p = exec( opts.notChangedCmd ).then( () => cli.ok( 'notChangedCmd done!' ) );
      } else {
        cli.subtle( 'nothing to execute when not changed' );
      }
    }

    if ( opts.changedCmd || opts.notChangedCmd ) {
      p.then( () => this._cache.save() );
    } else {
      console.log( hasChanged ); //eslint-disable-line
      this._cache.save();
    }
  }
};

export default main;
