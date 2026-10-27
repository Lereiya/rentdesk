import { createFileRoute } from "@tanstack/react-router";
import { LoginCard } from "@/components/LoginCard";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | RentDesk" },
      { name: "description", content: "Sign in to your RentDesk landlord or tenant account." },
      { property: "og:title", content: "Sign in | RentDesk" },
      { property: "og:description", content: "Landlord and tenant sign-in." },
    ],
  }),
  component: () => <LoginCard portal="landlord" />,
});
