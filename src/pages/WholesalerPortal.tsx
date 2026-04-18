import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ArrowRight, Loader2, Store } from 'lucide-react';

export function WholesalerPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login - any email/password works for demo
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0514] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-white">
              micro<span className="text-[#9a02d0]">DOS</span>
              <span className="text-[#44f80c]">(2)</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-white">Wholesaler Portal</h2>
          <p className="mt-2 text-gray-400">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#150f24] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#9a02d0]" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="pl-10 bg-[#0a0514] border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-[#0a0514] border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-[#9a02d0] hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Apply Card */}
        <Card className="bg-[#150f24]/50 border-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#9a02d0]/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-[#9a02d0]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Not a wholesaler yet?</h3>
                <p className="text-gray-400 text-sm">
                  Apply to become an authorized microDOS(2) wholesaler
                </p>
              </div>
              <Link to="/wholesale-application">
                <Button variant="outline" className="border-[#9a02d0] text-[#9a02d0] hover:bg-[#9a02d0]/10">
                  Apply
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
