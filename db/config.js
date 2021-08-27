const mongoose = require('mongoose');

const dbConnection = async () => {

        await mongoose.connect(
            process.env.DB_CNN,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        ).then(

            console.log('DB online')

        ).catch( err => {

            console.log(err);
            throw new Error('Error a la hora de inicializar la DB');

        } )

};

module.exports = {
    dbConnection
};