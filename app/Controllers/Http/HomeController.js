"use strict";

const Podcast = use("App/Models/Podcast")

class HomeController {
  async index({ view, request }) {
    const podcasts = await Podcast
      .query()
      .orderBy('id', 'desc')
      .with('category')
      .paginate(Number(request.input('page', 1)), 1)

    return view.render('home', { podcasts: podcasts.toJSON() })
  }
}

module.exports = HomeController;
