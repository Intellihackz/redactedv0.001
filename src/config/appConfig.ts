export const AppConfig = {
  // App details
  appName: 'Nexus',
  appDescription: 'Create, Mint, and Own Your Digital Art with Ease',
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
    colors: {
      primary: '#008080',
      primaryHover: '#006666',
      background: '#121212',
      text: '#E6E6FA',
      footerBg: '#1E1E1E',
      gradient: {
        from: '#4A0E4E',
        to: '#008080'
      }
    },
    features: [
      {
        title: "Infinite Canvas",
        description: "Unleash your creativity without boundaries on our limitless digital canvas.",
        icon: "Infinity"
      },
      {
        title: "Easy NFT Minting",
        description: "Turn your artwork into NFTs with just a few clicks, powered by NEAR blockchain.",
        icon: "Zap"
      },
      {
        title: "Secure Ownership",
        description: "Your NFTs are securely stored on the blockchain, ensuring true ownership of your digital creations.",
        icon: "Shield"
      }
    ],
    steps: [
      {
        title: "Draw",
        description: "Create your masterpiece on our infinite canvas"
      },
      {
        title: "Customize",
        description: "Add details and metadata to your NFT"
      },
      {
        title: "Mint",
        description: "Turn your art into an NFT with one click"
      },
      {
        title: "Own",
        description: "Securely store and showcase your digital creation"
      }
    ]
  }
};

export default AppConfig;
