"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, Users, Calendar } from "lucide-react";

const roles: {
  value: UserRole;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    value: "admin",
    label: "Admin",
    icon: <Shield className="w-4 h-4" />,
    desc: "Full platform access",
  },
  {
    value: "sponsor",
    label: "Sponsor",
    icon: <Users className="w-4 h-4" />,
    desc: "ROI & performance",
  },
  {
    value: "organizer",
    label: "Organizer",
    icon: <Calendar className="w-4 h-4" />,
    desc: "Event management",
  },
];

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await register(email, password, name, role);

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold">EventIQ</span>
        </div>

        <h2 className="text-2xl font-bold mb-2">Create your account</h2>
        <p className="text-muted-foreground mb-8">
          Get started with EventIQ analytics
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="h-11"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Select your role</Label>

            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    role === r.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/50"
                  }`}
                >
                  <div className="flex justify-center mb-1">{r.icon}</div>
                  <div className="text-xs font-medium">{r.label}</div>
                  <div className="text-[10px] opacity-70">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 gradient-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}