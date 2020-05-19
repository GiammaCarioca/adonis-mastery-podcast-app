'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Podcast extends Model {
  podcaster () {
    return this.belongsTo('App/Models/User')
  }

  episodes () {
    return this.hasMany('App/Models/Episode')
  }

  category () {
    return this.belongsTo('App/Models/Category')
  }

  subscribers () {
    return this.belongsToMany('App/Models/User')
	    .pivotTable('subscriptions')
	    .withTimestamps()
  }
}

module.exports = Podcast
