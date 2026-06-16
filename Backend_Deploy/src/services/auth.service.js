const User = require("../models/user.model");
const crypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const authService = async (password, email) => {
  try {
    const user = await User.findOne({ email });

    //Si no existe el user, devolver error
    if (!user) {
      return { statusCode: 404, message: "User not found" };
    }

    // Comparamos los password (Crypt)
    const validatedPassword = crypt.compareSync(password, user.password);

    // Si no existe equivalencia => error
    if (!validatedPassword) {
      return { statusCode: 401, message: "Invalid password" };
    }

    // Generar el token para el autologin temporal
    const token = generateJWT({
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.username,
      perfil: user.typePerfil,
      age: user.age,
    });
    console.log(token);
    return {
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        perfil: user.typePerfil || null,
      },
    };
  } catch (error) {
    return { statusCode: 500, message: "Ocurrio un error" };
  }
};

const authServiceByMiddelware = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        statusCode: 404,
        payload: { message: "Usuario no encontrado" },
      };
    }

    const payload = {
      _id: user._id,
      name: user.username,
      email: user.email,
      perfil: user.typePerfil,
      message: "Sesión activa",
    };    

    return {
      statusCode: 200,
      payload,
    };
  } catch (error) {
    return {
      statusCode: 500,
      payload: { message: "Error al recuperar sesión" },
    };
  }
};

module.exports = {
  authService,
  authServiceByMiddelware,
};
