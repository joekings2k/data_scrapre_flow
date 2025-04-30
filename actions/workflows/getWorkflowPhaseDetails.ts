"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getWorkflowPhaseDetails(phaseId:string) {
  console.log(phaseId)
  const {userId} = auth()
  if(!userId){
    throw new Error("Unauthenticated");
  }
 
  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,

      // @ts-ignore
      execution: {
        userId,
      },
    },
  });
}