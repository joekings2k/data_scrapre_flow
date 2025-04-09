'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({id,definition}:{id:string,definition:string}) {
  const {userId}= auth()
  if(!userId){
    throw new Error("Unauthenticated")
  }
  const workflow = await prisma.workflow.findUnique({
    where:{
      id,
      userId
    }
  })
  if(!workflow){
    throw new Error("Workflow not found")
  }
  if(workflow.status !== "DRAFT"){
    throw new Error("Work flow is not a draft")
  }
  await prisma.workflow.update({
    where:{
      id,
      userId
    },
    data:{
      definition
    }
  })
  revalidatePath(`/workflows`)
}