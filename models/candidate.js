const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

//define the person schema

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    party:{
        type:String,
        required:true,
    },
    age : {
        type:Number,
        required :true
    },
    votes:[
        { user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        votedAt :{
            type:Date,
            default:Date.now()
        }
    }
    ],
    voteCount:{
        type:Number,
        default : 0
    }
    
},
	{
		timestamps: { 
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		},
		versionKey : false
	});

    const Candidate = mongoose.model('Candidate',candidateSchema);
    module.exports = Candidate;
