const mongoose = require('mongoose');

async function connect() {
    let url = 'mongodb+srv://chotchachi:quang2451999@cluster0.le01p.mongodb.net/sample_airbnb?retryWrites=true&w=majority'
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log('connect successfully!!!');
    } catch (error) {
        console.log(`fail = ${error}`);
    }
}

module.exports = { connect };
