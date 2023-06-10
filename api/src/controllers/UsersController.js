const knex = require("../database");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Please, fill in all fields.");
    }

    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("This e-mail already exists.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    user.name = name ?? user.name;

    if (password && !old_password) {
      throw new AppError(
        "You need to provide your old password to set a new password.",
      );
    }


    if (!password && old_password) {
      throw new AppError(
        "Provide your new password.",
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("The old password is incorrect.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").where({ id: user_id }).update(user);

    return response.json();
  }
}

module.exports = UsersController;