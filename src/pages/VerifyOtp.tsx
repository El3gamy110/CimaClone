import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const schema = z.object({
  code: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d+$/, 'Must contain only numbers'),
});

type FormData = z.infer<typeof schema>;

export default function VerifyOtp() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!email) return;
    
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: data.code,
      type: 'email',
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  if (!email) return null;

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 w-full max-w-md text-center">
        <h1 className="font-syne text-3xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-gray-400 text-sm mb-8">
          We've sent a 6-digit verification code to <span className="font-bold text-white">{email}</span>.
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input 
              type="text" 
              inputMode="numeric"
              maxLength={6}
              {...register('code')}
              className="w-full bg-obsidian/50 border border-white/10 rounded-lg px-4 py-4 text-center text-3xl tracking-[0.5em] text-white focus:outline-none focus:border-primary-soft transition-colors font-mono font-bold"
              placeholder="••••••"
            />
            {errors.code && <p className="text-red-400 text-xs mt-2 text-left">{errors.code.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
      </div>
    </div>
  );
}
