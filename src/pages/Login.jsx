import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { LogIn } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <AuthLayout
        icon={LogIn}
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
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <a href="/register" className="text-primary font-medium hover:underline">
          Don't have an account? Create one
        </a>
      }
    >
      <SignIn 
        signUpUrl="/register"
        redirectUrl="/"
      />
    </AuthLayout>
  );
}
