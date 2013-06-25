/**
 * Get Flat UI Doc pages
 */

exports.documentation = function(req, res) {
    res.render('documentation', {title: 'Flat UI Documentation'});
};

exports.flatIndex = function(req, res) {
    res.render('flatIndex', {title: 'Flat UI Overview'});
};