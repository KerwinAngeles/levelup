const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Award = require('../Models/Award');

// create account
exports.register = async(req, res) => {
    const {username, email, password, firstname, lastname} = req.body;
    try{
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if(existingUser) {
            if(existingUser.username === username) {
                return res.status(400).json({msg: 'El nombre de usuario ya está en uso'});
            }
            if(existingUser.email === email) {
                return res.status(400).json({msg: 'El correo electrónico ya está registrado'});
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname,
            xp: 0,
            level: 1
        };

        if (req.file) {
            userData.profileImage = req.file.filename;
        }

        const newUser = await User.create(userData);
        res.status(201).json({msg: 'User created successfully'});
    }catch(e){
        console.error('Registration error:', e);
        res.status(500).json({error: e.message});
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({where: {username}});
        if(!user) return res.status(400).json({msg:'Usuario no encontrado'});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({msg: 'Contraseña incorrecta'});

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({
            token, 
            user:{
                id: user.id, 
                username: user.username, 
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                level: user.level,
                xp: user.xp,
                profileImage: user.profileImage
            }
        });

    }catch(e){
        res.status(500).json({error: e.message});
    }
};


