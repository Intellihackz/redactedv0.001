export const AppConfig = {
  // App details
  appName: 'NexusArt',
  appDescription: 'Create, mint, and trade digital art on the NEAR blockchain with zero gas fees',
  appVersion: '1.0.0',
  
  // Canvas defaults
  canvas: {
    defaultZoom: 1,
    minZoom: 0.1,
    maxZoom: 5,
    defaultStrokeWidth: 2,
    defaultFontSize: 16,
    defaultFontFamily: 'Arial',
    dotSpacing: 20,
    dotRadius: 1,
    handleSize: 10,
    defaultEraserSize: 20,
  },

  // Tool settings
  tools: {
    brush: {
      defaultColor: '#000000',
      defaultWidth: 2,
    },
    rectangle: {
      defaultFillColor: '#ffffff',
      defaultBorderColor: '#000000',
      defaultBorderWidth: 1,
      defaultOpacity: 100,
      defaultBorderRadius: 0,
    },
    circle: {
      defaultFillColor: '#ffffff',
      defaultBorderColor: '#000000',
      defaultBorderWidth: 1,
      defaultOpacity: 100,
    },
    text: {
      defaultColor: '#000000',
      defaultFontSize: 16,
      defaultFontFamily: 'Arial',
    },
  },

  // Layer settings
  layers: {
    defaultOpacity: 100,
    maxNameLength: 50,
  },

  // Export settings
  export: {
    defaultFileName: 'nearcanvas-export',
    defaultFileExtension: '.png',
    maxFileNameLength: 255,
  },

  // Save settings
  save: {
    defaultFileName: 'nearcanvas-save',
    defaultFileExtension: '.nex',
    maxFileNameLength: 255,
  },

  // NFT settings
  nft: {
    mintDeposit: '700000000000000000000000', // in yoctoNEAR
    maxTitleLength: 50,
    maxDescriptionLength: 500,
  },

  // UI settings
  ui: {
    sidebar: {
      width: 264, // 'w-64' in Tailwind is 16rem = 256px + 8px for border
      defaultPanelState: true,
    },
    toolbar: {
      iconSize: 24,
    },
    modal: {
      defaultWidth: 500,
    },
    darkMode: {
      backgroundColor: 'bg-gray-900',
      textColor: 'text-white',
      panelColor: 'bg-gray-800',
    },
    lightMode: {
      backgroundColor: 'bg-gray-100',
      textColor: 'text-black',
      panelColor: 'bg-white',
    },
  },

  // Hotkeys
  hotkeys: {
    tools: {
      pointer: 'p',
      brush: 'b',
      rectangle: 'r',
      circle: 'c',
      eraser: 'e',
      text: 't',
    },
    actions: {
      delete: ['delete', 'backspace'],
      copy: 'ctrl+c',
      paste: 'ctrl+v',
      selectAll: 'ctrl+a',
      save: 'ctrl+s',
      export: 'ctrl+e',
      mint: 'ctrl+m',
      new: 'ctrl+n',
      open: 'ctrl+o',
      toggleTheme: 'ctrl+d',
    },
  },

  // Add this to the AppConfig object
  landingPage: {
    stats: {
      betaSignups: '500+',
      support: '24/7',
      security: '100%',
      blockchain: 'NEAR'
    },
    
    features: [
      {
        title: 'Ultra-Low Fees',
        description: 'Mint and trade NFTs with minimal costs on NEAR Protocol',
        icon: 'Infinity'
      },
      {
        title: 'Lightning Fast',
        description: 'Experience sub-second finality on the NEAR blockchain',
        icon: 'Zap'
      },
      {
        title: 'Advanced Tools',
        description: 'Professional-grade drawing tools with an infinite canvas',
        icon: 'Palette'
      }
    ],

    steps: [
      {
        title: 'Join Waitlist',
        description: 'Sign up to be among the first to access our platform',
        icon: 'Paintbrush'
      },
      {
        title: 'Get Notified',
        description: 'Receive updates about our launch and early access',
        icon: 'Bell'
      },
      {
        title: 'Early Access',
        description: 'Be first to try our advanced drawing tools',
        icon: 'Laptop'
      },
      {
        title: 'Launch',
        description: 'Start creating and minting your NFTs on NEAR',
        icon: 'Rocket'
      }
    ],

    cta: {
      primary: {
        text: 'Watch Demo',
        href: '#demo'
      },
      secondary: {
        text: 'Learn More',
        href: '#features'
      }
    },

    socials: {
      twitter: 'https://twitter.com/nexusart',
      discord: 'https://discord.gg/nexus',
      github: 'https://github.com/nexus-art'
    }
  }
};

export default AppConfig;
