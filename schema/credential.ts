import {z} from "zod"

export const createCredentialSchema = z.object({
  name:z.string().min(1,"Name is required").max(30,"Name is too long"),
  value:z.string().min(1,"Value is required").max(500,"Value is too long"),
})

export type CreateCredentialSchemaType = z.infer<typeof createCredentialSchema>