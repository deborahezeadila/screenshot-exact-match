import { createFileRoute, redirect } from "@tanstack/react-router";
import { serviceRedirectTarget } from "@/lib/work-categories";

export const Route = createFileRoute("/shopify-services/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ ...serviceRedirectTarget(params.slug), statusCode: 301 });
  },
});
