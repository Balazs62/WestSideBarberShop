import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <AuthLayout
        icon={UserPlus}
        title="Authentication Not Configured"
        subtitle="Please add your Clerk API keys to the .env file"
      >
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="text-sm">To enable authentication, add these environment variables to your .env file:</p>
          <pre className="mt-2 text-xs bg-background p-2 rounded">
            VITE_CLERK_PUBLISHABLE_KEY=your-key
            CLERK_SECRET_KEY=your-secret
          </pre>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <a href="/login" className="text-primary font-medium hover:underline">
          Already have an account? Log in
        </a>
      }
    >
      <SignUp 
        signInUrl="/login"
        redirectUrl="/"
      />
    </AuthLayout>
  );
}
