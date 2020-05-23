'use strict'

const Podcast = use('App/Models/Podcast')

class SubscriptionController {
  async subscribe ({ request, auth, session, response }) {
    const podcast = await Podcast.findOrFail(request.input('podcast_id'))

    await auth.user.subscriptions().attach(podcast.id)

    session.flash({
      notification: {
        type: 'success',
        message: `You've been subscribed to this podcast.`
      }
    })

    return response.redirect('back')
  }
}

module.exports = SubscriptionController
