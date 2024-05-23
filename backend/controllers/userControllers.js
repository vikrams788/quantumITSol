const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateTokens } = require('../utils/tokenUtils');

exports.register = async (req, res) => {
    try {
        const { username, email, rememberMe, password, dob } = req.body;

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

        const { accessToken, refreshToken } = generateTokens(newUser._id);

        if (rememberMe) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            });
        }

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });

        res.status(201).json({
            message: "User created successfully!",
            user: newUser,
            token: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch(error) {
        console.log(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

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

        const { accessToken, refreshToken } = generateTokens(user._id);

        if (rememberMe) {
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            });
        }

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            expires: new Date(Date.now() + 10800000),
        });

        res.status(201).json({
            message: "User logged in successfully",
            user: user,
            token: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch(error) {
        res.status(501).json({
            "message": "Internal Server Error",
            "Error: ": error
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token' && 'refreshToken');
}