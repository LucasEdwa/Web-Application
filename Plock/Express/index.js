const express = require('express');
const cors = require('cors');
const path = require('path');
const router = express.Router();
const fileUpload = require('express-fileupload');


const app = express();

const authRouter = require('./routes/auth/auth');
const userRouter = require('./routes/get-current-user/user');
const taskRouter = require('./routes/task/task');
const bannerRouter = require('./routes/banners/banner.js');
const answerRouter = require('./routes/answers/answer');
const fileUploadRouter = require('./routes/upload-profile-img/route.js');


app.use(fileUpload());
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', taskRouter);
app.use('/api', bannerRouter);
app.use('/api', answerRouter);
app.use('/api', fileUploadRouter);

app.use(router);




app.listen(4000, () => {
    console.log('Server listening on port 4000');
});
// Path: Plock/Express/package.json
