import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin(.*)",
  "/hvac",
  "/plumbing",
  "/electrical",
  "/restoration",
  "/property-management",
  "/roofing",
  "/pest",
  "/garage",
  "/law-firm",
  "/privacy",
  "/terms",
  "/about",
  "/contact",
  "/videos(.*)",
  "/images(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg|mp3|wav|mov)).*)",
    "/(api|trpc)(.*)",
  ],
};
