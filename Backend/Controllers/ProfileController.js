const User = require('../Models/User');
const path = require('path');
const fs = require('fs');
const Rank = require('../Models/Rank');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'level', 'xp', 'profileImage', 'createdAt'],
            include: [{
                model: Rank,
                attributes: ['name']
            }]
        });
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

exports.editProfile = async(req, res) => {
    try {
        const { username, email, firstname, lastname } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) return res.status(400).json({ msg: 'El nombre de usuario ya está en uso' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ msg: 'El email ya está en uso' });
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;

        if (req.file) {
            if(user.profileImage){
                const oldImagePath = path.join(__dirname, '..', 'uploads', user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.profileImage = req.file.filename;
        }

        await User.update(updateData, { where: { id: userId } });

        const updatedUser = await User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'firstname', 'lastname', 'level', 'xp', 'profileImage', 'createdAt']
        });

        res.json({
            msg: 'Perfil actualizado exitosamente',
            user: updatedUser
        });
    } catch (e) {
        res.status(500).json({ msg: 'Error al actualizar el perfil', error: error.message });
    }
}