const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// const CounterSchema = new mongoose.Schema({
//     _id: {type: String, required: true},
//     seq: {type: Number, default: 0}
// });

// const counter = mongoose.model('counter', CounterSchema);

//define schema for database
const studentSchema = mongoose.Schema({
    local: {
        stuId: String,
        password: String,
        firstname: String,
        lastname: String,
        midname: {
            type: String,
            required: false
        },
        dob: Date,
        address: String,
        level: String
    }
});

// studentSchema.pre('save', function(next){
//     const doc = this;
//     counter.findByIdAndUpdate({_id: 'id'}, {$inc: {seq: }})
// })


//generating a hash
studentSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(7), null);
}

//checking password validity
studentSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.local.password);
}

//export model
module.exports = mongoose.model('Student', studentSchema);