import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData as useRemixLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useState } from "react";
import "./tailwind.css";

type LoaderData = {
  ENV: {
    CONVEX_URL: string;
    CLERK_PUBLISHABLE_KEY: string;
  };
};

function useLoaderData<T = unknown>(): T {
  return useRemixLoaderData() as T;
}

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, async () => {
    const convexUrl = process.env.CONVEX_URL;
    const clerkPubKey = process.env.CLERK_PUBLISHABLE_KEY;

    if (!convexUrl) {
      throw new Error("Missing CONVEX_URL");
    }

    if (!clerkPubKey) {
      throw new Error("Missing CLERK_PUBLISHABLE_KEY");
    }

    return json({
      ENV: {
        CONVEX_URL: convexUrl,
        CLERK_PUBLISHABLE_KEY: clerkPubKey
      },
    } satisfies LoaderData);
  });
};

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<LoaderData>();
  const convexUrl = data.ENV.CONVEX_URL;
  const clerkPubKey = data.ENV.CLERK_PUBLISHABLE_KEY;
  
  const [convex] = useState(() => new ConvexReactClient(convexUrl));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ClerkProvider publishableKey={clerkPubKey}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}
          >
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
      <Outlet />
  );
}

export default App;

export { ErrorBoundary };
