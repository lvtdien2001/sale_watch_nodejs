import BrandService from '../services/brand.service';

// @route POST /brand
// @desc create a new brand
// @access private (admin)
exports.create = async (req, res) => {
    try {
        const uploadImage = await BrandService.create(req.file.path);
        res.send(uploadImage);
    } catch (error) {
        console.log(error);
    }
}

exports.home = async (req, res) => {
    try {
        const testData = [
            {
                id: 1,
                name: 'one'
            },
            {
                id: 2,
                name: 'two'
            },
            {
                id: 3,
                name: 'three'
            }
        ]
        res.render('home', {layout: 'admin', testData, isTest: false, obj: {name: 'test'}});
    } catch (error) {
        console.log(error);
    }
}