const express = require('express');
const userRouter = express.Router();
const {check} = require('express-validator')
const validateTypes = require('../utils/validateTypes')
const {getUserByUsernameController, createUserController, editUserByUsernameController, deleteUserByIdController, assignProfileController } = require('../controllers/user.controller');

// Obtener perfil
userRouter.get('/:username', getUserByUsernameController);

// Crear usuario
userRouter.post('/register',
   [ check("email").isEmail().withMessage("EL correo electronico no es válido."),
    check("age").isInt({min: 18}).withMessage("La edad debe ser de al menos 18 años"),
    check("password").isLength({min: 8, max: 20}).withMessage("La contraseña debe tener entre 8 y 20 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe tener al menos 1 digito.")],
    validateTypes,
     createUserController);

// Editar datos
userRouter.put('/:username', editUserByUsernameController);

// Eliminar cuenta
userRouter.delete('/:id', deleteUserByIdController);

userRouter.post('/evaluate-profile', assignProfileController);

module.exports = userRouter;