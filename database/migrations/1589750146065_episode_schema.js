'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EpisodeSchema extends Schema {
  up () {
    this.create('episodes', (table) => {
      table.increments()
       table
	      .integer('podcast_id')
	      .unsigned()
	      .notNullable()
	      .references('id')
	      .inTable('podcasts')
	      .onDelete('cascade')
      table
	      .integer('user_id')
	      .unsigned()
	      .notNullable()
      table.string('title').notNullable().unique()
      table.string('audio').notNullable()
      table.text('summary').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('episodes')
  }
}

module.exports = EpisodeSchema
