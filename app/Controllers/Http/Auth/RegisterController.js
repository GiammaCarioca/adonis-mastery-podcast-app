'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')

class RegisterController {
  showRegister ({ view }) {
    return view.render('auth.register')
  }

  async register ({ request, response, auth, session }) {
    const userData = request.only(['name', 'email', 'password'])

    const rules = {
      name: 'required',
      email: 'required|email|unique:users,email',
      password: 'required'
    }

    const validation = await validateAll(userData, rules)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password'])

      return response.redirect('back')
    }

    const user = await User.create(userData)

    await auth.login(user)

    return response.route('home')
  }
}

module.exports = RegisterController
