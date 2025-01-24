import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"
import prisma from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { items, userId } = req.body

      const lineItems = await Promise.all(
        items.map(async (item: { id: string; quantity: number }) => {
          const product = await prisma.product.findUnique({
            where: { id: item.id },
          })

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: product!.name,
                images: [product!.image],
              },
              unit_amount: Math.round(product!.price * 100),
            },
            quantity: item.quantity,
          }
        }),
      )

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
        metadata: {
          userId,
        },
      })

      res.status(200).json({ sessionId: session.id })
    } catch (error) {
      res.status(500).json({ message: "Error creating checkout session", error })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

