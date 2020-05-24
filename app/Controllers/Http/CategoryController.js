'use strict'

const Category = use('App/Models/Category')

class CategoryController {
  async show ({ params, view, request }) {
    const category = await Category.findByOrFail('slug', params.slug)
    const podcasts =  await category
      .podcasts()
      .orderBy('id', 'desc')
      .paginate(Number(request.input('page', 1)), 1)
    const categories = await Category.query().withCount('podcasts').fetch()

    return view.render('categories.show', {
      category: category.toJSON(),
      podcasts: podcasts.toJSON(),
      categories: categories.toJSON(),
    })
  }
}

module.exports = CategoryController
