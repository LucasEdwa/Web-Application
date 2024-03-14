// File: route.js (assuming this is where your POST endpoint is defined)
const express = require('express');
const fileUpload = require('express-fileupload');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middlewares/authMiddleware');
const path = require('path');

const prisma = new PrismaClient();
const router = express.Router();


router.patch('/upload-profile-picture', verifyToken, async (req, res) => {
    
    if (!req.files) {
        return res.status(400).send({ error: "No file uploaded." });
    }
    
    const imageFile = req.files.userImageUrl;

    
    imageFile.mv(`${__dirname}/images/${imageFile.name}`, async (error) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while uploading your image." });
            return;
        }

        // Create a new country entry in the database with the image path
        const image = await prisma.country.update({
            where: {
                id: req.userId
            },
            data: {
                userImageUrl: '/images/profile/' + imageFile.name
            }
        });

        res.send({success: "file"+ imageFile.name + " added successfully"});
    });
});

module.exports = router;