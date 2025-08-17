export const privyConfig = {
  // Replace with your actual Privy App ID
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmeebrncn01c8jl0cf6d0t8p5',
  
  config: {
    // Appearance customization
    appearance: {
      theme: 'light',
      accentColor: '#3F4442',
    },
    
    // Login methods
    loginMethods: ['email', 'wallet'],
    
    // Supported wallets
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
  }
}