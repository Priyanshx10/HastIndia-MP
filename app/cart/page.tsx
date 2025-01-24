"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    // In a real application, you would fetch the cart items from an API or local storage
    setCartItems([
      {
        id: "1",
        name: "Sample Product",
        price: 19.99,
        image: "https://via.placeholder.com/150",
        quantity: 2,
      },
    ])
  }, [])

  const handleCheckout = async () => {
    const stripe = await stripePromise

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        userId: session?.user?.id,
      }),
    })

    const { sessionId } = await response.json()

    const result = await stripe!.redirectToCheckout({
      sessionId,
    })

    if (result.error) {
      console.error(result.error.message)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="mb-4 flex items-center border-b pb-4">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} width={80} height={80} className="mr-4" />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
            <button onClick={handleCheckout} className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

