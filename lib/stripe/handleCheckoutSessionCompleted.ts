import { getCreditsPack, PackId } from "@/types/billing";

import { writeFile } from "fs";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("missing metadata");
  }
  const { userId, packId } = event.metadata;
  if (!userId || !packId) {
    throw new Error("missing userId or packId in metadata");
  }
  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Pack not found");
  }
  await prisma.userBalance.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });
  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      desciption:`${purchasedPack.name}-${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
}
