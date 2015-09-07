'use strict';

module.exports = ['$server', function($server) {
  $server.use(function(err, req, res, next) {

    res
      .status(500)
      .send([
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
          '<meta charset="utf-8">',
          '<title>Server error | {{title}}</title>',
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
          '<link href="http://fonts.googleapis.com/css?family=Roboto:500,300,700,400" rel="stylesheet" type="text/css">',
          '<style type="text/css">',
            'body {',
              'font-size: 1.5em;',
              'line-height: 1.6;',
              'font-weight: 300;',
              'font-family: "SegoeUI", "Roboto", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;',
              'color: #222;',
            '}',
            'h1 {',
              'font-size: 1rem;',
              'font-weight: 300;',
              'line-height: 1rem;',
              'margin: 0;',
            '}',
            'h2 {',
              'font-size: 1.6em;',
              'font-weight: 400;',
              'line-height: 1em;',
              'margin: 0.3em 0 0 0;',
              'color: #ff6600;',
              'margin: 0;',
            '}',
            'p {',
              'margin: 1em 0 0 0;',
              'font-size: 1em;',
              'line-height1em;',
            '}',
            '.content {',
              'position: absolute;',
              'top: 50%;',
              'left: 0;',
              'width: 100%;',
              'margin-top: -5rem;',
              'text-align: center;',
            '}',
            '.theme { color: #ff6600; }',
          '</style>',
        '</head>',
        '<body>',
          '<div class="content">',
            '<h1>{{title}}</h1>',
            '<h2>Oops, something went wrong.</h2>',
            '<p>We\'re sorry but we\'re working on getting this fixed as soon as we can. You may be able to try again.</p>',
          '</div>',
        '</body>',
        '</html>'
      ].join(''));
  });
}];
