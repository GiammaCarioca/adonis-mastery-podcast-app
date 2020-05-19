'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Episode extends Model {
  podcast () {
    return this.belongsTo('App/Models/Podcast')
  }
}

module.exports = Episode
