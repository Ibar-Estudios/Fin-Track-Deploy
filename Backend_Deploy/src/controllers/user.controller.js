const {
  getUserByUsernameService,
  createUserService,
  editUserByUsernameService,
  deleteUserByIdService,
  assignProfileService,
} = require("../services/user.service");

// OBTENER EL USUARIO POR NOMBRE DE USUARIO
const getUserByUsernameController = async (request, response) => {
  const { username } = request.params;
  const user = await getUserByUsernameService(username);
  response.status(user.statusCode || 200).json(user);
};

// CREAR EL USUARIO 
const createUserController = async (request, response) => {
  const newUser = request.body;
  const user = await createUserService(newUser);
  response.status(user.statusCode || 500).json(user);
};

// EDITAR EL USUARIO
const editUserByUsernameController = async (request, response) => {
  const { username } = request.params;
  const updates = request.body;
  const user = await editUserByUsernameService(username, updates);
  response.status(user.statusCode || 500).json(user);
};

// ELIMINAR EL USUARIO 
const deleteUserByIdController = async (request, response) => {
  const { id } = request.params;
  const result = await deleteUserByIdService(id);
  response.status(result.statusCode || 500).json(result);
};

// ASIGNACION DE PERFIL DEL USUARIO
const assignProfileController = async (request, response) => {
  const { email, perfil } = request.body;
  const result = await assignProfileService(email, perfil);
  response.status(result.statusCode || 500).json(result);
};




module.exports = {
  getUserByUsernameController,
  createUserController,
  editUserByUsernameController,
  deleteUserByIdController,
  assignProfileController,
};
