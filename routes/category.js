const { Category } = require('../models/cetegory');
const express = require('express');
const router = express.Router()


const pLimit = require('p-limit')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_cloud_name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret
})

// const images = [
//     "https://res-console.cloudinary.com/dhb7vg3du/thumbnails/v1/image/upload/v1714410211/Y2xkLXNhbXBsZS01/drilldown",
//     "https://res-console.cloudinary.com/dhb7vg3du/thumbnails/v1/image/upload/v1714410210/Y2xkLXNhbXBsZS00/drilldown"
// ]

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.send(categoryList);


});


router.get('./id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            message: 'the category with the given ID was not found.'
        })
    }
    return res.status(200).send(category)
})

router.delete('/:id', async (req, res) => {
    const deletedUser = await Category.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
        res.status(404).json({
            message: 'Category not found!',
            success: false
        })
    }
    res.status(200).json({
        success: true,
        message: 'Category Deleted'
    })
})


router.post('/create', async (req, res) => {
    const limit = pLimit(2);

    const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            console.log(`Successfully uploade ${image}`);
            console.log(`> result ${result.secure_url}`);
            return result
        })
    })

    const uploadStatus = await Promise.all(imagesToUpload);
    const imgurl = uploadStatus.map((item) => {
        return item.secure_url
    })

    if (!uploadStatus) {
        return res.status(500).json({
            error: "images cannot upload!",
            status: false
        })
    }

    let category = new Category({
        name: req.body.name,
        images: imgurl,
        color: req.body.color
    });

    if (!category) {
        res.status(500).json({
            error: err,
            success: false
        })
    }

    category = await category.save();

    res.status(201).json(category);

})

module.exports = router;