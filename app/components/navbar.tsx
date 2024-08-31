import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function Navbar() {
  return (
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
  );
}
