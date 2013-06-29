/**
 * PC Builder Application
 *
 * Dependencies:
 *  express
 *  https
 *  path
 *  fs
 *  validator
 *  mongoose
 *  mongoose-validator
 */

var express =    require('express'),
    nodeMailer = require('nodemailer'),
    routes =     require('./routes'),
    flat =       require('./routes/flatDocs'),
    userFunc =   require('./routes/userFunc.js'),
    https =      require('https'),
    fs =         require('fs'),
    path =       require('path'),
    sanitizer =  require('validator').sanitize;

// Setup ssh keys
var sshOptions = {
    key: fs.readFileSync('./keys/pcKey.pem'),
    cert: fs.readFileSync('./keys/pcKeyCert.pem')
};

// Connect to MongoDB
var mongoose = require('mongoose'),
    mongoValidate = require('mongoose-validator').validate,
    db = mongoose.connect('mongodb://localhost/pcbuilder');

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

// Root
app.get('/', routes.index);

// Flat UI pages
app.get('/flatDoc', flat.documentation);
app.get('/flatDemo', flat.flatIndex);

// User function pages
app.get('/user/login', userFunc);
app.get('/user/register', userFunc);
app.get('/user/forgotPassword', userFunc);
app.get('/user/resetPassword', userFunc);
app.post('/user/resetPassword', userFunc);

https.createServer(sshOptions, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
