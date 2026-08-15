// In-Memory Data Store Fallback for zero-config/offline instant execution
export const users = [
  {
    _id: 'user_admin_324',
    name: 'Admin Tirth',
    email: 'tirthkapuriya324@gmail.com',
    password: 'asha15',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Curator and Platform Manager.',
    country: 'India'
  },
  {
    _id: 'user_admin_1',
    name: 'Tirth Kapuriya',
    email: 'tirthkapuriya@gmail.com',
    password: '123456',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Curator and Platform Manager.',
    country: 'India'
  },
  {
    _id: 'user_dev_1',
    name: 'CAPCOM & FromSoftware',
    email: 'dev@capcom.com',
    role: 'developer',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    bio: 'Action game creators.',
    country: 'United Kingdom'
  },
  {
    _id: 'user_gamer_1',
    name: 'MatrixGamer_99',
    email: 'alex@gamer.com',
    role: 'gamer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Action speedrunner.',
    country: 'United States'
  }
];

export const games = [
  {
    _id: 'game_doom_1',
    title: 'DOOM Eternal',
    description: 'Hell’s armies have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the ultimate destruction of humanity.',
    shortDescription: 'Fast-paced FPS with intense combat, visceral glory kills, and incredible metal soundtrack.',
    genre: ['Action', 'FPS', 'Gore', 'Fast-Paced'],
    releaseDate: 'Mar 20, 2020',
    developerName: 'id Software',
    steamAppId: '782330',
    price: 39.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/ss_8d4b31a31d2fb7c8ef4a779148d45f448c909e7c.1920x1080.jpg',
      'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/ss_1639d67713d7890eb9dbb6c230559eb4a36f7eb3.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/782330/DOOM_Eternal/' }],
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 12,
    affiliateClicks: 320
  },
  {
    _id: 'game_sekiro_1',
    title: 'Sekiro: Shadows Die Twice',
    description: 'Explore Sengoku Japan and unleash ninja prosthetic tools to challenge legendary samurai foes.',
    shortDescription: 'Challenging samurai combat. Winner of Game of the Year 2019.',
    genre: ['Action', 'Souls-like', 'Ninja', 'Difficult'],
    releaseDate: 'Mar 22, 2019',
    developerName: 'FromSoftware Inc.',
    steamAppId: '814380',
    price: 59.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_593cfb5fefddcbf8a892b15744cb89d5f75e2194.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=rXMX4YJ7Lks',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/' }],
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 16,
    affiliateClicks: 410
  },
  {
    _id: 'game_fs25_1',
    title: 'Farming Simulator 25',
    description: 'Farming Simulator 25 invites you to join the rewarding farm life. Build your agricultural empire with brand new crops, Asian environments, and over 400 machinery vehicles.',
    shortDescription: 'Latest Farming Simulator featuring rice farming and upgraded graphics engine.',
    genre: ['Farming Sim', 'Simulation', 'Co-op'],
    releaseDate: 'Nov 12, 2024',
    developerName: 'GIANTS Software',
    steamAppId: '2300320',
    price: 49.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2300320/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/2300320/ss_24d9c79e605d84860b29ff07d6ff52d76587c6dd.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=6rL4HhN4kAA',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/2300320/Farming_Simulator_25/' }],
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 9,
    affiliateClicks: 260
  },
  {
    _id: 'game_stardew_1',
    title: 'Stardew Valley',
    description: 'Relaxing pixel-art farming simulation with mining, fishing, crafting, and relationships.',
    shortDescription: 'Relaxing pixel-art farming and cozy country adventure.',
    genre: ['Farming Sim', 'Cozy', 'RPG', 'Pixel Graphics', 'Indie'],
    releaseDate: 'Feb 26, 2016',
    developerName: 'ConcernedApe',
    steamAppId: '413150',
    price: 14.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/ss_10b42f618a8b1390f1f13b194d9ed758a032ec4d.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=ot7uXNQsk04',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/413150/Stardew_Valley/' }],
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 42,
    affiliateClicks: 520
  },
  {
    _id: 'game_wukong_1',
    title: 'Black Myth: Wukong',
    description: 'Unreal Engine 5 action RPG rooted in Chinese mythology. Venture forth as the Destined One.',
    shortDescription: 'Unreal Engine 5 Action RPG based on Journey to the West. Perfect for powerful RTX GPUs.',
    genre: ['AAA', 'Action RPG', 'Mythology', 'RTX High Performance'],
    releaseDate: 'Aug 20, 2024',
    developerName: 'Game Science',
    steamAppId: '2358720',
    price: 59.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/ss_1648a734e565b93d0c3eb1f9076634563459c9d4.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=pnSStRj0O1E',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/2358720/Black_Myth_Wukong/' }],
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 38,
    affiliateClicks: 680
  },
  {
    _id: 'game_rdr2_1',
    title: 'Red Dead Redemption 2',
    description: 'Arthur Morgan and the Van der Linde gang are outlaws on the run across rugged America.',
    shortDescription: 'Massive open world with an incredible story. One of the best-looking PC games.',
    genre: ['AAA', 'Open World', 'Story Rich', 'Western', 'Action'],
    releaseDate: 'Dec 5, 2019',
    developerName: 'Rockstar Games',
    steamAppId: '1174180',
    price: 59.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/ss_6c024d271f76cf61771965701a5518b0821d3f9b.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=gmA6MrX81z4',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/' }],
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 45,
    affiliateClicks: 590
  },
  {
    _id: 'game_cyberpunk_1',
    title: 'Cyberpunk 2077',
    description: 'An open-world action-adventure RPG set in Night City. Upgrade your cyberware and explore.',
    shortDescription: 'Futuristic open-world RPG in Night City. Excellent following major updates.',
    genre: ['AAA', 'Cyberpunk', 'Open World', 'RPG', 'Sci-Fi'],
    releaseDate: 'Dec 10, 2020',
    developerName: 'CD PROJEKT RED',
    steamAppId: '1091500',
    price: 59.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_752a7818e38d613998b18a221f7c8f9fa4193eb7.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=UnA7tepsc7s',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1091500/Cyberpunk_2077/' }],
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 29,
    affiliateClicks: 480
  },
  {
    _id: 'game_elden_1',
    title: 'Elden Ring',
    description: 'Rise, Tarnished, and brandish the power of the Elden Ring in the Lands Between.',
    shortDescription: 'Vast open world with rewarding exploration. Winner of Game of the Year 2022.',
    genre: ['AAA', 'Souls-like', 'Open World', 'RPG', 'Dark Fantasy'],
    releaseDate: 'Feb 24, 2022',
    developerName: 'FromSoftware Inc.',
    steamAppId: '1245620',
    price: 59.99,
    headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    screenshots: [
      'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_8d4b31a31d2fb7c8ef4a779148d45f448c909e7c.1920x1080.jpg'
    ],
    trailerUrl: 'https://www.youtube.com/watch?v=E3Huy2cdih0',
    storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1245620/ELDEN_RING/' }],
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 52,
    affiliateClicks: 710
  }
];

// Dynamically generate matrix games for the in-memory fallback store
const categoriesMatrix = [
  {
    genre: 'Action',
    free: ['Warframe', 'Brawlhalla', 'The Finals', 'Combat Master'],
    tier1: ['Sleeping Dogs Definitive Edition', 'Mad Max', 'Just Cause 3', 'Batman Arkham Asylum'],
    tier2: ['Devil May Cry 5', 'Sekiro: Shadows Die Twice', 'Resident Evil 4', 'Hi-Fi Rush']
  },
  {
    genre: 'Metroidvania',
    free: ['Hollow Floor', 'Castlevania Revamped', 'Endless Memories', 'Momodora Demo'],
    tier1: ['Hollow Knight', 'Bloodstained: Curse of the Moon', 'Guacamelee STCE', 'Gato Roboto'],
    tier2: ['Ori and the Will of the Wisps', 'Blasphemous 2', 'Prince of Persia: The Lost Crown', 'Nine Sols']
  },
  {
    genre: 'Roguelike',
    free: ['HoloCure', 'No More Room in Hell', 'Realm Grinder', 'Path of Exile'],
    tier1: ['Vampire Survivors', 'Brotato', 'Rogue Legacy', 'Streets of Rogue'],
    tier2: ['Hades', 'Risk of Rain Returns', 'Dead Cells', 'Balatro']
  },
  {
    genre: 'Platformer',
    free: ['SuperTux', 'Open Surge', 'Chex Quest HD', 'Helltaker'],
    tier1: ['Celeste', 'Rayman Legends', 'Limbo', 'Inside'],
    tier2: ['Sonic Frontiers', 'Crash Bandicoot N. Sane Trilogy', 'Little Nightmares II', 'Prince of Persia: The Lost Crown']
  },
  {
    genre: 'Farming Sim',
    free: ['Staxel Demo', 'Farm Together Demo', 'OpenTTD', 'Farm RPG'],
    tier1: ['Stardew Valley', 'Kynseed', 'Forager', 'Graveyard Keeper'],
    tier2: ['Coral Island', 'Roots of Pacha', 'My Time at Sandrock', 'Sun Haven']
  },
  {
    genre: 'Cozy',
    free: ['Sky: Children of the Light', 'Palia', 'Doki Doki Literature Club', 'Alpaca Stacka'],
    tier1: ['A Short Hike', 'Unpacking', 'Dorfromantik', 'TOEM'],
    tier2: ['Spiritfarer', 'Tiny Glade', 'Disney Dreamlight Valley', 'Cozy Grove 2']
  },
  {
    genre: 'Strategy',
    free: ['StarCraft II', 'OpenRA', 'Battle for Wesnoth', 'Minion Masters'],
    tier1: ['Age of Empires II DE', 'Northgard', 'Into the Breach', 'Kingdom Two Crowns'],
    tier2: ['Age of Empires IV', 'Frostpunk 2', 'Total War: Warhammer II', 'Civilization VII']
  },
  {
    genre: 'RPG',
    free: ['Genshin Impact', 'Wuthering Waves', 'Path of Exile', 'Guild Wars 2'],
    tier1: ['The Witcher 3', 'Dragon\'s Dogma: Dark Arisen', 'South Park: Stick of Truth', 'Kingdoms of Amalur'],
    tier2: ['Persona 5 Royal', 'Elden Ring', 'Metaphor: ReFantazio', 'Dragon Quest XI S']
  },
  {
    genre: 'Sandbox',
    free: ['Unturned', 'Roblox', 'Creativerse', 'Veloren'],
    tier1: ['Terraria', 'People Playground', 'Besiege', 'Garry\'s Mod'],
    tier2: ['Satisfactory', 'Teardown', 'Planet Crafter', 'Astroneer']
  },
  {
    genre: 'Card Game',
    free: ['Yu-Gi-Oh! Master Duel', 'Marvel Snap', 'Legends of Runeterra', 'Shadowverse'],
    tier1: ['Slay the Spire', 'Stacklands', 'Card Shark', 'Monster Train'],
    tier2: ['Balatro', 'Inscryption', 'Across the Obelisk', 'Wildfrost']
  }
];

const unsplashImages = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80'
];

let imgIndex = 0;
categoriesMatrix.forEach((category) => {
  // Free Games
  category.free.forEach(gameTitle => {
    if (games.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
    games.push({
      _id: 'mem_game_' + gameTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
      title: gameTitle,
      description: `${gameTitle} is a popular, highly-rated ${category.genre} game. Team up with players worldwide or go solo in this epic adventure.`,
      shortDescription: `Play ${gameTitle} now. Fully optimized for PC with custom settings.`,
      genre: [category.genre, 'Indie', 'Free to Play'],
      releaseDate: 'Jan 2023',
      developerName: 'Indie Studio',
      price: 0,
      headerImage: unsplashImages[imgIndex % unsplashImages.length],
      screenshots: [unsplashImages[(imgIndex + 1) % unsplashImages.length]],
      trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
      storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
      isFeatured: false,
      averageRating: 4.8,
      reviewCount: 34,
      affiliateClicks: Math.floor(Math.random() * 50) + 5
    });
    imgIndex++;
  });

  // Tier 1 Games (Under 830)
  category.tier1.forEach(gameTitle => {
    if (games.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
    games.push({
      _id: 'mem_game_' + gameTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
      title: gameTitle,
      description: `Dive into ${gameTitle}, a standout title in the ${category.genre} space. Explore beautiful levels, customize your gear, and master its deep systems.`,
      shortDescription: `Acclaimed ${category.genre} experience now available on PC.`,
      genre: [category.genre, 'Indie'],
      releaseDate: 'Jun 2022',
      developerName: 'Indie Studio',
      price: 9.99,
      headerImage: unsplashImages[imgIndex % unsplashImages.length],
      screenshots: [unsplashImages[(imgIndex + 1) % unsplashImages.length]],
      trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
      storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
      isFeatured: false,
      averageRating: 4.7,
      reviewCount: 42,
      affiliateClicks: Math.floor(Math.random() * 50) + 5
    });
    imgIndex++;
  });

  // Tier 2 Games (Under 1660)
  category.tier2.forEach(gameTitle => {
    if (games.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
    games.push({
      _id: 'mem_game_' + gameTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase(),
      title: gameTitle,
      description: `Experience the masterpiece ${gameTitle}. Featuring stunning graphics, a compelling story, and highly responsive ${category.genre} mechanics.`,
      shortDescription: `Award-winning ${category.genre} game. A must-play title.`,
      genre: [category.genre, 'AAA', 'Action'],
      releaseDate: 'Mar 2023',
      developerName: 'Major Developer',
      price: 19.99,
      headerImage: unsplashImages[imgIndex % unsplashImages.length],
      screenshots: [unsplashImages[(imgIndex + 1) % unsplashImages.length]],
      trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
      storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
      isFeatured: false,
      averageRating: 4.9,
      reviewCount: 78,
      affiliateClicks: Math.floor(Math.random() * 50) + 5
    });
    imgIndex++;
  });
});


export const reviews = [
  {
    _id: 'review_1',
    gameId: 'game_doom_1',
    userName: 'MatrixGamer_99',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Visceral & Fast FPS Perfection',
    content: 'DOOM Eternal is an absolute masterclass. The gunplay loop, dash mechanics, and metal soundtrack keep you at 100% adrenaline.',
    createdAt: new Date()
  },
  {
    _id: 'review_2',
    gameId: 'game_sekiro_1',
    userName: 'NeonPixelSarah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Clashing Swords at Unlocked Framerates',
    content: 'The deflect combat system in Sekiro is the most rewarding katana action combat loop ever designed.',
    createdAt: new Date()
  }
];

export const threads = [
  {
    _id: 'thread_1',
    gameId: 'game_elden_1',
    authorName: 'MatrixGamer_99',
    title: 'Best build for shadow of the erdtree?',
    content: 'I am running a strength faith build. Anyone tried the new weapons?',
    pinned: true,
    postCount: 2,
    lastActivity: new Date()
  }
];

export const posts = [
  {
    _id: 'post_1',
    threadId: 'thread_1',
    authorName: 'MatrixGamer_99',
    content: 'I am running a strength faith build. Anyone tried the new weapons?',
    createdAt: new Date()
  }
];
