import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/remix';
import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <Link to="/" className="text-xl font-bold">Survival Hub</Link>
            <div className="hidden md:flex items-center space-x-4">
              <SignedIn>
                <UserButton />
                <SignOutButton>
                  <Button variant="outline" size="sm">Sign out</Button>
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign up</Button>
                </SignUpButton>
              </SignedOut>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4">
                  <SignedIn>
                    <SignOutButton>
                      <Button variant="outline" size="sm">Sign out</Button>
                    </SignOutButton>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm">Sign in</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">Sign up</Button>
                    </SignUpButton>
                  </SignedOut>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>
      
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