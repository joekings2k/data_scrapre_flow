'use server'

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/strpe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function purchaseCredits(packId:PackId) {
  const {userId} =auth()
  if(!userId){
    throw new Error("Unauthenticated")
  }
  const selectedPack = getCreditsPack(packId)
  if(!selectedPack){
    throw new Error("Pack not found")
  }
  const priceId = selectedPack?.priceId;
  const session = await stripe.checkout.sessions.create({
    mode:"payment",
    invoice_creation:{
      enabled:true
    },
    success_url:getAppUrl("/billing"),
    cancel_url:getAppUrl("/billing"),
    line_items:[{
      price:selectedPack.priceId,
      quantity:1
    }],
    metadata:{
      userId,
      packId
    }
  })
  if (!session.url){
    throw new Error("Failed to create checkout session")
  }
  redirect(session.url)
}