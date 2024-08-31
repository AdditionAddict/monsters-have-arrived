import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from "@remix-run/react";
import Navbar from '~/components/navbar';
import { Button } from "~/components/ui/button";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Survival Hub</h1>
        <SignedIn>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Explore No-Go Areas</h2>
            <p className="mb-4">Stay informed about dangerous locations and plan your survival strategy.</p>
            <Link to="/no-go-areas">
              <Button size="lg">View No-Go Areas</Button>
            </Link>
          </div>
        </SignedIn>
        <SignedOut>
          <p className="mt-4">Sign up or log in to access exclusive survival information.</p>
        </SignedOut>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          © 2024 Survival Hub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}