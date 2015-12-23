import path from 'path';

const options = {
  pkgJSONPath: path.resolve( __dirname, '../package.json' ),
  optionator: {
    prepend: 'Usage: have-changed [options] jsonfile.json',
    options: [
      {
        heading: 'Options'
      },
      {
        option: 'changed-cmd',
        alias: 'x',
        type: 'String',
        description: 'Command to execute if the file did change.'
      },
      {
        option: 'not-changed-cmd',
        alias: 'n',
        type: 'String',
        description: 'Command to execute if the file did not change.'
      },
      {
        option: 'cache-id',
        type: 'String',
        description: 'the cache id for this given command'
      },
      {
        option: 'paths',
        alias: 'p',
        type: '[String]',
        description: 'the keys to check in the json file'
      },
      {
        option: 'force',
        alias: 'f',
        type: 'Boolean',
        description: 'whether to force the execution of the changedCmd'
      }
    ]
  }
};

export default options;
