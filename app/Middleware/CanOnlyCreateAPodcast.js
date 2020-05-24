'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CanOnlyCreateAPodcast {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth, session }, next) {
    const userPodcast = await auth.user.podcast().fetch()

    if (userPodcast) {
      session.flash({
        notification: {
          type: 'danger',
          message: `You've already created a podcast, you can only create one.`
        }
      })

      return response.route('myPodcast')
    }

    await next()
  }
}

module.exports = CanOnlyCreateAPodcast
