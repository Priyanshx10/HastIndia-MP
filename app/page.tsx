import Image from "next/image"
import Link from "next/link"
import prisma from "@/lib/prisma"

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    include: {
      vendor: {
        select: {
          name: true,
        },
      },
    },
  })
  return products
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Welcome to Multivender Marketplace</h1>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Featured Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="overflow-hidden rounded-lg border shadow-lg">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={200}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>
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
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Why Choose Us?</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">Wide Selection</h3>
            <p>Browse through a diverse range of products from multiple vendors.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">Quality Assurance</h3>
            <p>We ensure all our vendors meet high-quality standards.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
            <p>Shop with confidence using our secure payment gateway.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

