#!/usr/bin/env node
import main from '../main';
import programOptions from '../options.js';
import clix from 'clix';

clix.launch( programOptions, (program) => main.run( program ) );
