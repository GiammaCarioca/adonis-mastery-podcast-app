'use strict'

const Podcast = use('App/Models/Podcast')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class UpdatePodcast {
  async authorize () {
    const podcast = await Podcast.find(this.ctx.params.id)

    if (this.ctx.auth.user.id !== podcast.user_id) {
      throw new UnauthorizedException('You can only edit your own podcast.', 403)

      return false
    }

    return true
  }

  get validateAll() {
    return true
  }

  get rules () {
    return {
      title: 'required',
      category_id: 'required',
      description: 'required'
    }
  }
}

module.exports = UpdatePodcast
