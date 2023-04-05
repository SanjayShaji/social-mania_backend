import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const register = async(req, res)=>{
    try {
        const {
            firstName,
            lastName,
            password,
            email,
            phoneNumber
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            password: passwordHash,
            email,
            phoneNumber
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        console.log(req.body);
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "user not found"});
        
        if(!user.status) return res.status(400).json({msg: "user is blocked"})
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
    
        const token = jwt.sign({id: user._id}, process.env.USER_JWT_SECRET);
        delete user.password;
        console.log(user);
        console.log("token" + token);
        res.status(200).json({token, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

export const otpLogin = async(req, res)=>{
    try {
        console.log("phoneNumber");
        console.log(req.body);
        let convert = Object.values(req.body);
        let phoneNumber = convert.join("")
        console.log(phoneNumber);
        console.log("phoneNumber");

        const user = await User.findOne({phoneNumber: phoneNumber});
        if(!user) return res.status(400).json({msg: "user not found"});
    
        // const isMatch = await bcrypt.compare(password, user.password);
        // if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
    
        const token = jwt.sign({id: user._id}, process.env.USER_JWT_SECRET);
        delete user.password;
        console.log(user);
        console.log("token" + token);
        res.status(200).json({token, user});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

// export const otpLogin = async(req, res)=>{
//     try {
//         // const {phoneNumber} = req.body;
//         console.log("phoneNumber");
//         console.log(req.body);
//         let convert = Object.values(req.body);
//         let phoneNumber = convert.join("")
//         console.log(phoneNumber);
//         console.log("phoneNumber");

//         const user = await UserModel.otpLogin(phoneNumber);
//         const token = createToken(user._id);

//         res.cookie("jwt", token, ({
//             withCredentials: true,
//             httpOnly : false,
//             maxAge: maxAge * 1000
//         }));
//         res.status(200).json({user:user._id, created: true})
//     } catch (error) {
//         console.log(error);
//         const errors = handleErrors(error);
//         res.json({errors, created: false})
//     }
// }