const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const fileUpload = require('express-fileupload');

const prisma = new PrismaClient();
/**
 * Specific route for handling requests related to banners, just the same as the profile images 
 * but leving the the file in images and not images/profile path.
 * 
 */
// Manage banners home
router.post('/create-banner-image', async (req, res) => {
    // Check if a file was uploaded
    if (!req.files || !req.files.image) {
        res.status(400).send({ error: "No file uploaded." });
        return;
    }
    const file = req.files.image;
    // Check if the file name is available
    if (!file.name) {
        res.status(400).send({ error: "File name is missing." });
        return;
    }
    // Move the uploaded file to the images directory
    file.mv(`${__dirname}/images/${file.name}`, async (error) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while uploading your image." });
            return;
        }
        // Create new image record in the database
        try {
            const newImage = await prisma.image.create({
                data: {
                    imageUrl: 'images/' + file.name
                }
            });
            res.send({ success: "Banner image uploaded successfully.", image: newImage });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while saving the image data." });
            return;
        }
    });
});
router.get('/get-banner-image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) }
        });

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        return res.json(image);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch image', details: error.message });
    }
});
router.get('/get-banner-image', async (req, res) => {
    try {
        const images = await prisma.image.findMany();
        return res.json(images);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch images', details: error.message });
    }
});

module.exports = router;