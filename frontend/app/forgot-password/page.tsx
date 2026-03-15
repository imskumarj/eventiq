"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await resetPassword(email);

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-foreground" />
          </div>

          <span className="text-xl font-bold">EventIQ</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-success" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Check your email</h2>

            <p className="text-muted-foreground mb-6">
              We sent a password reset link to {email}
            </p>

            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Reset your password</h2>

            <p className="text-muted-foreground mb-8">
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 gradient-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="text-accent font-medium hover:underline gap-1 inline-flex items-center"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to login
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}