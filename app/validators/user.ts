import vine from '@vinejs/vine'

export const signupValidator = vine.compile(

vine.object({
    fullName : vine.string().minLength(3).maxLength(50),
    email : vine.string().email().minLength(10).maxLength(50),
    password : vine.string().minLength(8)
})
)

export const loginvalidator = vine.compile(
    vine.object({
        email : vine.string().email().minLength(10).maxLength(50),
        password : vine.string().minLength(8)
    })
)