'use strict'

const Category = use('App/Models/Category')
const Podcast = use('App/Models/Podcast')
const Helpers = use('Helpers')
const { v4: uuidv4 } = require('uuid')

class PodcastController {
  async create ({ view }) {
    const categories = await Category.pair('id', 'name')

    return view.render('podcasts.create', { categories })
  }

  async store ({ request, response, auth, session }) {
    const user = auth.user

    const logo = await this._processLogoUpload(request)

    if (!logo.moved()) {
      session.flash({
        notification: {
          type: 'danger',
          message: logo.error().message
        }
      })

      return response.redirect('back')
    }

    const podcast = new Podcast()

    podcast.title = request.input('title')
    podcast.category_id = request.input('category_id')
    podcast.description = request.input('description')
    podcast.logo = `uploads/logo/${logo.fileName}`

    await user.podcast().save(podcast)

    session.flash({
      notification: {
        type: 'success',
        message: 'Podcast created!'
      }
    })

    return response.route('myPodcast')
  }

  async show ({ params, view, request }) {
    const podcast = await Podcast.query()
      .where('slug', params.slug)
      .with('podcaster')
      .first()

    return view.render('podcasts.show', { podcast: podcast.toJSON() })
  }

  async edit ({ view, params }) {
    const podcast = await Podcast.findOrFail(params.id)
    const categories = await Category.pair('id', 'name')

    return view.render('podcasts.edit', { podcast, categories })
  }

  async update ({ params, request, response, session }) {
    const data = request.only(['title', 'category_id', 'description'])
    const podcast = await Podcast.findOrFail(params.id)

    if (request.file('logo').size > 0) {
      // logo has been uploaded

      const logo = await this._processLogoUpload(request)

      if (!logo.moved()) {
        session.flash({
          notification: {
            type: 'danger',
            message: logo.error().message
          }
        })

        return response.redirect('back')
      }

      podcast.logo = `uploads/logo/${logo.fileName}`
    }

    podcast.title = data.title
    podcast.category_id = data.category_id
    podcast.description = data.description

    await podcast.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Podcast updated!'
      }
    })

    return response.route('myPodcast')
  }

  async destroy ({ params, response, session, auth }) {
    const podcast = await Podcast.find(params.id)

    if (auth.user.id !== podcast.user_id) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'You can only delete your own podcast.'
        }
      })

      return response.route('myPodcast')
    }

    await podcast.delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'Podcast deleted!'
      }
    })

    return response.route('myPodcast')
  }

  async _processLogoUpload (request) {
    const logo = request.file('logo', {
      types: ['image'],
      size: '2mb'
    })

    await logo.move(Helpers.publicPath('uploads/logos'), {
      name: `${uuidv4()}.${logo.subtype}`
    })

    return logo
  }
}

module.exports = PodcastController
