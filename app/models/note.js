var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    meta: {
        noOfTimesModified: {type: Number, default: 0}
    }
});

noteSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.modifiedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    } else {
        this.meta.noOfTimesModified++;
    }
    next();
});

var Note = mongoose.model('Note', noteSchema);
module.exports = Note;
