import { createFileRoute } from "@tanstack/react-router";
import { LoginCard } from "@/components/LoginCard";

export const Route = createFileRoute("/caretaker-login")({
  head: () => ({
    meta: [
      { title: "Caretaker sign-in | RentDesk" },
      { name: "description", content: "Sign in to the RentDesk caretaker portal." },
      { property: "og:title", content: "Caretaker sign-in | RentDesk" },
      {
        property: "og:description",
        content: "Separate sign-in for property caretakers and agents.",
      },
    ],
  }),
  component: () => <LoginCard portal="caretaker" />,
});
