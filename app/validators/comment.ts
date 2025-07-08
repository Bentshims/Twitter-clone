import vine from '@vinejs/vine'
export const commentValidator = vine.compile(
  vine.object({
    content: vine.string().maxLength(255),
  })
)
