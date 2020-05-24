'use strict'

const Podcast = use('App/Models/Podcast')
const Episode = use('App/Models/Episode')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Event = use('Event')

class EpisodeController {
  async create ({ view, params }) {
    const podcast = await Podcast.findByOrFail('slug', params.slug)

    return view.render('episodes.create', { podcast: podcast.toJSON() })
  }

  async store ({ request, response, auth, session }) {
    const validation = await validateAll(request.all(), {
      podcast_id: 'required',
      title: 'required',
      summary: 'required',
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const podcast = await Podcast.query()
      .where('id', request.input('podcast_id'))
      .withCount('episodes')
      .first()

    const audio = request.file('audio', { type: ['mp3'] })
    await audio.move(Helpers.publicPath('uploads/audios'), {
      name: `${podcast.slug}_${podcast.episodes_count + 1}.${audio.subtype}`
    })

    if (!audio.moved()) {
      session.flash({
        notification: {
          type: 'danger',
          message: audio.error().message
        }
      })

      return response.redirect('back')
    }

    const episode = new Episode()
    episode.title = request.input('title')
    episode.summary = request.input('summary')
    episode.user_id = auth.user.id
    episode.audio = `uploads/audios/${audio.fileName}`

    await podcast.episodes().save(episode)

    const subscribers = await podcast.subscribers().fetch()

    if (subscribers.toJSON().length > 0) {
      Event.fire('new::episode', {
        podcast,
        subscribers: subscribers.toJSON()
      })
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'Episode uploaded!'
      }
    })

    return response.route('myPodcast')
  }
}

module.exports = EpisodeController
