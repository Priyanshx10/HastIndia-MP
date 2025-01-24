import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { category } = req.query

    try {
      const products = await prisma.product.findMany({
        where: category ? { category: category as string } : {},
        include: {
          vendor: {
            select: {
              name: true,
            },
          },
        },
      })

      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

