/**
 * PC Builder Application
 *
 * Dependencies:
 *  express
 *  https
 *  path
 */

var express = require('express'),
    routes =  require('./routes'),
    flat =    require('./routes/flatDocs'),
    https =   require('https'),
    fs =      require('fs'),
    path =    require('path');

var sshOptions = {
    key: fs.readFileSync('./keys/pcKey.pem'),
    cert: fs.readFileSync('./keys/pcKeyCert.pem')
};
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/flatDoc', flat.documentation);
app.get('/flatDemo', flat.flatIndex);

https.createServer(sshOptions, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
