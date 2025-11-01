const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { fullName, email, cpf, dateOfBirth, password } = req.body;

        if (!fullName || !email || !cpf || !dateOfBirth || !password) {
            return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });
        if (existingUser) return res.status(400).json({ msg: 'Email ou CPF já cadastrado.' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            email,
            cpf,
            dateOfBirth,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            msg: 'Usuário registrado com sucesso!',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Por favor, forneça email e senha.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Credenciais inválidas.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciais inválidas.' });

        const payload = { user: { id: user._id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor')
    }
};
