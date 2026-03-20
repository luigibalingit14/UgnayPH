"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
        variant: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40 z-0" />
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
      <Card className="w-full max-w-md glass-card-strong border-white/10 shadow-2xl relative z-10 p-2">
        <CardHeader className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4 transition-colors w-fit mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-2">
            <div className="relative shrink-0 flex items-center justify-center w-12 h-12 bg-white/05 border border-white/10 rounded-2xl shadow-inner">
              <LogIn className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display text-white">Welcome Back!</CardTitle>
          <CardDescription className="text-white/50">
            Login para ma-save ang mga vibe checks mo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass-input"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary border-0" disabled={loading} style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white" }}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/50">Wala ka pang account? </span>
            <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
