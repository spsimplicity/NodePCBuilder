module.exports = function(mongoose, nodemailer) {
    var crypto = require('crypto');
    var salt = "19880706ariellawilk";

    var userSchema = new mongoose.Schema({
        username:  {type: String, unique: true , required: true},
        password:  {type: String, required: true},
        email:     {type: String, set: toLower, required: true},
        created:   {type: Date, default: Date.now , required: true},
        computers: [mongoose.Schema.Types.ObjectId]
    });

    var User = new mongoose.model('User', userSchema);

    var changePassword = function(username, dateJoin, newPass) {
        var shaSum = crypto.createHash('sha256'), hashedPass;

        shaSum.update(newPass + dateJoin + salt);
        hashedPass = shaSum.digest('hex');

        User.update({username: username}, {password: hashedPass}, {upsert: false}, function(err, numAffected, raw) {
            if(err) return err;

            console.log('Password updated.');
            console.log('Rows affected: ', numAffected);
            console.log('Mongo response: ', raw);
        });
    };

    var forgotPassword = function(username, resetPassUrl, callback) {
        User.findByUsername(username, function(err, userDoc) {
            if(err) {
                callback(false); //Couldn't find username
            } else {
                var smtpTransport = nodemailer.createTransport('SMTP', config.mail);

                resetPassUrl += '?account=' + userDoc._id;
                smtpTransport.sendMail({
                    from: 'spsimplicity@gmail.com',
                    to: userDoc.email,
                    subject: 'PC Builder Password Reset',
                    text: 'Click here to reset your password: ' + resetPassUrl
                }, function forgotPassResult(err) {
                    if(err) {
                        callback(false);
                        console.log('Password reset failed.');
                    } else {
                        callback(true);
                        console.log('Password reset success.');
                    }
                });
            }
        });
    };

    var login = function(username, pass, callback) {
        var shaSum = crypto.createHash('sha256');

        User.findByUsername(username, function(err, userDoc) {
            shaSum.update(pass + userDoc.created + salt);
             if(userDoc.password === shaSum.digest('hex')) {
                 callback(userDoc);
                 console.log('User exists, logging in.');
             } else {
                 callback(err);
                 console.log('Error logging user in.');
             }
        });
    };

    var register = function(user, pass, email, compId) {
        var shaSum = crypto.createHash('sha256');
        var createdAt = new Date().time;

        shaSum.update(pass + createdAt + salt);
        console.log('Registering user.');

        var newUser = new User({
            username: user,
            password: shaSum.digest('hex'),
            email: email,
            created: createdAt,
            computers: (compId) ? [compId] : []
        });

        newUser.save(function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('User created');
            }
        });
        console.log('User save command sent');
    };

    var findByUsername = function(username, callback) {
        User.findOne({username: username}, function(err, userDoc) {
            callback(err, userDoc);
        });
    };

    var addComputer = function() {};

    return {
        User:           User,
        changePassword: changePassword,
        forgotPassword: forgotPassword,
        login:          login,
        register:       register,
        findByUsername: findByUsername,
        addComputer:    addComputer
    }
};