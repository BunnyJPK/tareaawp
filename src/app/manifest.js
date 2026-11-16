export default function manifest() {
    return {
        name: 'mi App PWA',
        short_name: 'PWA App',
        description: 'Una aplicación web progresiva (PWA) de ejemplo construida con next,js',
        start_url: '/',
        display: 'standalone',
        background_color: '#f03e7c',
        theme_color: '#f9fafb',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ]
    };
}