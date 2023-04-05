import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "name is required"],
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: [true, "name is required"],
        min: 2,
        max: 50
    },
    password: {
        type: String,
        required: [true, "password is required"],
        min: 5
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        max: 50,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "phoneNumber is required"]
    },
    profileImage: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },

    friends: {
        type: Array,
        default: [],
    },
    sentFriendRequests: {
        type: Array,
        default: [],
    },
    recievedFriendRequests: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    status : {
        type: Boolean,
        default: true
    }
},
{timestamps: true}
);

UserSchema.pre('save', function(next) {
    // Check if the phoneNumber field is being created or updated for the first time
    if (this.isModified('phoneNumber') && this.phoneNumber) {
      // Prepend "+91" to the phoneNumber value
      this.phoneNumber = "+91" + this.phoneNumber;
    }
    // Call the next middleware function
    next();
  });
  

// UserSchema.pre('save', function(next) {
//     // Check if the phoneNumber field has a value
//     if (this.phoneNumber) {
//       // Prepend "+91" to the phoneNumber value
//       this.phoneNumber = "+91" + this.phoneNumber;
//     }
//     // Call the next middleware function
//     next();
//   });

  
// userSchema.pre("save", async function(next){
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// })

// userSchema.statics.login = async function(email, password){
//     console.log(password);
//     const user = await this.findOne({email});
//     if(user){
//         const auth = await bcrypt.compare(password, user.password);
//         if(auth){
//             return user;
//         }
//         throw Error("Incorrect Password")
//     }
//     throw Error("Incorrect Email")
// } 

// userSchema.statics.otpLogin = async function(phoneNumber){
//     console.log("model phoneNumber");
//     console.log(phoneNumber);
//     console.log(typeof(phoneNumber));
//     console.log("model phoneNumber");
//     const user = await this.findOne({phoneNumber});
//     console.log(user);
//     if(user){
//             return user;
//     }
//     throw Error("Incorrect Phone Number")
// }

const User = mongoose.model("User", UserSchema);
export default User;  