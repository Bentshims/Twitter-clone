import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import User from './user.js'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userOneId: number

  @column()
  declare userTwoId: number

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @belongsTo(() => User, { foreignKey: 'userOneId' })
  declare userOne: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'userTwoId' })
  declare userTwo: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}