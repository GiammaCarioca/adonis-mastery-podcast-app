'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscriptionSchema extends Schema {
  up () {
    this.create('subscriptions', (table) => {
      table.increments()
      table
	      .integer('user_id')
	      .unsigned()
	      .notNullable()
	      .references('id')
	      .inTable('users')
	      .onDelete('cascade')
      table
	      .integer('podcast_id')
	      .unsigned()
	      .notNullable()
	      .references('id')
	      .inTable('podcasts')
	      .onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('subscriptions')
  }
}

module.exports = SubscriptionSchema
