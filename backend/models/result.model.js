import mongoose from 'mongoose'


const resultSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: String,
        isCorrect: Boolean
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for score
resultSchema.virtual('score').get(function() {
    if (!this.answers) return 0;
    return this.answers.filter(a => a.isCorrect).length;
});

// Virtual for totalQuestions
resultSchema.virtual('totalQuestions').get(function() {
    return this.answers ? this.answers.length : 0;
});

// Virtual for percentage
resultSchema.virtual('percentage').get(function() {
    if (!this.answers || this.answers.length === 0) return 0;
    return Math.round((this.answers.filter(a => a.isCorrect).length / this.answers.length) * 100);
});

const Result = mongoose.model('Result', resultSchema);
export default Result;