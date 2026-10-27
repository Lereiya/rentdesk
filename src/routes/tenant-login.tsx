import { createFileRoute } from "@tanstack/react-router";
import { LoginCard } from "@/components/LoginCard";

export const Route = createFileRoute("/tenant-login")({
  head: () => ({
    meta: [
      { title: "Tenant sign-in | RentDesk" },
      {
        name: "description",
        content: "Sign in to see your rent and water arrears, payments, documents and notices.",
      },
      { property: "og:title", content: "Tenant sign-in | RentDesk" },
      { property: "og:description", content: "Separate sign-in for tenants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LoginCard portal="tenant" />,
});
