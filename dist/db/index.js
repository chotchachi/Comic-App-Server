const mongoose = require('mongoose');

async function connect() {
    let url = 'mongodb+srv://chotchachi:quang2451999@cluster0.le01p.mongodb.net/comic-app?retryWrites=true&w=majority'
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log('Connect database successfully!!!');
    } catch (error) {
        console.log(`Connect database failed with error: ${error}`);
    }
}

module.exports = { connect };
