import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.emeraldwalk.mathtutor',
  appName: 'Math Tutor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // url: 'http://192.168.68.62:4321/math-tutor', // live reload dev
    // cleartext: true, // Android non-prod setting
  },
}

export default config
