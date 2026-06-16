const { authService, authServiceByMiddelware } = require("../services/auth.service");

// LOGIN
const authController = async (request, response) => {
  const { password, email } = request.body;

  const login = await authService(password, email);

  if (login.statusCode && login.statusCode !== 200) {
    return response.status(login.statusCode).json({ message: login.message });
  }

  return response.status(200).json(login);
};

// LOGIN CON SESSION ABIERTA
const authControllerByMiddelware = async (request, response) => {
  const { email } = request.user;
  const { statusCode, payload } = await authServiceByMiddelware(email);
  response.status(statusCode).json(payload);
};

module.exports = {
  authController,
  authControllerByMiddelware,
};
