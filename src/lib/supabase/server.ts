import { createServerClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function createSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // No-op cookie functions for server-side rendering.
        // The `cookies` object is required, but we don't need to
        // actually do anything with it for anonymous access.
        get(_key: string) {
          return undefined;
        },
        set(_key: string, _value: string, _options: any) {},
        remove(_key: string, _options: any) {},
      },
    }
  );
}
