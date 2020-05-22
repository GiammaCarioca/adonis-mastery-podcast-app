"use strict";

const Podcast = use("App/Models/Podcast")

class HomeController {
  async index({ view }) {
    const podcasts = await Podcast
      .query()
      .orderBy('id', 'desc')
      .with('category')
      .fetch()

    return view.render('home', { podcasts: podcasts.toJSON() })
  }
}

module.exports = HomeController;
