import { handleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/strpe";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
    console.log("event", event.type);
    switch(event.type){
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }
    return Response.json("OK", { status: 200 });
  } catch (err: any) {
    console.log("Webhook Error", err);
    return Response.json(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
