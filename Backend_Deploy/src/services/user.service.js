const User = require("../models/user.model");
const crypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getUserByUsernameService = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return { error: true, message: "Usuario no encontrado", statusCode: 404 };
    }

    const { email, age } = user;

    return {
      username,
      email,
      age,
    };
  } catch (error) {
    return { message: "Ocurrio un error", statusCode: 500 };
  }
};

const createUserService = async (user) => {
  try {
    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) {
      return { message: "El nombre de usuario ya existe", statusCode: 409 };
    }

    if (!user.password) {
      return { message: "La contraseña es obligatoria", statusCode: 400 };
    }

    const encodedPassword = crypt.hashSync(user.password, 10);
    const newUser = new User({ ...user, password: encodedPassword });

    const savedUser = await newUser.save();

    const token = generateJWT({
      _id: savedUser._id,
      username: savedUser.username,
      name: savedUser.name,
      email: savedUser.email,
      perfil: savedUser.typePerfil,
      age: savedUser.age,
    });

    return {
      message: "Usuario creado con éxito",
      statusCode: 201,
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
        email: savedUser.email,
        typePerfil: savedUser.typePerfil,
        age: savedUser.age,
      },
    };

  } catch (error) {
    return { message: "Ocurrió un error", statusCode: 500 };
  }
};

const editUserByUsernameService = async (username, updates) => {
  try {
    if (updates.password) {
      updates.password = crypt.hashSync(updates.password, 10);
    }
    if (updates.password && updates.password.trim() === "") {
      delete updates.password;
    }

    const updatedUser = await User.findOneAndUpdate({ username }, updates, {
      new: true,
    });

    if (!updatedUser) {
      return { message: "Usuario no encontrado", statusCode: 404 };
    }

    const newToken = generateJWT({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      perfil: updatedUser.typePerfil,
      age: updatedUser.age,
    });

    return {
      message: "Usuario actualizado con éxito",
      statusCode: 200,
      token: newToken,
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        age: updatedUser.age,
        name: updatedUser.name,
        typePerfil: updatedUser.typePerfil,
      },
    };
  } catch (error) {
    return {
      message: "Ocurrió un error",
      statusCode: 500,
      details: error.message,
    };
  }
};

const assignProfileService = async (email, perfil) => {
  try {
    if (!email || !perfil) {
      console.log(email, perfil);
      console.warn("Datos incompletos:", { email, perfil });
      return {
        statusCode: 400,
        error: "Datos incompletos",
      };
    }

    const user = await User.findOneAndUpdate(
      { email },
      { typePerfil: perfil },
      { new: true }
    );

    if (!user) {
      console.warn("Usuario no encontrado con email:", email);
      return {
        statusCode: 404,
        error: "Usuario no encontrado",
      };
    }

    console.log("Usuario actualizado:", user);

    if (!user.username || !user.email || !user.typePerfil) {
      console.error("Campos faltantes en usuario:", {
        username: user.username,
        email: user.email,
        typePerfil: user.typePerfil,
      });
      return {
        statusCode: 500,
        error: "Usuario incompleto para generar token",
      };
    }

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY no definida en entorno");
      return {
        statusCode: 500,
        error: "Clave secreta no definida",
      };
    }

    let token;
    try {
      token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          age: user.age,
          name: user.username,
          email: user.email,
          perfil: user.typePerfil,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      console.log("Token generado correctamente");
    } catch (err) {
      console.error("Error al generar token:", err);
      return {
        statusCode: 500,
        error: "Falló la generación del token",
        details: err.message,
      };
    }

    return {
      statusCode: 200,
      message: "Perfil actualizado con éxito",
      typePerfil: user.typePerfil,
      token,
      user,
    };
  } catch (error) {
    console.error("Error interno en assignProfileService:", error);
    return {
      statusCode: 500,
      error: "Error interno",
      details: error.message,
    };
  }
};

const deleteUserByIdService = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return { message: "Usuario no encontrado", statusCode: 404 };
    }
    return { message: "Usuario eliminado con éxito", statusCode: 200 };
  } catch (error) {
    return {
      message: "Ocurrió un error",
      statusCode: 500,
      details: error.message,
    };
  }
};


module.exports = {
  getUserByUsernameService,
  createUserService,
  editUserByUsernameService,
  deleteUserByIdService,
  assignProfileService,
};
