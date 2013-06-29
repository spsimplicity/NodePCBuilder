/**
 * User functions
 */

exports.login = function(userModel) {
    return function(req, res) {
        var username = req.param('username', null),
            password = req.param('password', null);

        if(username != null && pasword != null) {
            userModel.login(username, password, function(response) {
                res.json(200, response);
            });
        }
    };
};

exports.register = function(userModel) {
    return function(req, res) {
        var username = req.param('username', null),
            password = req.param('password', null),
            email =    req.param('email', null),
            compId =   req.param('compId', null);

        if(username != null && password != null && email != null) {
            userModel.register(username, password, email, compId, function(response) {
                res.json(200, response);
            });
        }
    };
};

exports.forgotPass = function(userModel) {
    return function(req, res) {
        var email = req.param('email', null),
            resetUrl = 'https://' + req.headers.host + '/resetPassword';

        if(email != null) {
            userModel.forgotPassword(email, resetUrl, function(response) {
                res.json(response);
            });
        }
    };
};

exports.resetPassPage = function(req, res) {
    var username = req.param('username', null),
        dateJoin = req.param('num', null);
    // show password page with jade
    res.render('resetPassword', {
        title: 'Reset Password',
        locals: {name: username, num: dateJoin}
    });
};

exports.resetPassSubmit = function(userModel) {
    return function(req, res) {
        var username = req.param('username', null),
            date =     req.param('date', null),
            password = req.param('password', null);

        userModel(username, date, password, function(response) {
            res.json(response);
        });
    };
};