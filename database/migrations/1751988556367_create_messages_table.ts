import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('conversation_id')
        .unsigned()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')

      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.text('content').notNullable()
      table.boolean('is_read').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
