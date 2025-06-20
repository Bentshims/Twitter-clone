import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Follow extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(()=> User, {foreignKey :'following_id'})
  declare following: BelongsTo <typeof User>

  @belongsTo( ()=> User, {foreignKey:'follower_id'})
  declare follower : BelongsTo <typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}