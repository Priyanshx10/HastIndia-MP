"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Multivender Marketplace
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-500">
            Products
          </Link>
          {session ? (
            <>
              {session.user.role === "VENDOR" && (
                <Link href="/vendor/dashboard" className="hover:text-blue-500">
                  Vendor Dashboard
                </Link>
              )}
              <button onClick={() => signOut()} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-blue-500">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

