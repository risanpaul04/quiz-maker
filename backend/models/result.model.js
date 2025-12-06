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
});

const Result = mongoose.model('Result', resultSchema);
export default Result;