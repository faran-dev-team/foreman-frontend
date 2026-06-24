import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Foreman
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Owner sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your calls, booked jobs, and shop settings.
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/calls"
        />
      </div>
    </main>
  );
}
