import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Game from './models/Game.js';
import Review from './models/Review.js';
import Thread from './models/Thread.js';
import Post from './models/Post.js';
import { updateGameAverageRating } from './controllers/reviewController.js';

dotenv.config();

export const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('Clearing existing database data...');
    await User.deleteMany({});
    await Game.deleteMany({});
    await Review.deleteMany({});
    await Thread.deleteMany({});
    await Post.deleteMany({});

    console.log('Seeding Users...');
    const adminUser = await User.create({
      name: 'Admin Tirth',
      email: 'tirthkapuriya18@gmail.com',
      password: 'asha15',
      role: 'admin',
      bio: 'Lead Curator and Platform Manager at IndieGamer Hub.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      country: 'India'
    });

    const devCapcom = await User.create({
      name: 'CAPCOM & FromSoftware',
      email: 'dev@capcom.com',
      password: 'devpassword123',
      role: 'developer',
      bio: 'Creators of legendary action combat and souls-like experiences.',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      country: 'United Kingdom'
    });

    const devRockstar = await User.create({
      name: 'Rockstar & CD PROJEKT',
      email: 'dev@rockstar.com',
      password: 'devpassword123',
      role: 'developer',
      bio: 'Creators of Red Dead Redemption 2, Cyberpunk 2077, and Witcher 3.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      country: 'United States'
    });

    const gamerAlex = await User.create({
      name: 'MatrixGamer_99',
      email: 'alex@gamer.com',
      password: 'gamerpassword123',
      role: 'gamer',
      bio: 'Action game speedrunner and high-performance RTX hardware enthusiast.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      country: 'United States'
    });

    const gamerSarah = await User.create({
      name: 'NeonPixelSarah',
      email: 'sarah@gamer.com',
      password: 'gamerpassword123',
      role: 'gamer',
      bio: 'Farming simulators, cozy farming, and high-framerate AAA adventures.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      country: 'India'
    });

    console.log('Seeding PC Games Catalog across Action, Farming Sim, AAA, and Indie...');
    const gamesData = [
      // --- 🎮 1. ACTION GAMES (PC) ---
      {
        title: 'DOOM Eternal',
        description: 'Hell’s armies have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the ultimate destruction of humanity. The only thing they fear... is you.',
        shortDescription: 'Fast-paced FPS with intense combat, visceral glory kills, and incredible soundtrack.',
        genre: ['Action', 'FPS', 'Gore', 'Fast-Paced', 'Demons'],
        releaseDate: 'Mar 20, 2020',
        developerId: devCapcom._id,
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
        affiliateClicks: 320
      },
      {
        title: 'Sekiro: Shadows Die Twice',
        description: 'Explore late 1500s Sengoku Japan, a brutal period of constant life-and-death conflict, as you come face-to-face with larger than life foes in a dark and twisted world. Unleash an arsenal of deadly prosthetic tools and powerful ninja abilities.',
        shortDescription: 'Challenging samurai combat. Winner of Game of the Year 2019.',
        genre: ['Action', 'Souls-like', 'Singleplayer', 'Difficult', 'Ninja'],
        releaseDate: 'Mar 22, 2019',
        developerId: devCapcom._id,
        developerName: 'FromSoftware Inc.',
        steamAppId: '814380',
        price: 59.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_593cfb5fefddcbf8a892b15744cb89d5f75e2194.1920x1080.jpg',
          'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/ss_2c04ae53d5a2d67d710db4e1e838f71427513ff7.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=rXMX4YJ7Lks',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/' }],
        isFeatured: true,
        affiliateClicks: 410
      },
      {
        title: 'Devil May Cry 5',
        description: 'The ultimate Devil Hunter is back in style. Harness Nero, Dante, and V to unleash insane weapon combos against demonic invasions in Red Grave City.',
        shortDescription: 'Stylish hack-and-slash combat with multiple playable characters and high score combos.',
        genre: ['Action', 'Hack and Slash', 'Great Soundtrack', 'Stylized'],
        releaseDate: 'Mar 8, 2019',
        developerId: devCapcom._id,
        developerName: 'CAPCOM Co., Ltd.',
        steamAppId: '601150',
        price: 29.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/ss_2f9b8c04e259e875150937a3c3e669ad982bcae2.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=KJZ2B8w6s4s',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/601150/Devil_May_Cry_5/' }],
        isFeatured: false,
        affiliateClicks: 180
      },

      // --- 🚜 2. FARMING SIMULATOR GAMES ---
      {
        title: 'Farming Simulator 25',
        description: 'Farming Simulator 25 invites you to join the rewarding farm life. Build your agricultural empire in North America, East Asia, or Europe with brand new crops, rice farming, animals, and over 400 machinery vehicles.',
        shortDescription: 'Latest Farming Simulator with new crops, East Asian maps, and upgraded graphics engine.',
        genre: ['Farming Sim', 'Simulation', 'Relaxing', 'Co-op', 'Management'],
        releaseDate: 'Nov 12, 2024',
        developerId: devRockstar._id,
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
        affiliateClicks: 260
      },
      {
        title: 'Farming Simulator 22',
        description: 'Create your farm and let the good times grow! Harvest crops, tend to livestock, manage productions, and take on seasonal challenges across various European and American environments.',
        shortDescription: 'Huge selection of licensed tractors and equipment with multiplayer support.',
        genre: ['Farming Sim', 'Simulation', 'Multiplayer', 'Relaxing'],
        releaseDate: 'Nov 22, 2021',
        developerId: devRockstar._id,
        developerName: 'GIANTS Software',
        steamAppId: '1248130',
        price: 29.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1248130/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/1248130/ss_b84bbcf28c464a66a1e35a96db45a16d55734bc2.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=o33mRBrK42M',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1248130/Farming_Simulator_22/' }],
        isFeatured: false,
        affiliateClicks: 195
      },
      {
        title: 'Stardew Valley',
        description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life in a cozy pixel-art community!',
        shortDescription: 'Relaxing pixel-art farming with mining, fishing, crafting, and relationships.',
        genre: ['Farming Sim', 'Cozy', 'RPG', 'Pixel Graphics', 'Indie'],
        releaseDate: 'Feb 26, 2016',
        developerId: devCapcom._id,
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
        affiliateClicks: 520
      },

      // --- 🏆 3. AAA TITLES (PC & HIGH-END RTX) ---
      {
        title: 'Black Myth: Wukong',
        description: 'Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.',
        shortDescription: 'Unreal Engine 5 action RPG based on Journey to the West. Optimized for RTX 3060+ GPUs.',
        genre: ['AAA', 'Action RPG', 'Mythology', 'Singleplayer', 'RTX High Performance'],
        releaseDate: 'Aug 20, 2024',
        developerId: devCapcom._id,
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
        affiliateClicks: 680
      },
      {
        title: 'Red Dead Redemption 2',
        description: 'Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and the best bounty hunters massing on their heels, the gang must rob, steal and fight their way across America.',
        shortDescription: 'Massive open world with an incredible story. One of the best-looking PC games of all time.',
        genre: ['AAA', 'Open World', 'Story Rich', 'Western', 'Action'],
        releaseDate: 'Dec 5, 2019',
        developerId: devRockstar._id,
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
        affiliateClicks: 590
      },
      {
        title: 'Cyberpunk 2077',
        description: 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a Cyberpunk mercenary wrapped in a do-or-die fight for survival.',
        shortDescription: 'Futuristic open-world RPG in Night City featuring ray tracing and Phantom Liberty expansion.',
        genre: ['AAA', 'Cyberpunk', 'Open World', 'RPG', 'Sci-Fi'],
        releaseDate: 'Dec 10, 2020',
        developerId: devRockstar._id,
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
        affiliateClicks: 480
      },
      {
        title: 'Elden Ring',
        description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
        shortDescription: 'Vast open world with rewarding exploration and boss fights. Winner of GOTY 2022.',
        genre: ['AAA', 'Souls-like', 'Open World', 'RPG', 'Dark Fantasy'],
        releaseDate: 'Feb 24, 2022',
        developerId: devCapcom._id,
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
        affiliateClicks: 710
      },
      {
        title: 'Ghost of Tsushima Director\'s Cut',
        description: 'Forge a new path and wage an unconventional war for the freedom of Tsushima. Challenge opponents with your katana and master stealth tactics.',
        shortDescription: 'Stunning samurai open world adventure with cinematic ray tracing on PC.',
        genre: ['AAA', 'Open World', 'Samurai', 'Action', 'RTX High Performance'],
        releaseDate: 'May 16, 2024',
        developerId: devRockstar._id,
        developerName: 'Sucker Punch Productions',
        steamAppId: '2215430',
        price: 59.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/ss_40f4122d25f75e921d74e89e02c67b9365cecf3b.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=b-Bvh89-aL4',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/2215430/Ghost_of_Tsushima_Directors_Cut/' }],
        isFeatured: false,
        affiliateClicks: 340
      },
      {
        title: 'God of War Ragnarök',
        description: 'From Santa Monica Studio comes the sequel to God of War (2018). Fimbulwinter is well underway. Kratos and Atreus must journey across the Nine Realms.',
        shortDescription: 'Epic Norse myth action adventure with visceral combat and story rich cinematic lore.',
        genre: ['AAA', 'Action', 'Story Rich', 'Mythology', 'RTX High Performance'],
        releaseDate: 'Sep 19, 2024',
        developerId: devCapcom._id,
        developerName: 'Santa Monica Studio',
        steamAppId: '2322010',
        price: 59.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/ss_cd950b441f9d505963f47e388d77c223c21c7d24.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=hfJ4Km46A-0',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/' }],
        isFeatured: false,
        affiliateClicks: 290
      },
      {
        title: 'Marvel\'s Spider-Man 2',
        description: 'Spider-Men Peter Parker and Miles Morales return for an exciting new adventure in Marvel’s Spider-Man franchise on PC.',
        shortDescription: 'Swing through Marvel\'s New York with Peter Parker and Miles Morales at unlocked framerates.',
        genre: ['AAA', 'Superhero', 'Open World', 'Action', 'RTX High Performance'],
        releaseDate: 'Jan 30, 2025',
        developerId: devRockstar._id,
        developerName: 'Insomniac Games',
        steamAppId: '1817070',
        price: 59.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg',
        screenshots: [
          'https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/ss_7520b8f4ed7d67c525f0e3fa089d71c61869502b.1920x1080.jpg'
        ],
        trailerUrl: 'https://www.youtube.com/watch?v=bgqGdIoa52s',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1817070/Marvels_SpiderMan_2/' }],
        isFeatured: false,
        affiliateClicks: 410
      },

      // --- 🗡️ INDIE STANDOUTS ---
      {
        title: 'Hollow Knight',
        description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes in a classic, hand-drawn 2D style.',
        shortDescription: 'Epic hand-drawn 2D Metroidvania action adventure.',
        genre: ['Action', 'Metroidvania', 'Atmospheric', 'Indie', '2D'],
        releaseDate: 'Feb 24, 2017',
        developerId: devCapcom._id,
        developerName: 'Team Cherry',
        steamAppId: '367520',
        price: 14.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
        screenshots: ['https://cdn.cloudflare.steamstatic.com/steam/apps/367520/ss_40f4122d25f75e921d74e89e02c67b9365cecf3b.1920x1080.jpg'],
        trailerUrl: 'https://www.youtube.com/watch?v=UAO2urG23S4',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/367520/Hollow_Knight/' }],
        isFeatured: false,
        affiliateClicks: 310
      },
      {
        title: 'Hades',
        description: 'Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from Supergiant Games.',
        shortDescription: 'Fast-paced rogue-like dungeon crawler with addictive combat.',
        genre: ['Action', 'Roguelike', 'Hack and Slash', 'Indie'],
        releaseDate: 'Sep 17, 2020',
        developerId: devCapcom._id,
        developerName: 'Supergiant Games',
        steamAppId: '1145360',
        price: 24.99,
        headerImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
        screenshots: ['https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/ss_1648a734e565b93d0c3eb1f9076634563459c9d4.1920x1080.jpg'],
        trailerUrl: 'https://www.youtube.com/watch?v=91t0HA9f0FU',
        storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/app/1145360/Hades/' }],
        isFeatured: false,
        affiliateClicks: 280
      }
    ];

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

    const matrixGames = [];
    let imgIndex = 0;

    categoriesMatrix.forEach((category) => {
      // Free Games
      category.free.forEach(gameTitle => {
        if (gamesData.some(g => g.title.toLowerCase() === gameTitle.toLowerCase()) || 
            matrixGames.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
        
        const isSpTitle = ['warframe', 'brawlhalla', 'the finals', 'combat master'].includes(gameTitle.toLowerCase());
        const spImgMap = {
          'warframe': '/warframe.jpg',
          'brawlhalla': '/brawlhalla.jpg',
          'the finals': '/the_finals.png',
          'combat master': '/combat_master.png'
        };
        const localImg = isSpTitle ? spImgMap[gameTitle.toLowerCase()] : null;

        matrixGames.push({
          title: gameTitle,
          description: `${gameTitle} is a popular, highly-rated ${category.genre} game. Team up with players worldwide or go solo in this epic adventure.`,
          shortDescription: `Play ${gameTitle} now. Fully optimized for PC with custom settings.`,
          genre: [category.genre, 'Indie', 'Free to Play'],
          releaseDate: 'Jan 2023',
          developerId: devCapcom._id,
          developerName: 'Indie Studio',
          price: 0,
          headerImage: localImg || unsplashImages[imgIndex % unsplashImages.length],
          screenshots: [localImg || unsplashImages[(imgIndex + 1) % unsplashImages.length]],
          trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
          storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
          isFeatured: false,
          affiliateClicks: Math.floor(Math.random() * 50) + 5
        });
        imgIndex++;
      });

      // Tier 1 Games (Under 830)
      category.tier1.forEach(gameTitle => {
        if (gamesData.some(g => g.title.toLowerCase() === gameTitle.toLowerCase()) || 
            matrixGames.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
        
        matrixGames.push({
          title: gameTitle,
          description: `Dive into ${gameTitle}, a standout title in the ${category.genre} space. Explore beautiful levels, customize your gear, and master its deep systems.`,
          shortDescription: `Acclaimed ${category.genre} experience now available on PC.`,
          genre: [category.genre, 'Indie'],
          releaseDate: 'Jun 2022',
          developerId: devCapcom._id,
          developerName: 'Indie Studio',
          price: 9.99,
          headerImage: unsplashImages[imgIndex % unsplashImages.length],
          screenshots: [unsplashImages[(imgIndex + 1) % unsplashImages.length]],
          trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
          storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
          isFeatured: false,
          affiliateClicks: Math.floor(Math.random() * 50) + 5
        });
        imgIndex++;
      });

      // Tier 2 Games (Under 1660)
      category.tier2.forEach(gameTitle => {
        if (gamesData.some(g => g.title.toLowerCase() === gameTitle.toLowerCase()) || 
            matrixGames.some(g => g.title.toLowerCase() === gameTitle.toLowerCase())) return;
        
        matrixGames.push({
          title: gameTitle,
          description: `Experience the masterpiece ${gameTitle}. Featuring stunning graphics, a compelling story, and highly responsive ${category.genre} mechanics.`,
          shortDescription: `Award-winning ${category.genre} game. A must-play title.`,
          genre: [category.genre, 'AAA', 'Action'],
          releaseDate: 'Mar 2023',
          developerId: devRockstar._id,
          developerName: 'Major Developer',
          price: 19.99,
          headerImage: unsplashImages[imgIndex % unsplashImages.length],
          screenshots: [unsplashImages[(imgIndex + 1) % unsplashImages.length]],
          trailerUrl: 'https://www.youtube.com/watch?v=FkklG9MA0hs',
          storeLinks: [{ store: 'Steam', url: 'https://store.steampowered.com/' }],
          isFeatured: false,
          affiliateClicks: Math.floor(Math.random() * 50) + 5
        });
        imgIndex++;
      });
    });

    const combinedGamesData = [...gamesData, ...matrixGames];
    const createdGames = await Game.insertMany(combinedGamesData);
    console.log(`Successfully seeded ${createdGames.length} games into catalog!`);

    // Add reviews & calculate rating aggregations
    console.log('Seeding gamer reviews & running MongoDB aggregations...');
    for (const game of createdGames) {
      await Review.create({
        gameId: game._id,
        userId: gamerAlex._id,
        userName: gamerAlex.name,
        userAvatar: gamerAlex.avatar,
        rating: 5,
        title: `Absolute Masterpiece - ${game.title}`,
        content: `Outstanding performance and mechanics in ${game.title}. Runs flawlessly on modern PC hardware!`
      });

      await Review.create({
        gameId: game._id,
        userId: gamerSarah._id,
        userName: gamerSarah.name,
        userAvatar: gamerSarah.avatar,
        rating: 5,
        title: 'Extremely Fun & Engaging',
        content: `Loved every hour spent in ${game.title}. Highly recommended title!`
      });

      await updateGameAverageRating(game._id);
    }

    console.log('✅ Database seeding complete with Action, Farming Sim, AAA, and Indie games!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Execute if run directly from command line
if (process.argv[1]?.includes('seed.js')) {
  seedData().then(() => process.exit(0));
}
