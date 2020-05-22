'use strict'

const Category = use('App/Models/Category')
const Podcast = use('App/Models/Podcast')
const Helpers = use('Helpers')
const { v4: uuidv4 } = require('uuid')

class PodcastController {
  async create ({ view }) {
    const categories = await Category.pair('id', 'name')

    // return categories

    return view.render('podcasts.create', { categories })
  }

  async store ({ request, response, auth, session }) {
    const user = auth.user

    const logo = request.file('logo', {
      types: ['image'],
      size: '2mb'
    })

    await logo.move(Helpers.publicPath('uploads/logos'), {
      name: `${uuidv4()}.${logo.subtype}`
    })

    if (!logo.moved()) {
      session.flash({
        notification: {
          type: danger,
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
}

module.exports = PodcastController
