import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(3).maxLength(100),
      userName: vine.string().trim().alphaNumeric().minLength(3).maxLength(30),
      email: vine.string().trim().email(),
      password: vine.string().minLength(8),
      birthDate: vine.date().before('2010-12-31'),
      bio: vine.string().maxLength(250).optional(),
    })
)

export const loginvalidator = vine.compile(
    vine.object({
        email : vine.string().email().minLength(10).maxLength(50),
        password : vine.string().minLength(8)
    })
)