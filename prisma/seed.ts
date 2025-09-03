import { PrismaClient, ComicStatus, UserRole, TransactionType, TransactionStatus } from '@prisma/client'

const prisma = new PrismaClient()

const genres = [
  'Action', 'Adventure', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 
  'Comedy', 'Drama', 'Mystery', 'Thriller', 'Slice of Life', 'Historical',
  'Supernatural', 'Martial Arts', 'Isekai', 'School Life'
]

const tags = [
  'Magic', 'Dragons', 'Reincarnation', 'Time Travel', 'Isekai', 'Academy',
  'Martial Arts', 'Cultivation', 'System', 'Overpowered MC', 'Romance',
  'Revenge', 'Nobles', 'Guild', 'Monsters', 'Dungeons', 'Level Up',
  'Weak to Strong', 'Harem', 'Villainess', 'Regression', 'Gaming',
  'Virtual Reality', 'Apocalypse', 'Zombies', 'Vampires', 'Demons'
]

const comics = [
  {
    title: "Dragon's Crown Chronicles",
    slug: "dragons-crown-chronicles",
    description: "Young Aria discovers she can communicate with dragons and must save the kingdom from an evil sorcerer.",
    author: "Takeshi Yamamoto",
    genre: ["Fantasy", "Adventure", "Magic"],
    tags: ["Dragons", "Magic", "Weak to Strong", "Adventure"],
    status: ComicStatus.ONGOING,
    featured: true,
    chapters: 8
  },
  {
    title: "Cherry Blossom Academy",
    slug: "cherry-blossom-academy",
    description: "Sakura transfers to an elite academy and discovers supernatural secrets and forbidden romance.",
    author: "Miyuki Sato",
    genre: ["Romance", "Supernatural", "School Life"],
    tags: ["Academy", "Romance", "Supernatural", "School Life"],
    status: ComicStatus.ONGOING,
    featured: true,
    chapters: 12
  },
  {
    title: "Shadow Blade Saga",
    slug: "shadow-blade-saga",
    description: "Kael trains in shadow manipulation and seeks revenge against the demon lord who destroyed his village.",
    author: "Hiroshi Tanaka",
    genre: ["Action", "Fantasy", "Martial Arts"],
    tags: ["Revenge", "Martial Arts", "Demons", "Overpowered MC"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 15
  },
  {
    title: "Neon City 2089",
    slug: "neon-city-2089",
    description: "Detective Maya investigates mysterious disappearances linked to illegal human enhancement experiments.",
    author: "Alex Chen",
    genre: ["Sci-Fi", "Mystery", "Thriller"],
    tags: ["Cyberpunk", "Detective", "Future", "Technology"],
    status: ComicStatus.COMPLETED,
    featured: false,
    chapters: 10
  },
  {
    title: "Crimson Moon Manor",
    slug: "crimson-moon-manor",
    description: "Emma inherits a mysterious manor haunted by spirits holding pieces of a dark secret.",
    author: "Victoria Blackwood",
    genre: ["Horror", "Mystery", "Supernatural"],
    tags: ["Ghosts", "Mystery", "Manor", "Supernatural"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 9
  },
  {
    title: "The Last Alchemist",
    slug: "the-last-alchemist",
    description: "Elias secretly practices forbidden alchemy and must reveal his powers to save the kingdom.",
    author: "Marcus Weber",
    genre: ["Fantasy", "Adventure", "Drama"],
    tags: ["Alchemy", "Magic", "Kingdom", "Secret Powers"],
    status: ComicStatus.ONGOING,
    featured: true,
    chapters: 11
  },
  {
    title: "Stellar Knights Academy",
    slug: "stellar-knights-academy",
    description: "Zara enrolls in a military academy where cadets pilot mechs to defend against alien invasions.",
    author: "Jin Park",
    genre: ["Sci-Fi", "Action", "School Life"],
    tags: ["Mechs", "Space", "Academy", "Aliens"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 7
  },
  {
    title: "Moonlit Café",
    slug: "moonlit-cafe",
    description: "Yuki inherits a magical café that appears under the full moon and serves supernatural customers.",
    author: "Nanami Fujiwara",
    genre: ["Romance", "Slice of Life", "Supernatural"],
    tags: ["Café", "Magic", "Romance", "Slice of Life"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 6
  },
  {
    title: "The Demon King's Daughter",
    slug: "the-demon-kings-daughter",
    description: "Princess Lilith wants to live peacefully among humans despite her demonic heritage.",
    author: "Ren Kobayashi",
    genre: ["Fantasy", "Comedy", "Romance"],
    tags: ["Demons", "Princess", "Comedy", "Romance"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 13
  },
  {
    title: "Time Paradox Detective",
    slug: "time-paradox-detective",
    description: "Detective Cole gains time-sight abilities to solve impossible crimes and prevent catastrophe.",
    author: "David Martinez",
    genre: ["Mystery", "Sci-Fi", "Thriller"],
    tags: ["Time Travel", "Detective", "Paradox", "Investigation"],
    status: ComicStatus.COMPLETED,
    featured: false,
    chapters: 8
  },
  {
    title: "Cultivation Chronicles",
    slug: "cultivation-chronicles",
    description: "Wei Chen discovers an ancient cultivation technique and climbs from weakest to legendary.",
    author: "Li Wei",
    genre: ["Fantasy", "Martial Arts", "Adventure"],
    tags: ["Cultivation", "Martial Arts", "Weak to Strong", "Ancient Technique"],
    status: ComicStatus.ONGOING,
    featured: true,
    chapters: 20
  },
  {
    title: "The Villainess Returns",
    slug: "the-villainess-returns",
    description: "Isabella is reborn with past-life memories and uses her knowledge to rewrite her villainous destiny.",
    author: "Elena Rossi",
    genre: ["Romance", "Fantasy", "Drama"],
    tags: ["Villainess", "Reincarnation", "Nobles", "Second Chance"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 14
  },
  {
    title: "Virtual Legends",
    slug: "virtual-legends",
    description: "Kai enters a VRMMO to earn money but discovers players are dying in real life.",
    author: "Taro Suzuki",
    genre: ["Sci-Fi", "Action", "Gaming"],
    tags: ["Virtual Reality", "Gaming", "VRMMO", "Life or Death"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 16
  },
  {
    title: "Apocalypse Academy",
    slug: "apocalypse-academy",
    description: "High school students fortify their school during a zombie apocalypse and fight for survival.",
    author: "Michael Torres",
    genre: ["Horror", "Action", "Drama"],
    tags: ["Zombies", "Apocalypse", "Survival", "School"],
    status: ComicStatus.HIATUS,
    featured: false,
    chapters: 5
  },
  {
    title: "Magic Item Merchant",
    slug: "magic-item-merchant",
    description: "Theo uses Earth knowledge to create revolutionary magical inventions in his fantasy shop.",
    author: "Johann Schmidt",
    genre: ["Fantasy", "Comedy", "Slice of Life"],
    tags: ["Merchant", "Magic Items", "Isekai", "Business"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 9
  },
  {
    title: "Starship Captain Maya",
    slug: "starship-captain-maya",
    description: "Captain Maya leads her crew across the galaxy uncovering a conspiracy threatening civilization.",
    author: "Sarah Kim",
    genre: ["Sci-Fi", "Adventure", "Action"],
    tags: ["Space", "Starship", "Captain", "Conspiracy"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 7
  },
  {
    title: "The Phoenix Rises",
    slug: "the-phoenix-rises",
    description: "Flame is reborn as a phoenix after betrayal and seeks revenge on her former allies.",
    author: "Isabella Garcia",
    genre: ["Fantasy", "Action", "Drama"],
    tags: ["Phoenix", "Revenge", "Betrayal", "Rebirth"],
    status: ComicStatus.COMPLETED,
    featured: false,
    chapters: 12
  },
  {
    title: "Monster Tamer's Journey",
    slug: "monster-tamers-journey",
    description: "Ash starts his monster taming journey with a weak slime and becomes unstoppable through friendship.",
    author: "Kenji Yamada",
    genre: ["Adventure", "Fantasy", "Comedy"],
    tags: ["Monsters", "Taming", "Adventure", "Friendship"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 11
  },
  {
    title: "Cybernetic Heart",
    slug: "cybernetic-heart",
    description: "Zara discovers her artificial heart holds memories of its previous owner and seeks the truth.",
    author: "Dr. Amanda Liu",
    genre: ["Sci-Fi", "Romance", "Mystery"],
    tags: ["Cybernetics", "Memory", "Identity", "Technology"],
    status: ComicStatus.ONGOING,
    featured: false,
    chapters: 8
  },
  {
    title: "The Guild Master's Secret",
    slug: "the-guild-masters-secret",
    description: "Luna runs an adventurer's guild while hiding a powerful secret from ancient enemies.",
    author: "Robert Anderson",
    genre: ["Fantasy", "Action", "Mystery"],
    tags: ["Guild", "Secret Identity", "Adventure", "Leadership"],
    status: ComicStatus.ONGOING,
    featured: true,
    chapters: 10
  }
]

const sampleUsers = [
  {
    walletAddress: "0x1234567890123456789012345678901234567890",
    username: "admin_user",
    email: "admin@web3comic.com",
    role: UserRole.ADMIN,
    creditsBalance: 1000
  },
  {
    walletAddress: "0x2234567890123456789012345678901234567891",
    username: "premium_reader",
    email: "premium@web3comic.com", 
    role: UserRole.USER,
    creditsBalance: 500
  },
  {
    walletAddress: "0x3234567890123456789012345678901234567892",
    username: "casual_reader",
    email: "casual@web3comic.com",
    role: UserRole.USER,
    creditsBalance: 50
  }
]

const creditPackages = [
  {
    name: "Starter Pack",
    credits: 100,
    priceUSD: 4.99,
    bonusPercentage: 0
  },
  {
    name: "Popular Pack",
    credits: 300,
    priceUSD: 12.99,
    bonusPercentage: 15
  },
  {
    name: "Premium Pack",
    credits: 600,
    priceUSD: 24.99,
    bonusPercentage: 20
  },
  {
    name: "Ultimate Pack",
    credits: 1200,
    priceUSD: 44.99,
    bonusPercentage: 25
  }
]

function getRandomItems<T>(array: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.readingProgress.deleteMany()
  await prisma.userChapterUnlock.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.page.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.volume.deleteMany()
  await prisma.$executeRaw`DELETE FROM _ComicToTag`
  await prisma.tag.deleteMany()
  await prisma.comic.deleteMany()
  await prisma.creditPackage.deleteMany()
  await prisma.siweNonce.deleteMany()
  await prisma.settings.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')
  const createdUsers = []
  for (const userData of sampleUsers) {
    const user = await prisma.user.create({
      data: userData
    })
    createdUsers.push(user)
  }

  // Create credit packages
  console.log('💰 Creating credit packages...')
  for (const packageData of creditPackages) {
    await prisma.creditPackage.create({
      data: packageData
    })
  }

  // Create tags
  console.log('🏷️  Creating tags...')
  const createdTags = []
  for (const tagName of tags) {
    const tag = await prisma.tag.create({
      data: { name: tagName }
    })
    createdTags.push(tag)
  }

  // Create comics with volumes and chapters
  console.log('📚 Creating comics...')
  for (const comicData of comics) {
    // Create comic
    const comic = await prisma.comic.create({
      data: {
        title: comicData.title,
        slug: comicData.slug,
        description: comicData.description,
        author: comicData.author,
        coverImage: `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`,
        genre: JSON.stringify(comicData.genre),
        status: comicData.status,
        featured: comicData.featured,
        freeChapters: 3
      }
    })

    // Connect tags
    const comicTags = createdTags.filter(tag => comicData.tags.includes(tag.name))
    if (comicTags.length > 0) {
      await prisma.comic.update({
        where: { id: comic.id },
        data: {
          tags: {
            connect: comicTags.map(tag => ({ id: tag.id }))
          }
        }
      })
    }

    // Create volumes and chapters
    const volumeCount = Math.random() > 0.7 ? 2 : 1
    let totalChapters = 0

    for (let volNum = 1; volNum <= volumeCount; volNum++) {
      const volume = await prisma.volume.create({
        data: {
          comicId: comic.id,
          volumeNumber: volNum,
          title: `Volume ${volNum}`
        }
      })

      const remainingChapters = comicData.chapters - totalChapters
      const chaptersInVolume = volumeCount === 1 
        ? comicData.chapters 
        : volNum === volumeCount 
          ? remainingChapters
          : Math.ceil(comicData.chapters / volumeCount)

      for (let chNum = 1; chNum <= chaptersInVolume; chNum++) {
        const globalChapterNum = totalChapters + chNum
        const isFree = globalChapterNum <= 3

        const chapter = await prisma.chapter.create({
          data: {
            volumeId: volume.id,
            chapterNumber: globalChapterNum,
            title: `Chapter ${globalChapterNum}: ${getRandomChapterTitle()}`,
            unlockCost: isFree ? 0 : 5,
            isFree: isFree
          }
        })

        // Create pages for each chapter
        const pageCount = Math.floor(Math.random() * 3) + 3 // 3-5 pages
        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          await prisma.page.create({
            data: {
              chapterId: chapter.id,
              pageNumber: pageNum,
              imageUrl: `https://picsum.photos/800/1200?random=${Math.floor(Math.random() * 10000)}`,
              width: 800,
              height: 1200
            }
          })
        }
      }
      totalChapters += chaptersInVolume
    }

    console.log(`  ✅ Created "${comic.title}" with ${totalChapters} chapters`)
  }

  // Create some sample transactions and unlocks
  console.log('💳 Creating sample transactions...')
  const regularUser = createdUsers.find(u => u.username === 'premium_reader')!
  
  // Credit purchase transaction
  await prisma.transaction.create({
    data: {
      userId: regularUser.id,
      type: TransactionType.PURCHASE,
      amount: 300,
      description: "Premium Pack Purchase",
      transactionHash: "0xabcdef123456789",
      status: TransactionStatus.CONFIRMED
    }
  })

  // Some chapter unlocks
  const someComics = await prisma.comic.findMany({
    include: {
      volumes: {
        include: {
          chapters: true
        }
      }
    },
    take: 3
  })

  for (const comic of someComics) {
    const paidChapters = comic.volumes
      .flatMap(v => v.chapters)
      .filter(c => !c.isFree)
      .slice(0, 2)

    for (const chapter of paidChapters) {
      await prisma.userChapterUnlock.create({
        data: {
          userId: regularUser.id,
          chapterId: chapter.id,
          creditsSpent: chapter.unlockCost
        }
      })

      await prisma.transaction.create({
        data: {
          userId: regularUser.id,
          type: TransactionType.SPEND,
          amount: -chapter.unlockCost,
          description: `Unlocked "${chapter.title}"`,
          status: TransactionStatus.CONFIRMED
        }
      })

      // Add some reading progress
      const pages = await prisma.page.findMany({
        where: { chapterId: chapter.id }
      })

      if (pages.length > 0) {
        await prisma.readingProgress.create({
          data: {
            userId: regularUser.id,
            chapterId: chapter.id,
            pageNumber: Math.ceil(pages.length / 2)
          }
        })
      }
    }
  }

  // Create default settings
  console.log('⚙️ Creating default settings...')
  const defaultSettings = [
    // General Settings
    { key: 'site_title', value: 'Web3 Comic Platform', category: 'general' },
    { key: 'site_description', value: 'A decentralized comic reading platform with Web3 integration', category: 'general' },
    { key: 'site_logo', value: '/logo.png', category: 'general' },
    { key: 'favicon', value: '/favicon.ico', category: 'general' },
    { key: 'contact_email', value: 'admin@web3comics.com', category: 'general' },
    { key: 'copyright_text', value: '© 2024 Web3 Comic Platform. All rights reserved.', category: 'general' },
    
    // SEO Settings
    { key: 'meta_title_template', value: '%s | Web3 Comic Platform', category: 'seo' },
    { key: 'meta_description_template', value: 'Read %s and thousands of other comics on Web3 Comic Platform', category: 'seo' },
    { key: 'meta_keywords', value: 'web3, comics, manga, blockchain, NFT, decentralized', category: 'seo' },
    { key: 'og_title', value: 'Web3 Comic Platform', category: 'seo' },
    { key: 'og_description', value: 'A decentralized comic reading platform with Web3 integration', category: 'seo' },
    { key: 'og_image', value: '/og-image.png', category: 'seo' },
    { key: 'twitter_card_type', value: 'summary_large_image', category: 'seo' },
    { key: 'twitter_handle', value: '@web3comics', category: 'seo' },
    { key: 'canonical_url_base', value: 'https://web3comics.com', category: 'seo' },
    
    // Homepage Settings
    { key: 'hero_title', value: 'Welcome to Web3 Comics', category: 'homepage' },
    { key: 'hero_subtitle', value: 'Discover amazing comics in the decentralized universe', category: 'homepage' },
    { key: 'hero_cta_text', value: 'Start Reading', category: 'homepage' },
    { key: 'featured_comics_count', value: 6, category: 'homepage' },
    { key: 'show_latest_releases', value: true, category: 'homepage' },
    { key: 'show_popular_comics', value: true, category: 'homepage' },
    
    // Content Settings
    { key: 'default_free_chapters', value: 3, category: 'content' },
    { key: 'default_unlock_cost', value: 5, category: 'content' },
    { key: 'credits_per_dollar', value: 100, category: 'content' },
    { key: 'maintenance_mode', value: false, category: 'content' },
    { key: 'maintenance_message', value: 'We are currently under maintenance. Please check back soon!', category: 'content' },
    
    // Analytics Settings
    { key: 'google_analytics_id', value: '', category: 'analytics' },
    { key: 'google_tag_manager_id', value: '', category: 'analytics' },
    { key: 'facebook_pixel_id', value: '', category: 'analytics' },
    
    // Social Media Settings
    { key: 'twitter_url', value: '', category: 'social' },
    { key: 'discord_url', value: '', category: 'social' },
    { key: 'telegram_url', value: '', category: 'social' },
    { key: 'instagram_url', value: '', category: 'social' },
    { key: 'facebook_url', value: '', category: 'social' },
  ]

  for (const setting of defaultSettings) {
    await prisma.settings.create({
      data: setting
    })
  }

  console.log('✨ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`  - ${comics.length} comics`)
  console.log(`  - ${createdUsers.length} users`)
  console.log(`  - ${tags.length} tags`)
  console.log(`  - ${creditPackages.length} credit packages`)
  console.log(`  - ${defaultSettings.length} default settings`)
  console.log(`  - Sample transactions and reading progress`)
}

function getRandomChapterTitle(): string {
  const titles = [
    "The Beginning",
    "New Discoveries",
    "First Challenge", 
    "Hidden Secrets",
    "The Training",
    "Unexpected Ally",
    "Dark Revelation",
    "The Battle Begins",
    "Ancient Power",
    "Mysterious Enemy",
    "The Chosen One",
    "Forbidden Knowledge",
    "Rising Storm",
    "The Awakening",
    "Final Confrontation",
    "New Horizons",
    "The Journey Continues",
    "Unraveling Truth",
    "The Test",
    "Destiny Calls"
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })