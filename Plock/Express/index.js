const express = require('express');
const cors = require('cors');
const path = require('path');
const router = express.Router();


const app = express();

const authRouter = require('./routes/auth/route');
const userRouter = require('./routes/get-current-user/route');
const taskRouter = require('./routes/task/route');
const bannerRouter = require('./routes/banners/route');
const answerRouter = require('./routes/answers/route');
const uploadProfileImg = require('./routes/upload-profile-img/route');



app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/profile', express.static(path.join(__dirname, 'images/profile')));
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', taskRouter);
app.use('/api', bannerRouter);
app.use('/api', answerRouter);
app.use('/api', uploadProfileImg);

app.use(router);




app.listen(4000, () => {
    console.log('Server listening on port 4000');
});
// Path: Plock/Express/package.json
