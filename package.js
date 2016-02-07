Package.describe({
  name: 'panter:orion-components',
  version: '0.1.1',
  // Brief, one-line summary of the package.
  summary: 'create components in orion',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/panter/meteor-orion-components',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use(['ecmascript', 'less', 'orionjs:core@1.7.0', 'reactive-var']);
  api.addFiles('orion-components.html');
  api.addFiles('orion-components.js');
  api.addFiles('orion-components.less');
  
  
});

