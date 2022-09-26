const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },

    image: String,

    postedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users"
    }
});

postSchema.set('timestamps', true);
const Post = mongoose.model('Posts', postSchema);


module.exports = Post;
