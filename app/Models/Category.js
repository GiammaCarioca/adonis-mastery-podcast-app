'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  podcasts () {
    return this.hasMany('App/Models/Podcast')
  }
}

module.exports = Category
