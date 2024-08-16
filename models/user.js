const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define the  user schema

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age :{
        type:Number,
        required:true,
    },
    email :{
        type:String,
    },
    mobile : {
        type : String,
    },
    adress: {
        type : String,
    },
    aadharCardNumber:{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    role :{
        type : String,
        enum : ['voter' , 'admin' ],
        default:'voter'
    },
    isVoted:{
        type : Boolean,
        default : false
    }
    
},
	{
		timestamps: { 
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		},
		versionKey : false
	});

    userSchema.pre('save',async function(next){
        const person = this;
        //hash  the password  only if it has been modified (or is new)
        if(!person.isModified('password')) return next();
    
        try{
            //hash password generation
            const salt  = await bcrypt.genSalt(10);
         //hash password 
         const hashedPassword= await bcrypt.hash(person.password,salt);
    
         //overide the plain password with the hashed one 
         person.password = hashedPassword;
         next();
        }catch(err){
        return next(err);
        }
        })

        userSchema.methods.comparePassword =async function(candidatePassword){
            try{
              //Use bcrypt   to comapare  the provided passsoword with the hashed password
              const isMatch = await bcrypt.compare(candidatePassword,this.password);
              return  isMatch;
            }catch(err){
              throw err;
            }
          } 

    const User = mongoose.model('User',userSchema);
    module.exports = User;