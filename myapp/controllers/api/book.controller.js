var Book = require('../../models/book.model');
var globals = require('../../global')

module.exports.search = async function (req, res) {
    // get data
    var input = '^.*' + req.body.search + '.*$';
    var data = await Book.find({
        $and: [
            {
                $or: [
                    { title: { $regex: new RegExp(input, "i") } },
                    { author: { $regex: new RegExp(input, "i") } }
                ]
            }, {
                is_del: false
            }
        ]

    }).cache({
        userid: req.signedCookies.userid,
        page: 'book',
        input: req.body.search
    });

    globals.success.data = data
    res.json(globals.success);
};