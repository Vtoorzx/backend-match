const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { fullName, email, cpf, dateOfBirth, password } = req.body;

    // Verifica se todos os campos foram preenchidos
    if (!fullName || !email || !cpf || !dateOfBirth || !password) {
      return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
    }

    // Verifica se já existe usuário com o mesmo email ou CPF
    const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email ou CPF já cadastrado.' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria novo usuário
    const user = new User({
      fullName,
      email,
      cpf,
      dateOfBirth,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      msg: 'Usuário registrado com sucesso!',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error('❌ Erro ao registrar usuário:', err.message);
    res.status(500).send('Erro interno no servidor');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ msg: 'Por favor, forneça email e senha.' });
    }

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    // Compara a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    // Cria o token JWT
    const payload = { user: { id: user._id } };

    // Verifica se a variável JWT_SECRET existe (evita erro no Render)
    if (!process.env.JWT_SECRET) {
      console.error('⚠️ A variável JWT_SECRET não está configurada no ambiente Render!');
      return res.status(500).json({ msg: 'Erro na configuração do servidor.' });
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' }, // aumenta o tempo de expiração se quiser
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('❌ Erro ao fazer login:', err.message);
    res.status(500).send('Erro interno no servidor');
  }
};
