/**
 * Model for user
 *
 * @param mongoose
 * @param mongooseValidator
 * @param sanitizer
 * @param nodemailer
 * @returns {{User: mongoose.model, changePassword: Function, forgotPassword: Function, login: Function, register: Function, addComputer: Function}}
 */

module.exports = function(mongoose, mongooseValidator, sanitizer, nodemailer) {
    var crypto = require('crypto'); // Include the crypto module to encrypt passwords
    var salt = "19880706AriellaWilk"; // Password salt to further obfuscate the real word (I love my girlfriend)

    // Validators for username, email, and password using mongoose validator module
    var userNameValidator = [mongooseValidator({message: "Username must be between 3 and 30 characters."}, 'len', 3, 30),
                             mongooseValidator({message: "Username can be only numbers and letters."}, 'isAlphanumeric')];
    var emailValidator =    [mongooseValidator({message: "Must be a valida email address."}, 'isEmail')];
    var passwordValidator = [mongooseValidator({message: "Password must be between 5 and 30 characters."}, 'len', 5, 30)];

    // User model schema
    var userSchema = new mongoose.Schema({
        username:  {type: String, unique: true , required: true, validate: userNameValidator},
        password:  {type: String, required: true, validate: passwordValidator},
        email:     {type: String, set: toLower, required: true, validate: emailValidator},
        created:   {type: Date, default: Date.now , required: true},
        computers: [mongoose.Schema.Types.ObjectId]
    });

    var User = new mongoose.model('User', userSchema);

    // Sanitize the input by encoding characters and checking for any xxs attacks
    var sanitizeInput = function(input) {
        input = sanitizer(input).xss();
        input = sanitizer(input).entityEncode();

        return input;
    };

    // Change the password of user to the one specified
    var changePassword = function(username, dateJoin, newPass, callback) {
        var shaSum = crypto.createHash('sha256'), hashedPass;

        // Encode password
        shaSum.update(sanitizeInput(newPass) + dateJoin + salt);
        hashedPass = shaSum.digest('hex');

        // Find user and update their password with new one
        User.update({username: sanitizeInput(username)}, {password: hashedPass}, {upsert: false}, function(err, numAffected, raw) {
            if(err) {
                console.log(err);
                callback(err);
            } else {
                console.log('Password updated.');
                console.log('Rows affected: ', numAffected);
                console.log('Mongo response: ', raw);
                callback({message: 'Success'});
            }
        });
    };

    // Send email to user with password reset url
    var forgotPassword = function(username, resetPassUrl, callback) {

        User.findOne({username: sanitizeInput(username)}, function(err, userDoc) {
            if(err) {
                callback(err);
            } else {
                // Create new SMTP transport
                var smtpTransport = nodemailer.createTransport('SMTP', {
                    service: 'Gmail', // Service to use
                    secureConnection: true, // Use SSL
                    port: 465, // Port for secure SMTP
                    auth: {
                        user: 'spsimplicity@gmail.com',
                        pass: '315SpCp159'
                    }
                });

                resetPassUrl += '?account=' + userDoc._id;

                // Send email to user's email account
                smtpTransport.sendMail({
                    from: 'spsimplicity@gmail.com',
                    to: userDoc.email,
                    subject: 'PC Builder Password Reset',
                    text: 'Click here to reset your password: ' + resetPassUrl
                }, function forgotPassResult(err) {
                    if(err) {
                        console.log('Password reset failed.');
                        callback(err);
                    } else {
                        console.log('Password reset success.');
                        callback({message: 'Success'});
                    }
                });
            }
        });
    };

    // Log user in
    var login = function(username, pass, callback) {
        var shaSum = crypto.createHash('sha256');

        // Find user trying to log in
        User.findOne({username: sanitizeInput(username)}, function(err, userDoc) {
            if(err) {
                console.log('Error logging user in.');
                callback(err);
            } else {
                shaSum.update(sanitizeInput(pass) + userDoc.created + salt);

                // Make sure passwords match
                if(userDoc.password === shaSum.digest('hex')) {
                    console.log('User exists, logging in.');
                    callback(userDoc);
                }
            }
        });
    };

    // Register the new user
    var register = function(username, pass, email, compId, callback) {
        var shaSum = crypto.createHash('sha256');
        var createdAt = (new Date()).getTime();

        shaSum.update(sanitizeInput(pass) + createdAt + salt);
        console.log('Registering user.');

        // Create the new User
        var newUser = new User({
            username: sanitizeInput(username),
            password: shaSum.digest('hex'),
            email: sanitizeInput(email),
            created: createdAt,
            computers: (compId) ? [compId] : []
        });

        // Save the new User
        newUser.save(function(err) {
            if(err) {
                console.log('Error creating user.');
                callback(err);
            } else {
                console.log('User created.');
                callback({message: 'Success'});
            }
        });
    };

    // Add user computer to their list
    var addComputer = function(userAccount, compId, callback) {
        userAccount.computers.push(compId); // Push computerId into array

        // Save User with newly added computerId
        userAccount.save(function(err) {
            if(err) {
                console.log('Error adding computerId to User.');
                callback(err);
            } else {
                console.log('Computer added to User.');
                callback({message: 'Success'});
            }
        });
    };

    return {
        User:           User,
        changePassword: changePassword,
        forgotPassword: forgotPassword,
        login:          login,
        register:       register,
        addComputer:    addComputer
    };
};