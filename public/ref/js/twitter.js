new TWTR.Widget({
  version: 2,
  type: 'search',
  search: '#realtimewebloggin',
  interval: 30000,
  title: 'Ars Electronica in Linz &amp; Tokyo',
  subject: 'Real Time Web Logging',
  width: 414,
  height: 300,
  theme: {
    shell: {
      background: '#8ec1da',
      color: '#ffffff'
    },
    tweets: {
      background: '#ffffff',
      color: '#444444',
      links: '#1985b5'
    }
  },
  features: {
    scrollbar: true,
    loop: true,
    live: true,
    hashtags: true,
    timestamp: true,
    avatars: true,
    toptweets: true,
    behavior: 'default'
  }
}).render().start();