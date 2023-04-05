import jwt from "jsonwebtoken";

export const login = async(req, res)=>{
    try {
        console.log("reached admin auth")
        const {email, password} = req.body;
        console.log(req.body);
        console.log("process.env.ADMIN_EMAIL")
        console.log(process.env.ADMIN_EMAIL)
        console.log("process.env.ADMIN_EMAIL")
        const admin = email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD
        if(!admin) return res.status(400).json({msg: "user not found"});
    
        // const isMatch = await bcrypt.compare(password, user.password);
        // if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
    
        const adminToken = jwt.sign({id: password}, process.env.ADMIN_JWT_SECRET);
        // delete user.password;
        console.log(admin);
        console.log("token" + adminToken);
        res.status(200).json({adminToken, admin});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message})
    }
}

