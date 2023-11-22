import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.emeraldwalk.mathtutor',
  appName: 'Math Tutor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
