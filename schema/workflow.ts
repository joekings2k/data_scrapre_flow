import {z} from "zod"

export const createWorkflowSchema = z.object({
  name:z.string().min(1,"Name is required").max(100,"Name is too long"),
  description:z.string().optional(),
  // definition:z.string().min(1,"Definition is required"),
  // status:z.string().min(1,"Status is required"),
})

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>


export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId:z.string()
})

export type DuplicateWorkflowSchemaType = z.infer<typeof duplicateWorkflowSchema>