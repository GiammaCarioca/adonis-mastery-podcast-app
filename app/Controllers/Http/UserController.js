'use strict'

const { validateAll} = use('Validator')

class UserController {
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
}

module.exports = UserController
