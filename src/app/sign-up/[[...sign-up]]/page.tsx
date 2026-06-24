import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
            Foreman
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Set up access to your Foreman owner dashboard.
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/calls"
        />
      </div>
    </main>
  );
}
