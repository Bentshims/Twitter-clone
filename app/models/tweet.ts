import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Like from './like.js'
import Retweet from './retweet.js'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare content: string

  @column()
  declare media: string | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(()=> Like)
  declare likes: HasMany<typeof Like>

  @manyToMany(()=> User,{
    pivotTable: 'likes',
    pivotForeignKey: 'tweet_id',
    pivotRelatedForeignKey: 'user_id'
  })
  declare userlike: ManyToMany<typeof User>

  @hasMany(() => Retweet)
  declare retweets: HasMany<typeof Retweet>

  @manyToMany(() => User, {
    pivotTable: 'retweets',
    pivotForeignKey: 'tweet_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare retweetedBy: ManyToMany<typeof User>
  


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
