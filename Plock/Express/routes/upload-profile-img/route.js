const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const path = require('path');

router.use(fileUpload());
/** having a problem with update profile pic after tanStacking and router organization. 
 * Getting {404/badRequest} */

router.post('/upload-profile-picture', verifyToken, async (req, res) => {
    if (!req.files || !req.files.userImageUrl) {
        return res.status(400).send({ error: "No file uploaded." });
    }

    const file = req.files.userImageUrl;

    if (!file.name) {
        return res.status(400).send({ error: "File name is missing." });
    }

    const filePath = path.join(__dirname, 'images/profile', file.name);

    file.mv(filePath, async (error) => {
        if (error) {

            console.error(error);
            return res.status(500).send({ error: "An error occurred while uploading your image." });
            
        }

        try {
            await prisma.user.update({
                where: { id: req.userId },
                data: {
                    userImageUrl: `images/profile/${file.name}`
                }
            });

        } catch (error) {

            console.error(error);
            return res.status(500).send({ error: "An error occurred while saving the image data." });
        }

        res.send({ success: "Profile picture uploaded successfully." });
    });
});

module.exports =  router
