'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PodcastSchema extends Schema {
  up () {
    this.create('podcasts', (table) => {
      table.increments()
      table
	      .integer('user_id')
	      .unsigned()
	      .notNullable()
	      .references('id')
	      .inTable('users')
	      .onDelete('cascade')
      table
	      .integer('category_id')
	      .unsigned()
	      .notNullable()
	      .references('id')
	      .inTable('categories')
      table.string('title').notNullable().unique()
      table.string('slug').notNullable()
      table.text('description').notNullable()
      table.string('logo')
      table.timestamps()
    })
  }

  down () {
    this.drop('podcasts')
  }
}

module.exports = PodcastSchema
