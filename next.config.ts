import type {NextConfig} from 'next';
require('dotenv').config({ path: './.env' });

// Helper function to extract hostname from Supabase URL
const getSupabaseHostname = (url: string | undefined) => {
  if (!url) return null;
  try {
    const urlObject = new URL(url);
    // The storage URL is a subdomain of the main Supabase URL
    return `*.${urlObject.hostname.split('.').slice(1).join('.')}`;
  } catch (error) {
    console.error('Invalid Supabase URL for image hostname:', error);
    return null;
  }
}

const supabaseImageHostname = getSupabaseHostname(process.env.NEXT_PUBLIC_SUPABASE_URL);

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'placehold.co',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https_storage',
    hostname: 'picsum.photos',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'upload.wikimedia.org',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'imgs.search.brave.com',
    port: '',
    pathname: '/**',
  }
];

if (supabaseImageHostname) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseImageHostname,
    port: '',
    pathname: '/**',
  });
}


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
