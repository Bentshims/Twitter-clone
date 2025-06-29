import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Tweet from './tweet.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Notification from './notification.js'
import Like from './like.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare userName: string

  @column()
  declare profilLink: string | null

  @column()
  declare bio: string

  @column()
  declare birthDate: Date

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  // les followings ou les gens que je suis
  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'follower_id',
    pivotRelatedForeignKey: 'following_id', 
  })
  declare following: ManyToMany<typeof User>

  // les followers ou les gens qui me suivent
  @manyToMany(() => User, {
    pivotTable: 'follows',
    pivotForeignKey: 'following_id',
    pivotRelatedForeignKey: 'follower_id',
  })
  declare follower: ManyToMany<typeof User>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany( ()=> Like)
  declare like: HasMany<typeof Like>

  @manyToMany(()=> Tweet,{
    pivotTable: 'likes',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'tweet_id'

  })
  declare tweet: ManyToMany<typeof Tweet>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
