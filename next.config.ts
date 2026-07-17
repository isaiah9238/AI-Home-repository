import type { NextConfig } from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
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
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'localhost:9002',
        '3000-firebase-studio-1770307012357.cluster-ux5mmlia3zhhask7riihruxydo.cloudworkstations.dev',
        '*.cloudworkstations.dev',
        '*.web.app',
        '*.firebaseapp.com',
        '*.google.com',
        '*.googleusercontent.com',
        '*.firebase-studio.google',
        '*.studio.firebase.google.com'
      ],
    },
  },
  // 🛠️ Advanced Webpack barrier to handle node: protocol schemes
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 1. Core bare fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        dns: false,
        dgram: false,
        crypto: false,
        stream: false,
        buffer: false,
      };

      // 2. Intercepts and nullifies any modern 'node:*' scheme imports on client-side
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
            // Redirect to an empty module or false fallback if it shouldn't exist in browser
            const fallbackMap: Record<string, boolean> = {
              'async_hooks': false,
              'buffer': false,
              'crypto': false,
              'events': false,
              'fs': false,
              'net': false,
              'tls': false,
              'dgram': false,
              'http2': false,
              'dns': false,
            };
            if (fallbackMap[resource.request] === false) {
              resource.request = 'empty-module'; // Webpack internal alias for empty
            }
          }
        )
      );
      
      // Provide an empty module declaration helper
      config.resolve.alias = {
        ...config.resolve.alias,
        'empty-module': false,
      };
    }
    return config;
  },
};

export default nextConfig;