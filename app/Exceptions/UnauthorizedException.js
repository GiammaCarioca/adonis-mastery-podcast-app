'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UnauthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  async handle (error, { response, session }) {
    session.flash({
      notification: {
        type: 'danger',
        message: error.message
      }
    })

    await session.commit()

    return response.route('myPodcast')
  }
}

module.exports = UnauthorizedException
