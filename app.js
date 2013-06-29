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
    userFunc =   require('./routes/userFunc'),
    https =      require('https'),
    fs =         require('fs'),
    path =       require('path'),
    sanitizer =  require('validator').sanitize;

// Setup ssh keys
var sshOptions = {
    key:  fs.readFileSync('./keys/pcKey.pem'),
    cert: fs.readFileSync('./keys/pcKeyCert.pem')
};

// Connect to MongoDB
var mongoose = require('mongoose'),
    mongooseValidate = require('mongoose-validator').validate,
    db = mongoose.connect('mongodb://localhost/pcbuilder');

var dataModels = {
    User: require('./models/user')(mongoose, mongooseValidate, sanitizer, nodeMailer)
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

// Root
app.get('/', routes.index);

// Flat UI pages
app.get('/flatDoc', flat.documentation);
app.get('/flatDemo', flat.flatIndex);

// User function pages
app.get('/user/login', userFunc.login(dataModels.User));
app.get('/user/register', userFunc.register(dataModels.User));
app.get('/user/forgotPassword', userFunc.forgotPass(dataModels.User));
app.get('/user/resetPassword', userFunc.resetPassPage);
app.post('/user/resetPassword', userFunc.resetPassSubmit(dataModels.User));

https.createServer(sshOptions, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
