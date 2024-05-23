const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password, dob } = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(401).json({
                "message": "User already exists. Login instead."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            dob,
        });

        await newUser.save();

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRETKEY, {expiresIn: '2d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });

        res.status(201).json({
            message: "User created successfully!",
            user: newUser,
            token: token,
        });
    }
    catch(error) {
        console.log(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({username});
        if(!user) {
            res.status(401).json({
                "message": "User does not exist. Register instead."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            res.status(401).json({
                "message": "Invalid username or password"
            });
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRETKEY, {expiresIn: '2d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });

        res.status(201).json({
            message: "User created successfully!",
            user: user,
            token: token,
        });
    }
    catch(error) {
        console.log(error);
        res.status(501).json({
            "message": "Internal Server Error",
            "Error: ": error
        });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error logging out: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}