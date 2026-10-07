import { TourActivity, TohokuPrefecture, Reservation, AutomatedEmailLog } from '../types/tour';

// Helper to generate dynamic dates starting from today onwards
export function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const TOHOKU_PREFECTURES: { name: TohokuPrefecture; kanji: string; description: string; highlights: string }[] = [
  { name: 'Aomori', kanji: '青森県', description: 'Deep moss gorges, primordial beech forests & Nebuta spirit', highlights: 'Oirase Gorge, Lake Towada, Hirosaki Castle' },
  { name: 'Iwate', kanji: '岩手県', description: 'UNESCO Pure Land temples, Sanriku coast & ironware heritage', highlights: 'Hiraizumi Chuson-ji, Geibikei Gorge' },
  { name: 'Miyagi', kanji: '宮城県', description: 'Pine-studded coastal bays, Sendai castle & artisan craft villages', highlights: 'Matsushima Bay, Akiu Onsen, Naruko' },
  { name: 'Akita', kanji: '秋田県', description: 'Samurai alleys, secluded Nyuto hot springs & cedar aroma', highlights: 'Kakunodate, Lake Tazawa, Namahage' },
  { name: 'Yamagata', kanji: '山形県', description: 'Cliff-carved stone temples, Taisho onsen & snow monsters', highlights: 'Yamadera, Ginzan Onsen, Mt. Zao' },
  { name: 'Fukushima', kanji: '福島県', description: 'Edo postal stations, mystic cobalt lakes & castle ramparts', highlights: 'Ouchi-juku, Goshikinuma, Aizu-Wakamatsu' },
];

export const TOHOKU_VIDEOS = [
  {
    id: 'oirase',
    title: 'Oirase Mountain Stream & Primeval Forest',
    titleJp: '奥入瀬渓流 · 青森',
    prefecture: 'Aomori' as TohokuPrefecture,
    description: 'Emerald moss boulders, 14 rushing waterfalls and ancient beech canopies in Towada-Hachimantai National Park.',
    videoUrl: 'https://assets.mixkit.co/videos/1202/1202-720.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    tags: ['Waterfalls', 'Ancient Beech Forest', 'National Park'],
  },
  {
    id: 'yamadera',
    title: 'Yamadera Clifftop Temple & Cloud Ridge',
    titleJp: '山寺 立石寺 · 山形',
    prefecture: 'Yamagata' as TohokuPrefecture,
    description: '1,015 ancient mossy stone steps ascending through sacred cedar forests to sheer cliff pavilions built in 860 AD.',
    videoUrl: 'https://assets.mixkit.co/videos/42835/42835-720.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cliff Sanctuary', 'Matsuo Basho Trail', 'Spiritual Heritage'],
  },
  {
    id: 'ginzan',
    title: 'Ginzan Onsen Gas-Lantern Twilight',
    titleJp: '銀山温泉 · 山形',
    prefecture: 'Yamagata' as TohokuPrefecture,
    description: 'Timeless Taisho-era multi-tiered timber ryokans lining a misted thermal stream with glowing gas street lamps.',
    videoUrl: 'https://assets.mixkit.co/videos/1392/1392-720.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1920&q=80',
    tags: ['Historic Ryokan', 'Thermal Hot Springs', 'Taisho Era'],
  },
  {
    id: 'matsushima',
    title: 'Matsushima Bay & 260 Pine Islands',
    titleJp: '松島湾 · 宮城',
    prefecture: 'Miyagi' as TohokuPrefecture,
    description: 'Ranked as one of Japan’s Three Sacred Views, where weathered sandstone islets with bonsai-like black pines float on sapphire waters.',
    videoUrl: 'https://assets.mixkit.co/videos/42651/42651-720.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1920&q=80',
    tags: ['Nihon Sankei', 'Coastal Cruise', 'Tea Pavilion'],
  },
  {
    id: 'zao',
    title: 'Mount Zao Alpine Ridge & Frost Trees',
    titleJp: '蔵王連峰 · 山形/宮城',
    prefecture: 'Yamagata' as TohokuPrefecture,
    description: 'High volcanic ridges with glacial Siberian winds shaping the famous "Snow Monsters" (Juhyo) and steamy sulfur springs.',
    videoUrl: 'https://assets.mixkit.co/videos/4028/4028-720.mp4',
    fallbackPoster: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1920&q=80',
    tags: ['Alpine Ridges', 'Crater Lake', 'Wilderness'],
  }
];

export const INITIAL_TOURS: TourActivity[] = [
  {
    id: 'oirase-gorge-trek',
    title: 'Oirase Stream Primordial Moss & Waterfall Expedition',
    titleJp: '奥入瀬渓流 苔と滝のネイチャーウォーク',
    prefecture: 'Aomori',
    prefectureJp: '青森県',
    category: 'Nature & Trekking',
    duration: '4.5 Hours',
    difficulty: 'Moderate',
    maxGroupSize: 10,
    basePriceJPY: 12500,
    ratingScore: 4.95,
    reviewsCount: 148,
    meetingPoint: 'Yakeyama Trailhead Station, Towada Lake North Bus Terminal',
    meetingPointAddress: 'Okuse, Towada, Aomori Prefecture 034-0301',
    meetingPointCoordinates: { lat: 40.5892, lng: 140.9785 },
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/1202/1202-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Emerald waters carving through 300-year-old beech groves',
    shortDescription: 'Trek along 14 pristine waterfalls, emerald moss-cloaked volcanic stones, and deep virgin beech canopies accompanied by a licensed Tohoku naturalist.',
    fullDescription: 'Flowing from the volcanic rim of Lake Towada, the Oirase Stream is considered one of Japan’s most spiritually evocative river walks. Walk alongside the thundering Choshi Waterfall, cross narrow wooden bridges over swirling rapids, and examine over 300 rare moss varieties with our provided botanical magnifying loupes.',
    highlights: [
      'Exclusive access to hidden Choshi and Ashura waterfalls',
      'Botanical micro-inspection of UNESCO candidate moss species',
      'Artisan local bento lunch with Towada lake trout and fresh wasabi',
      'Small group size (max 10 travelers) for serene wilderness immersion'
    ],
    included: ['Certified English/Japanese naturalist guide', 'Artisan bento lunch box & green tea', 'Hiking poles & botanical loupe', 'Trail insurance'],
    notIncluded: ['Hotel transfers (bus direct from Shin-Aomori Station available)', 'Personal rainwear'],
    whatToBring: ['Sturdy hiking shoes or boots', 'Breathable rain jacket', 'Refillable water bottle', 'Camera / Smartphone'],
    activeViewersCount: 6,
    schedules: [
      {
        date: getRelativeDate(0), // Today
        slots: [
          { id: 'oir-today-1', time: '08:30 - 13:00', label: 'Morning Mist & Falls', capacity: 10, bookedSeats: 8, priceJPY: 12500, isActive: true },
          { id: 'oir-today-2', time: '13:30 - 18:00', label: 'Sunlight Canopy Trek', capacity: 10, bookedSeats: 9, priceJPY: 12500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1), // Tomorrow
        slots: [
          { id: 'oir-tmr-1', time: '08:30 - 13:00', label: 'Morning Mist & Falls', capacity: 10, bookedSeats: 7, priceJPY: 12500, isActive: true },
          { id: 'oir-tmr-2', time: '13:30 - 18:00', label: 'Sunlight Canopy Trek', capacity: 10, bookedSeats: 4, priceJPY: 12500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(2),
        slots: [
          { id: 'oir-d2-1', time: '08:30 - 13:00', label: 'Morning Mist & Falls', capacity: 10, bookedSeats: 3, priceJPY: 12500, isActive: true },
          { id: 'oir-d2-2', time: '13:30 - 18:00', label: 'Sunlight Canopy Trek', capacity: 10, bookedSeats: 2, priceJPY: 12500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(3),
        slots: [
          { id: 'oir-d3-1', time: '08:30 - 13:00', label: 'Morning Mist & Falls', capacity: 10, bookedSeats: 1, priceJPY: 12500, isActive: true },
          { id: 'oir-d3-2', time: '13:30 - 18:00', label: 'Sunlight Canopy Trek', capacity: 10, bookedSeats: 0, priceJPY: 12500, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'yamadera-temple-hike',
    title: 'Yamadera Mountain Cliff Temple & Basho Haiku Pilgrimage',
    titleJp: '山寺 宝珠山立石寺 1015段の祈り登山',
    prefecture: 'Yamagata',
    prefectureJp: '山形県',
    category: 'Spiritual & Temples',
    duration: '3.5 Hours',
    difficulty: 'Moderate',
    maxGroupSize: 12,
    basePriceJPY: 9800,
    ratingScore: 4.98,
    reviewsCount: 214,
    meetingPoint: 'JR Yamadera Station Main Exit (Senen-no-Yu Square)',
    meetingPointAddress: 'Yamadera, Yamagata-shi, Yamagata Prefecture 999-3301',
    meetingPointCoordinates: { lat: 38.3129, lng: 140.4361 },
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/42835/42835-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Ancient steps carved into rocky pinnacles since 860 AD',
    shortDescription: 'Climb 1,015 stone steps through towering Japanese cedars to the cliff-edge Godaido observation hall, where poet Matsuo Basho composed his famous cicada haiku.',
    fullDescription: 'Established in 860 AD by the Tendai Buddhist priest Jikaku Daishi, Risshaku-ji (popularly Yamadera) clings dramatically to vertical rock formations. Each step climbed is traditionally believed to cleanse a worldly desire. Learn about Tendai philosophy, hear the echoing temple bells, and savor fresh handmade buckwheat soba at the mountain foot.',
    highlights: [
      'Exclusive historical narration of Matsuo Basho’s "Narrow Road to the Deep North"',
      'Sweeping 180-degree panoramic vista from cliff-hanging Godaido stage',
      'Post-climb artisanal Yamagata Soba tasting & local fruit jelly',
      'Temple entrance stamp (Goshuin) assistance'
    ],
    included: ['Temple admission tickets', 'Local cultural historian guide', 'Traditional handmade buckwheat soba lunch', 'Temple souvenir prayer cedar charm'],
    notIncluded: ['Personal transportation to Yamadera Station', 'Optional Goshuin calligraphy fee (¥500)'],
    whatToBring: ['Comfortable sneakers with good grip', 'Sweat towel', 'Modest clothing covering shoulders'],
    activeViewersCount: 4,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'yam-today-1', time: '09:00 - 12:30', label: 'Morning Chime Ascend', capacity: 12, bookedSeats: 11, priceJPY: 9800, isActive: true },
          { id: 'yam-today-2', time: '13:30 - 17:00', label: 'Golden Hour Panorama', capacity: 12, bookedSeats: 9, priceJPY: 9800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'yam-tmr-1', time: '09:00 - 12:30', label: 'Morning Chime Ascend', capacity: 12, bookedSeats: 6, priceJPY: 9800, isActive: true },
          { id: 'yam-tmr-2', time: '13:30 - 17:00', label: 'Golden Hour Panorama', capacity: 12, bookedSeats: 8, priceJPY: 9800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(2),
        slots: [
          { id: 'yam-d2-1', time: '09:00 - 12:30', label: 'Morning Chime Ascend', capacity: 12, bookedSeats: 4, priceJPY: 9800, isActive: true },
          { id: 'yam-d2-2', time: '13:30 - 17:00', label: 'Golden Hour Panorama', capacity: 12, bookedSeats: 3, priceJPY: 9800, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'ginzan-onsen-twilight',
    title: 'Ginzan Onsen Gas-Lamp Twilight & Taisho Heritage Walk',
    titleJp: '銀山温泉 ガス灯灯る大正ロマン宵の散策',
    prefecture: 'Yamagata',
    prefectureJp: '山形県',
    category: 'Onsen & Heritage',
    duration: '4.0 Hours',
    difficulty: 'Easy',
    maxGroupSize: 8,
    basePriceJPY: 16800,
    ratingScore: 4.97,
    reviewsCount: 310,
    meetingPoint: 'Ginzan Onsen Main Bridge (Shirogane-bashi)',
    meetingPointAddress: 'Ginzan Shinhata, Obanazawa, Yamagata Prefecture 999-4333',
    meetingPointCoordinates: { lat: 38.5705, lng: 140.5303 },
    heroImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/1392/1392-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Warm gas lanterns reflecting on thermal river currents',
    shortDescription: 'Step straight into an animate dream in Japan’s most atmospheric onsen gorge. Explore 4-story timber bathhouses, sample fried tofu, and enjoy footbaths.',
    fullDescription: 'Once a flourishing Edo-period silver mine, Ginzan Onsen is framed by Taisho-era multi-tiered wooden inns adorned with plaster relief sculptures (kote-e). As twilight descends, gas street lamps ignite one by one along the misty thermal river. Experience public hot spring baths, stroll along the illuminated Shirogane waterfall, and taste local Obanazawa beef croquettes.',
    highlights: [
      'Private twilight photography escort during blue-hour gas lamp lighting',
      'Complimentary access to historic public hot spring bathhouse',
      'Shirogane waterfall night illumination walk',
      'Fresh local onsen manju and hot tea tasting'
    ],
    included: ['Expert local guide', 'Public bath entrance ticket & bath towel kit', 'Tasting snacks (tofu, manju, croquette)', 'Warm traditional haori coat during winter'],
    notIncluded: ['Private ryokan room overnight stay', 'Alcoholic beverages'],
    whatToBring: ['Easy slip-on walking shoes', 'Camera with low-light capability', 'Warm outer layer'],
    activeViewersCount: 9,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'gin-today-1', time: '16:00 - 20:00', label: 'Gas Lantern Blue Hour', capacity: 8, bookedSeats: 7, priceJPY: 16800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'gin-tmr-1', time: '16:00 - 20:00', label: 'Gas Lantern Blue Hour', capacity: 8, bookedSeats: 8, priceJPY: 16800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(2),
        slots: [
          { id: 'gin-d2-1', time: '16:00 - 20:00', label: 'Gas Lantern Blue Hour', capacity: 8, bookedSeats: 5, priceJPY: 16800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(3),
        slots: [
          { id: 'gin-d3-1', time: '16:00 - 20:00', label: 'Gas Lantern Blue Hour', capacity: 8, bookedSeats: 3, priceJPY: 16800, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'matsushima-bay-cruise',
    title: 'Matsushima Bay Pine Islets Yacht Cruise & Tea Ceremony',
    titleJp: '日本三景 松島湾 260島巡り＆観瀾亭 抹茶茶道',
    prefecture: 'Miyagi',
    prefectureJp: '宮城県',
    category: 'Spiritual & Temples',
    duration: '3.0 Hours',
    difficulty: 'Easy',
    maxGroupSize: 14,
    basePriceJPY: 11000,
    ratingScore: 4.91,
    reviewsCount: 182,
    meetingPoint: 'Matsushima Pier Terminal 1 (Near Matsushimakaigan Station)',
    meetingPointAddress: 'Chonai-98-1 Matsushima, Miyagi-gun, Miyagi Prefecture 981-0213',
    meetingPointCoordinates: { lat: 38.3695, lng: 141.0638 },
    heroImage: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/42651/42651-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Gnarled pines rooted on 260 sandstone islands',
    shortDescription: 'Sail through the 260 pine-crested islets of Matsushima Bay on a private boat charter, followed by authentic ceremonial matcha at Kanrantei (Moon-Viewing Villa).',
    fullDescription: 'Celebrated for over a millennium as one of Japan’s Three Sacred Views, Matsushima’s calm bay is dotted with 260 craggy sandstone islands crowned with sculpted black and red pines. Sail beyond the crowded tourist ferries into tranquil channels, then disembark at the historic Kanrantei tea house, gifted by warlord Toyotomi Hideyoshi to Date Masamune.',
    highlights: [
      'Private vessel navigating serene lesser-known islet archipelagos',
      'Authentic matcha tea ceremony overlooking the glistening bay',
      'Historic Date Clan samurai heritage insights',
      'Freshly roasted Matsushima oyster tasting sample'
    ],
    included: ['Charter boat cruise ticket', 'Kanrantei admission & VIP tea ceremony matcha set', 'Certified bilingual maritime guide', 'Snack tasting'],
    notIncluded: ['Station transit tickets', 'Additional seafood meals'],
    whatToBring: ['Light windbreaker', 'Sunglasses', 'Camera'],
    activeViewersCount: 5,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'mat-today-1', time: '10:00 - 13:00', label: 'Morning Breeze Sail', capacity: 14, bookedSeats: 12, priceJPY: 11000, isActive: true },
          { id: 'mat-today-2', time: '14:00 - 17:00', label: 'Afternoon Reflection Sail', capacity: 14, bookedSeats: 9, priceJPY: 11000, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'mat-tmr-1', time: '10:00 - 13:00', label: 'Morning Breeze Sail', capacity: 14, bookedSeats: 7, priceJPY: 11000, isActive: true },
          { id: 'mat-tmr-2', time: '14:00 - 17:00', label: 'Afternoon Reflection Sail', capacity: 14, bookedSeats: 6, priceJPY: 11000, isActive: true }
        ]
      },
      {
        date: getRelativeDate(2),
        slots: [
          { id: 'mat-d2-1', time: '10:00 - 13:00', label: 'Morning Breeze Sail', capacity: 14, bookedSeats: 3, priceJPY: 11000, isActive: true },
          { id: 'mat-d2-2', time: '14:00 - 17:00', label: 'Afternoon Reflection Sail', capacity: 14, bookedSeats: 2, priceJPY: 11000, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'zao-snow-monsters',
    title: 'Mount Zao Alpine Snow Monsters & Crater Lake Snowshoeing',
    titleJp: '蔵王 樹氷原スノーシュー＆火口湖「御釜」探訪',
    prefecture: 'Yamagata',
    prefectureJp: '山形県',
    category: 'Nature & Trekking',
    duration: '5.0 Hours',
    difficulty: 'Challenging',
    maxGroupSize: 8,
    basePriceJPY: 15500,
    ratingScore: 4.96,
    reviewsCount: 165,
    meetingPoint: 'Zao Onsen Ropeway Sanroku Station Base',
    meetingPointAddress: 'Zao Onsen, Yamagata Prefecture 990-2301',
    meetingPointCoordinates: { lat: 38.1672, lng: 140.3957 },
    heroImage: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/4028/4028-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Towering icy fir trees sculpted by sub-zero Siberian winds',
    shortDescription: 'Ascend the aerial ropeway into the high alpine frost zone to walk amongst hundreds of towering Juhyo (ice tree monsters) and view Okama volcanic caldera.',
    fullDescription: 'Created by Siberian cold air fronts blowing moisture across the Sea of Japan that freezes instantly onto Maries’ fir branches, Mount Zao’s Juhyo are a rare global phenomenon. Equipped with modern MSR snowshoes and guided by licensed mountain safety experts, trek along the gentle summit ridges and warm up in a steamy alpine lodge with Yamagata hot pot.',
    highlights: [
      'Summit ropeway ticket with priority fast-track boarding',
      'Premium lightweight snowshoes, trekking poles & gaiters provided',
      'Hot Imoni beef & taro hot pot lunch at the alpine observatory',
      'Safety beacons and certified alpine mountain guide'
    ],
    included: ['Round-trip Zao Ropeway pass', 'Snowshoe gear & poles rental', 'Imoni hot lunch & hot beverage', 'Mountain guide & avalanche beacon'],
    notIncluded: ['Ski jacket & insulated snow trousers rental (available for ¥2,500)'],
    whatToBring: ['Thermal base layers', 'Waterproof gloves & beanie', 'Snow goggles or UV sunglasses'],
    activeViewersCount: 7,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'zao-today-1', time: '09:30 - 14:30', label: 'Summit Ridge Exploration', capacity: 8, bookedSeats: 7, priceJPY: 15500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'zao-tmr-1', time: '09:30 - 14:30', label: 'Summit Ridge Exploration', capacity: 8, bookedSeats: 5, priceJPY: 15500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(2),
        slots: [
          { id: 'zao-d2-1', time: '09:30 - 14:30', label: 'Summit Ridge Exploration', capacity: 8, bookedSeats: 4, priceJPY: 15500, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'hiraizumi-pure-land',
    title: 'Hiraizumi Chuson-ji Golden Hall & World Heritage Spiritual Walk',
    titleJp: '平泉 中尊寺金色堂と毛越寺 浄土庭園の旅',
    prefecture: 'Iwate',
    prefectureJp: '岩手県',
    category: 'Spiritual & Temples',
    duration: '4.0 Hours',
    difficulty: 'Easy',
    maxGroupSize: 10,
    basePriceJPY: 10500,
    ratingScore: 4.93,
    reviewsCount: 129,
    meetingPoint: 'JR Hiraizumi Station Information Hall',
    meetingPointAddress: 'Hiraizumi, Nishiiwai District, Iwate Prefecture 029-4102',
    meetingPointCoordinates: { lat: 38.9868, lng: 141.1136 },
    heroImage: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/42835/42835-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Gleaming 12th century gold leaf sanctuary dedicated to peace',
    shortDescription: 'Witness the pure gold leaf pavilion of Konjikido and the tranquil 12th-century Pure Land garden of Motsu-ji, reflecting the northern Fujiwara dynasty vision of heaven.',
    fullDescription: 'In the 12th century, the Northern Fujiwara clan envisioned Hiraizumi as a peaceful realm of Buddhist enlightenment after devastating wars. Walk along the historic Tsukimi-zaka slope flanked by centuries-old cryptomeria trees, visit the completely gold-gilded Konjikido hall holding the mummies of three Fujiwara rulers, and discover the pristine pond philosophy of Motsu-ji.',
    highlights: [
      'Konjikido Gold Hall priority access ticket included',
      'Pure Land Buddhist stone garden guided contemplation',
      'Wanko Soba challenge lunch or Iwate Maesawa beef tasting',
      'Ancient cedar avenue historical photo walk'
    ],
    included: ['Chuson-ji and Motsu-ji admission passes', 'Licensed English heritage docent', 'Specialty Iwate lunch', 'Heritage guidebook'],
    notIncluded: ['Shinkansen train fares', 'Personal souvenirs'],
    whatToBring: ['Walking shoes', 'Sun hat / Umbrella depending on weather'],
    activeViewersCount: 3,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'hir-today-1', time: '09:30 - 13:30', label: 'Morning Pure Land Walk', capacity: 10, bookedSeats: 8, priceJPY: 10500, isActive: true },
          { id: 'hir-today-2', time: '13:30 - 17:30', label: 'Afternoon Golden Glow Walk', capacity: 10, bookedSeats: 6, priceJPY: 10500, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'hir-tmr-1', time: '09:30 - 13:30', label: 'Morning Pure Land Walk', capacity: 10, bookedSeats: 5, priceJPY: 10500, isActive: true },
          { id: 'hir-tmr-2', time: '13:30 - 17:30', label: 'Afternoon Golden Glow Walk', capacity: 10, bookedSeats: 4, priceJPY: 10500, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'kakunodate-samurai-craft',
    title: 'Kakunodate Samurai Quarter & Sakura Bark Craft Workshop',
    titleJp: '角館 武家屋敷通り散策＆樺細工（桜皮）伝統工芸体験',
    prefecture: 'Akita',
    prefectureJp: '秋田県',
    category: 'Culinary & Crafts',
    duration: '3.5 Hours',
    difficulty: 'Easy',
    maxGroupSize: 10,
    basePriceJPY: 11800,
    ratingScore: 4.89,
    reviewsCount: 94,
    meetingPoint: 'Kakunodate Denshokan Craft Museum Front Gate',
    meetingPointAddress: '39 Omotemachishitamachi, Kakunodate-machi, Semboku, Akita 014-0331',
    meetingPointCoordinates: { lat: 39.5964, lng: 140.5623 },
    heroImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/1202/1202-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Black wooden board samurai fences & weeping cherry canopies',
    shortDescription: 'Wander authentic Edo-era samurai mansions of the "Little Kyoto of Tohoku" and craft your own tea caddy accessory using wild mountain cherry bark (Kabazaiku).',
    fullDescription: 'Kakunodate retains the purest samurai district in northern Japan, with broad avenues lined by black wooden fences and weeping cherry trees. Tour inside the Aoyagi and Ishiguro samurai homes with a descendant docent, admire authentic armor and katanas, then sit alongside a master artisan to craft a keepsake with lustrous wild cherry bark.',
    highlights: [
      'VIP interior tour of 400-year-old Aoyagi Samurai Manor',
      'Hands-on cherry bark (Kabazaiku) coaster crafting with master artisan',
      'Inaniwa hand-stretched Udon noodles lunch',
      'Local Akita Hinai-jidori chicken snack tasting'
    ],
    included: ['Samurai manor admissions', 'Craft workshop materials & finished keepsake', 'Inaniwa udon lunch meal', 'Bilingual guide'],
    notIncluded: ['Kimono rental (optional ¥3,500 addon)'],
    whatToBring: ['Socks (shoes removed inside wooden samurai homes)', 'Camera'],
    activeViewersCount: 2,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'kak-today-1', time: '10:00 - 13:30', label: 'Samurai Heritage & Craft', capacity: 10, bookedSeats: 8, priceJPY: 11800, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'kak-tmr-1', time: '10:00 - 13:30', label: 'Samurai Heritage & Craft', capacity: 10, bookedSeats: 5, priceJPY: 11800, isActive: true }
        ]
      }
    ]
  },
  {
    id: 'ouchi-juku-fukushima',
    title: 'Ouchi-juku Thatched Roof Post Village & Leek Soba Experience',
    titleJp: '大内宿 茅葺き屋根の宿場町と名物「ねぎそば」体験',
    prefecture: 'Fukushima',
    prefectureJp: '福島県',
    category: 'Culinary & Crafts',
    duration: '4.0 Hours',
    difficulty: 'Easy',
    maxGroupSize: 12,
    basePriceJPY: 10200,
    ratingScore: 4.92,
    reviewsCount: 118,
    meetingPoint: 'Ouchi-juku Welcome Plaza Gate (Near Yunokami Onsen Station)',
    meetingPointAddress: 'Ouchi Yamamoto, Shimogo, Minamiaizu District, Fukushima 969-5207',
    meetingPointCoordinates: { lat: 37.3341, lng: 139.8608 },
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    videoClipUrl: 'https://assets.mixkit.co/videos/1392/1392-720.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    videoTitle: 'Edo-period thatched roof postal street nestled in mountain mists',
    shortDescription: 'Step back 300 years to an Edo-period post town lined with thatched roofs. Learn the curious tradition of eating fresh buckwheat soba using a whole green leek as chopsticks.',
    fullDescription: 'Resting in the tranquil mountain pass between Aizu and Nikko, Ouchi-juku served lords traveling to Edo (Tokyo). Over 30 authentic thatched-roof houses remain today with unpaved streets and natural drainage channels. Ascend to the village shrine lookout for the iconic viewpoint, roast sweet river char over sunken charcoal hearths, and savor authentic Negi Soba.',
    highlights: [
      'Iconic elevated panoramic overlook of the entire thatched village',
      'Traditional "Negi Soba" lunch eaten with a long scallion stalk',
      'Charcoal-roasted sweet river char (Iwana) snack',
      'Fukushima Aizu ceramic craft and lacquerware viewing'
    ],
    included: ['Local heritage guide', 'Famous Negi Soba set meal', 'Grilled river fish tasting', 'Town preservation fund fee'],
    notIncluded: ['Transportation to Yunokami Onsen Station', 'Personal shopping'],
    whatToBring: ['Comfortable walking shoes', 'Cash for small rural craft stalls'],
    activeViewersCount: 4,
    schedules: [
      {
        date: getRelativeDate(0),
        slots: [
          { id: 'ouc-today-1', time: '10:30 - 14:30', label: 'Edo Post Town Journey', capacity: 12, bookedSeats: 10, priceJPY: 10200, isActive: true }
        ]
      },
      {
        date: getRelativeDate(1),
        slots: [
          { id: 'ouc-tmr-1', time: '10:30 - 14:30', label: 'Edo Post Town Journey', capacity: 12, bookedSeats: 4, priceJPY: 10200, isActive: true }
        ]
      }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'THK-8921-X',
    tourId: 'oirase-gorge-trek',
    tourTitle: 'Oirase Stream Primordial Moss & Waterfall Expedition',
    tourTitleJp: '奥入瀬渓流 苔と滝のネイチャーウォーク',
    prefecture: 'Aomori',
    date: getRelativeDate(0),
    timeSlotId: 'oir-today-1',
    timeSlotLabel: 'Morning Mist & Falls',
    slotTime: '08:30 - 13:00',
    leadGuest: {
      fullName: 'Elena Rostova',
      email: 'elena@example.com',
      phone: '',
      country: 'United States',
      specialRequests: 'Vegetarian bento requested, interested in nature photography tips',
      dietaryNotes: 'Vegetarian'
    },
    adultsCount: 2,
    childrenCount: 0,
    totalSeats: 2,
    unitPriceJPY: 12500,
    totalPriceJPY: 25000,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    confirmationEmailSent: true,
    emailSentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    qrCodeToken: 'THK-QR-8921-X-AOMORI-OIRASE',
    meetingPoint: 'Yakeyama Trailhead Station, Towada Lake North Bus Terminal'
  },
  {
    id: 'THK-7412-M',
    tourId: 'ginzan-onsen-twilight',
    tourTitle: 'Ginzan Onsen Gas-Lamp Twilight & Taisho Heritage Walk',
    tourTitleJp: '銀山温泉 ガス灯灯る大正ロマン宵の散策',
    prefecture: 'Yamagata',
    date: getRelativeDate(1),
    timeSlotId: 'gin-tmr-1',
    timeSlotLabel: 'Gas Lantern Blue Hour',
    slotTime: '16:00 - 20:00',
    leadGuest: {
      fullName: 'Marcus Vance',
      email: 'marcus@example.com',
      phone: '',
      country: 'United Kingdom',
      specialRequests: 'Celebrating wedding anniversary. Low-light camera tripod permitted?'
    },
    adultsCount: 2,
    childrenCount: 0,
    totalSeats: 2,
    unitPriceJPY: 16800,
    totalPriceJPY: 33600,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    confirmationEmailSent: true,
    emailSentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    qrCodeToken: 'THK-QR-7412-M-YAMAGATA-GINZAN',
    meetingPoint: 'Ginzan Onsen Main Bridge (Shirogane-bashi)'
  },
  {
    id: 'THK-5109-K',
    tourId: 'yamadera-temple-hike',
    tourTitle: 'Yamadera Mountain Cliff Temple & Basho Haiku Pilgrimage',
    tourTitleJp: '山寺 宝珠山立石寺 1015段の祈り登山',
    prefecture: 'Yamagata',
    date: getRelativeDate(0),
    timeSlotId: 'yam-today-1',
    timeSlotLabel: 'Morning Chime Ascend',
    slotTime: '09:00 - 12:30',
    leadGuest: {
      fullName: 'Kenji Takahashi',
      email: 'kenji@example.com',
      phone: '',
      country: 'Japan',
      specialRequests: 'Elderly guest in party; will take regular pauses on stone stairways'
    },
    adultsCount: 3,
    childrenCount: 0,
    totalSeats: 3,
    unitPriceJPY: 9800,
    totalPriceJPY: 29400,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    confirmationEmailSent: true,
    emailSentAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    qrCodeToken: 'THK-QR-5109-K-YAMAGATA-YAMADERA',
    meetingPoint: 'JR Yamadera Station Main Exit (Senen-no-Yu Square)'
  }
];

export const INITIAL_EMAIL_LOGS: AutomatedEmailLog[] = [
  {
    id: 'EML-901',
    reservationId: 'THK-8921-X',
    recipientEmail: 'elena@example.com',
    recipientName: 'Elena Rostova',
    subject: 'Booking Confirmed: Oirase Stream Primordial Moss & Waterfall Expedition [Ref: THK-8921-X]',
    type: 'booking_confirmation',
    sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'delivered',
    tourTitle: 'Oirase Stream Primordial Moss & Waterfall Expedition',
    date: getRelativeDate(0),
    time: '08:30 - 13:00'
  },
  {
    id: 'EML-902',
    reservationId: 'THK-7412-M',
    recipientEmail: 'marcus@example.com',
    recipientName: 'Marcus Vance',
    subject: 'Booking Confirmed: Ginzan Onsen Gas-Lamp Twilight & Taisho Heritage Walk [Ref: THK-7412-M]',
    type: 'booking_confirmation',
    sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'opened',
    tourTitle: 'Ginzan Onsen Gas-Lamp Twilight & Taisho Heritage Walk',
    date: getRelativeDate(1),
    time: '16:00 - 20:00'
  },
  {
    id: 'EML-903',
    reservationId: 'THK-5109-K',
    recipientEmail: 'kenji@example.com',
    recipientName: 'Kenji Takahashi',
    subject: 'Booking Confirmed: Yamadera Mountain Cliff Temple & Basho Haiku Pilgrimage [Ref: THK-5109-K]',
    type: 'booking_confirmation',
    sentAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'opened',
    tourTitle: 'Yamadera Mountain Cliff Temple & Basho Haiku Pilgrimage',
    date: getRelativeDate(0),
    time: '09:00 - 12:30'
  }
];
