import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import { hash } from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body

    try {
      const hashedPassword = await hash(password, 10)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      })

      res.status(201).json({ message: "User created successfully", user })
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

