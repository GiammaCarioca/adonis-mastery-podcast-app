'use strict'

class LoginController {
  showLogin ({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, response, session }) {
    const { email, password, remember } = request.all()

    try {
      await auth.remember(!!remember).attempt(email, password)

      return response.route('home')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: `We couldn't verify your credentials.`
        }
      })

      return response.redirect('back')
    }
  }
}

module.exports = LoginController
