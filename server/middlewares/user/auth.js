import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next)=>{
    try {
        let token = req.header("authorization");
        if(!token) return res.status(401).send("Access Denied");

        if(token.startsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.USER_JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}
