"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  vendor: {
    name: string
  }
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/products${category ? `?category=${category}` : ""}`)
      const data = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [category])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Product Catalog</h1>
      <div className="mb-4">
        <label htmlFor="category" className="mr-2">
          Filter by category:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border p-2"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-lg border shadow-lg">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={200}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>
              <p className="mb-2 text-gray-600">{product.description}</p>
              <p className="mb-2 text-lg font-bold">${product.price.toFixed(2)}</p>
              <p className="mb-2 text-sm text-gray-500">Vendor: {product.vendor.name}</p>
              <Link
                href={`/products/${product.id}`}
                className="mt-2 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

