'use strict'

const {validate, validateAll} = use('Validator')
const User = use('App/Models/User')
const Token = use('App/Models/Token')
const randToken = require('rand-token')
const Encryption = use('Encryption')
const Event = use('Event')

class PasswordResetController {
  showLinkRequestForm ({view}) {
    return view.render('auth.passwords.email')
  }

  async sendResetLinkEmail ({ request, session, response}) {
    const validation = await validate(request.input('email'), {
      email: 'required|email'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    try {
      const user = await User.findBy('email', request.input('email'))

      await Token.query()
        .where('user_id', user.id)
        .where('type', 'password')
        .delete()

      const token = new Token()
      token.token = Encryption.encrypt(randToken.generate(16))
      token.type = 'password'

      await user.tokens().save(token)

      Event.fire('forgot::password', {
        user: user.toJSON(),
        token: token.token
      })

      session.flash({
        notification: {
          type: 'success',
          message: 'A password reset link has been sent to your email address.'
        }
      })

      return response.redirect('back')

    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Sorry, there is no user with this email address.'
        }
      })

      return response.redirect('back')
    }
  }

  showResetForm ({ view, params }) {
    return view.render('auth.passwords.reset', { token: params.token })
  }

  async reset ({ request, session, response }) {
    const validation = await validateAll(request.all(), {
      token: 'required',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password', 'password_confirmation'])

      return response.redirect('back')
    }

    try {
      const token = await Token.query()
        .where('token', decodeURIComponent(request.input('token')))
        .where('type', 'password')
        .first()

        const user = await User.find(token.user_id)

        user.password = request.input('password')
        await user.save()

        await token.delete()

        Event.fire('password::reset', { user: user.toJSON() })

        session.flash({
          notification: {
            type: 'success',
            message: 'Your password has been reset!'
          }
        })

        return response.redirect('/login')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Invalid password reset token.'
        }
      })

      return response.redirect('back')
    }
  }
}

module.exports = PasswordResetController
