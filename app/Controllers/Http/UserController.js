'use strict'

const { validateAll} = use('Validator')
const Hash = use('Hash')

class UserController {
  async myPodcast ({ view, auth }) {
    const podcast = await auth.user.podcast().fetch()

    return view.render('users.my_podcast', { podcast })
  }

  showEditAccount ({ view }) {
    return view.render('users.account')
  }

  async updateAccount ({ request, auth, session, response }) {
    const data = request.only(['name', 'email'])

    const validation = await validateAll(data, {
      name: 'required',
      email: `required|email|unique:users,email,id,${auth.user.id}`
    })

    if (validation.fails()) {
      session.withError(validation.messages()).flashAll()

      return response.redirect('back')
    }

    auth.user.merge(data)
    await auth.user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Account updated!'
      }
    })

    return response.redirect('back')
  }

  showChangePassword ({ view }) {
    return view.render('users.password')
  }

  async updatePassword ({ request, response, session, auth }) {
    const data = request.only([
      'current_password',
      'new_password',
      'new_password_confirmation'
    ])

    const validation = await validateAll(data, {
      current_password: 'required',
      new_password: 'required|confirmed'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())
        .flashExcept([
          'current_password',
          'new_password',
          'new_password_confirmation'
        ])

      return response.redirect('back')
    }

    const verifyPassword = await Hash.verify(
      data.current_password,
      auth.user.password
    )

    if (!verifyPassword) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Current password could not be verified! Please try again.'
        }
      })

      return response.redirect('back')
    }

    auth.user.password = data.new_password
    await auth.user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Password changed!'
      }
    })

    return response.redirect('back')
  }
}

module.exports = UserController
