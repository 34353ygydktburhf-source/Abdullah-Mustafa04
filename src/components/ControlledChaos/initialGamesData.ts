export interface GamePackage {
  id: string;
  name: string;
  nameAr?: string;
  price: string;
  image?: string;
  popular?: boolean;
  discount?: number; // percentage
}

export interface GameFieldConfig {
  fields: { 
    key: string; 
    label: string; 
    placeholder: string; 
    required: boolean;
    type?: 'text' | 'select';
    options?: { label: string; value: string }[];
  }[];
  chargingInfo: string[];
  chargingMethod: string;
  deliveryTime: string;
}

export interface GameItem {
  id: string;
  name: string;
  nameAr?: string;
  cat: string;
  tags: string[];
  color: string;
  image: string;
  desc: string;
  descAr: string;
  category: string;
  packages?: GamePackage[];
  fieldConfig?: GameFieldConfig;
  discount?: number; // global percentage
  noPackagesMessage?: string;
  tutorialVideoUrl?: string;
  badge?: {
    text: string;
    color: string;
    icon?: string;
  };
  statements?: string[];
}

export const INITIAL_GAMES_DATA: GameItem[] = [
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    cat: "MOBILE",
    tags: ["UC", "Top-Up", "Mobile"],
    color: "bg-[#ff5e00]",
    image: "https://i.pinimg.com/1200x/bf/20/b1/bf20b1278bd054e85d1c429b87dfcc7a.jpg",
    desc: "Get UC, Royal Pass, and more for PUBG Mobile.",
    descAr: "احصل على الشدات وتصريح ببجي والمزيد.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "60 UC", nameAr: "60 شدة", price: "25", image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
      { id: "pkg2", name: "325 UC", nameAr: "325 شدة", price: "120", image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
      { id: "pkg3", name: "660 UC", nameAr: "660 شدة", price: "230", popular: true, image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
      { id: "pkg4", name: "1800 UC", nameAr: "1800 شدة", price: "600", image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
      { id: "pkg5", name: "3850 UC", nameAr: "3850 شدة", price: "1200", image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
      { id: "pkg6", name: "8100 UC", nameAr: "8100 شدة", price: "2400", image: "https://i.pinimg.com/1200x/a1/e5/5c/a1e55cd5aaf0cc7ac32525adf4ff0506.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerId", label: "Player ID", placeholder: "أدخل Player ID الخاص بك", required: true },
        { key: "serverId", label: "Server ID (Zone ID)", placeholder: "مثال: 5XXX", required: false },
      ],
      chargingInfo: ["يتم الشحن عبر ID مباشرة بدون كلمة سر", "تأكد من صحة الـ ID قبل الإرسال", "الشحن يتم خلال دقائق من تأكيد الدفع"],
      chargingMethod: "Vodafone Cash / InstaPay / تحويل بنكي",
      deliveryTime: "5 - 15 دقيقة",
    },
    tutorialVideoUrl: "https://v1.pinimg.com/videos/mc/720p/28/a5/09/28a509f1b47ab7794358a0cb7339fe19.mp4",
    discount: 15,
    badge: { text: "الأكثر طلباً", color: "bg-red-600", icon: "Flame" }
  },
  {
    id: "cod-mobile",
    name: "Call of Duty Mobile",
    cat: "MOBILE",
    tags: ["CP", "Top-Up", "Mobile"],
    color: "bg-[#b084ff]",
    image: "",
    desc: "COD Points and Battle Pass for COD Mobile.",
    descAr: "نقاط COD وتصريح المعركة.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "80 CP", nameAr: "80 نقطة", price: "30", image: "https://i.pinimg.com/736x/25/5b/42/255b42d170bcb6be7a9306d3e7534423.jpg" },
      { id: "pkg2", name: "400 CP", nameAr: "400 نقطة", price: "140", image: "https://i.pinimg.com/736x/25/5b/42/255b42d170bcb6be7a9306d3e7534423.jpg" },
      { id: "pkg3", name: "880 CP", nameAr: "880 نقطة", price: "280", popular: true, image: "https://i.pinimg.com/736x/25/5b/42/255b42d170bcb6be7a9306d3e7534423.jpg" },
      { id: "pkg4", name: "2400 CP", nameAr: "2400 نقطة", price: "750", image: "https://i.pinimg.com/736x/25/5b/42/255b42d170bcb6be7a9306d3e7534423.jpg" },
      { id: "pkg5", name: "5000 CP", nameAr: "5000 نقطة", price: "1500", image: "https://i.pinimg.com/736x/25/5b/42/255b42d170bcb6be7a9306d3e7534423.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerId", label: "Player UID", placeholder: "أدخل UID الخاص بك من إعدادات اللعبة", required: true },
        { key: "openId", label: "Open ID", placeholder: "أدخل Open ID (إن وجد)", required: false },
      ],
      chargingInfo: ["يمكنك إيجاد UID من داخل اللعبة > الإعدادات > Legal & Privacy", "الشحن يتم مباشرة على حسابك"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "5 - 30 دقيقة",
    },
    tutorialVideoUrl: "https://v1.pinterest.com/videos/mc/720p/28/a5/09/28a509f1b47ab7794358a0cb7339fe19.mp4",
    discount: 10
  },
  {
    id: "fortnite",
    name: "Fortnite",
    cat: "PC / CONSOLE",
    tags: ["V-Bucks", "Accounts", "PC"],
    color: "bg-[#ccff00]",
    image: "https://i.pinimg.com/1200x/c9/50/16/c950169b5759a63e05bfa25e12565f11.jpg",
    desc: "V-Bucks, Battle Pass, and premium accounts.",
    descAr: "في بوكس، تصريح المعركة، وحسابات مميزة.",
    category: "pc",
    packages: [
      { id: "pkg1", name: "1000 V-Bucks", price: "200", image: "https://i.pinimg.com/1200x/c1/01/e9/c101e952596d47d2b14bc8666a01d44a.jpg" },
      { id: "pkg2", name: "2800 V-Bucks", price: "500", popular: true, image: "https://i.pinimg.com/1200x/c1/01/e9/c101e952596d47d2b14bc8666a01d44a.jpg" },
      { id: "pkg3", name: "5000 V-Bucks", price: "850", image: "https://i.pinimg.com/1200x/c1/01/e9/c101e952596d47d2b14bc8666a01d44a.jpg" },
      { id: "pkg4", name: "13500 V-Bucks", price: "2000", image: "https://i.pinimg.com/1200x/c1/01/e9/c101e952596d47d2b14bc8666a01d44a.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "epicEmail", label: "Epic Games Email", placeholder: "أدخل إيميل حساب Epic Games", required: true },
        { key: "epicDisplay", label: "Display Name", placeholder: "اسم العرض في Epic Games", required: true },
      ],
      chargingInfo: ["يتم الشحن عبر حساب Epic Games", "لا نحتاج كلمة السر — فقط الإيميل واسم العرض", "قد يتطلب تأكيد عبر إيميل Epic"],
      chargingMethod: "Vodafone Cash / InstaPay / تحويل بنكي",
      deliveryTime: "15 - 60 دقيقة",
    },
    tutorialVideoUrl: "https://v1.pinterest.com/videos/mc/720p/28/a5/09/28a509f1b47ab7794358a0cb7339fe19.mp4"
  },
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    cat: "MOBILE",
    tags: ["RP", "Skins", "Mobile"],
    color: "bg-[#ff5e00]",
    image:"https://i.pinimg.com/1200x/7f/b7/ad/7fb7ad924a18548c812fefaa352c167c.jpg",
    desc: "Riot Points, skins, and champion bundles.",
    descAr: "جواهر وباقات أبطال.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "650 RP", price: "150", image: "https://i.pinimg.com/1200x/d0/22/50/d02250140705fc8af43e18f17c69d31e.jpg" },
      { id: "pkg2", name: "1380 RP", price: "300", popular: true, image: "https://i.pinimg.com/1200x/d0/22/50/d02250140705fc8af43e18f17c69d31e.jpg" },
      { id: "pkg3", name: "2800 RP", price: "580", image: "https://i.pinimg.com/1200x/d0/22/50/d02250140705fc8af43e18f17c69d31e.jpg" },
      { id: "pkg4", name: "5000 RP", price: "1000", image: "https://i.pinimg.com/1200x/d0/22/50/d02250140705fc8af43e18f17c69d31e.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerId", label: "Player ID", placeholder: "أدخل ID اللاعب من داخل اللعبة", required: true },
      ],
      chargingInfo: ["الشحن فوري عبر ID فقط", "لا نحتاج كلمة سر أو إيميل"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "1 - 10 دقائق",
    }
  },
  {
    id: "efootball-pes-mobile",
    name: "eFootball PES Mobile",
    cat: "MOBILE",
    tags: ["Coins", "Top-Up", "Mobile", "Football"],
    color: "bg-[#002f6c]",
    image: "https://i.pinimg.com/1200x/61/ea/f4/61eaf493cba6e992c2e32e0468d9d033.jpg",
    desc: "Get eFootball Coins and seasonal passes.",
    descAr: "احصل على كوينز وتذاكر اللعبة الموسمية.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "100 eFootball Coins", price: "50", image: "https://i.pinimg.com/736x/0b/d8/d4/0bd8d422c8ee3a3c3610837e230d247b.jpg" },
      { id: "pkg2", name: "500 eFootball Coins", price: "240", image: "https://i.pinimg.com/736x/0b/d8/d4/0bd8d422c8ee3a3c3610837e230d247b.jpg" },
      { id: "pkg3", name: "1000 eFootball Coins", price: "450", popular: true, image: "https://i.pinimg.com/736x/0b/d8/d4/0bd8d422c8ee3a3c3610837e230d247b.jpg" },
      { id: "pkg4", name: "2100 eFootball Coins", price: "900", image: "https://i.pinimg.com/736x/0b/d8/d4/0bd8d422c8ee3a3c3610837e230d247b.jpg" },
      { id: "pkg5", name: "Value Match Pass", price: "150", image: "https://i.pinimg.com/736x/0b/d8/d4/0bd8d422c8ee3a3c3610837e230d247b.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "ownerId", label: "Owner ID", placeholder: "أدخل Owner ID الخاص بك", required: true },
        { key: "region", label: "Region", placeholder: "مثال: Europe / Middle East", required: true },
      ],
      chargingInfo: ["يتم الشحن عبر Owner ID مباشرة", "لا نحتاج لبيانات الدخول", "الشحن يتم خلال دقائق"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "5 - 15 دقيقة",
    }
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    cat: "MOBILE / PC",
    tags: ["Genesis Crystals", "Top-Up", "RPG"],
    color: "bg-[#ccff00]",
    image: "https://i.pinimg.com/1200x/ad/b0/a0/adb0a01a7ed6f1b168aaa757b7c96a92.jpg",
    desc: "Genesis Crystals, Welkin Moon, and Battle Pass.",
    descAr: "جواهر التكوين وبطاقة الشهر والتصريح.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "60 Genesis Crystals", price: "30", image: "https://i.pinimg.com/736x/11/5b/34/115b34a5552d6c56fc1d7d1001b20800.jpg" },
      { id: "pkg2", name: "300 Genesis Crystals", price: "150", image: "https://i.pinimg.com/736x/11/5b/34/115b34a5552d6c56fc1d7d1001b20800.jpg" },
      { id: "pkg3", name: "980 Genesis Crystals", price: "450", popular: true, image: "https://i.pinimg.com/736x/11/5b/34/115b34a5552d6c56fc1d7d1001b20800.jpg" },
      { id: "pkg4", name: "1980 Genesis Crystals", price: "900", image: "https://i.pinimg.com/736x/11/5b/34/115b34a5552d6c56fc1d7d1001b20800.jpg" },
      { id: "pkg5", name: "Welkin Moon", price: "120", image: "https://i.pinimg.com/736x/11/5b/34/115b34a5552d6c56fc1d7d1001b20800.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerId", label: "UID", placeholder: "أدخل UID من داخل اللعبة", required: true },
        { 
          key: "server", 
          label: "السيرفر", 
          placeholder: "اختر السيرفر", 
          required: true,
          type: 'select',
          options: [
            { label: "Asia", value: "Asia" },
            { label: "Europe", value: "Europe" },
            { label: "America", value: "America" },
            { label: "TW, HK, MO", value: "TW_HK_MO" },
          ]
        },
      ],
      chargingInfo: ["يتم الشحن عبر UID مباشرة بدون كلمة سر", "تأكد من اختيار السيرفر الصحيح", "Welkin Moon يتم تفعيله فوراً"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "5 - 15 دقيقة",
    }
  },
  {
    id: "free-fire",
    name: "Free Fire",
    cat: "MOBILE",
    tags: ["Diamonds", "Top-Up", "Mobile"],
    color: "bg-[#ff5e00]",
    image: "https://i.pinimg.com/736x/73/fa/a6/73faa665f3318eb7b7b2d0a25fa31a43.jpg",
    desc: "Diamonds and membership cards for Free Fire.",
    descAr: "جواهر وبطاقات اشتراك لعبة فري فاير.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "100 Diamonds", price: "20", image: "https://i.pinimg.com/736x/f3/7d/21/f37d2191d9bc1cd979cb742b00d5ffae.jpg" },
      { id: "pkg2", name: "310 Diamonds", price: "55", image: "https://i.pinimg.com/736x/f3/7d/21/f37d2191d9bc1cd979cb742b00d5ffae.jpg" },
      { id: "pkg3", name: "520 Diamonds", price: "100", popular: true, image: "https://i.pinimg.com/736x/f3/7d/21/f37d2191d9bc1cd979cb742b00d5ffae.jpg" },
      { id: "pkg4", name: "1060 Diamonds", price: "200", image: "https://i.pinimg.com/736x/f3/7d/21/f37d2191d9bc1cd979cb742b00d5ffae.jpg" },
      { id: "pkg5", name: "2180 Diamonds", price: "400", image: "https://i.pinimg.com/736x/f3/7d/21/f37d2191d9bc1cd979cb742b00d5ffae.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerId", label: "Player ID", placeholder: "أدخل ID اللاعب من داخل اللعبة", required: true },
      ],
      chargingInfo: ["الشحن فوري عبر ID فقط", "لا نحتاج كلمة سر أو إيميل"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "1 - 10 دقائق",
    },
    tutorialVideoUrl: "https://v1.pinterest.com/videos/mc/720p/28/a5/09/28a509f1b47ab7794358a0cb7339fe19.mp4",
    discount: 20,
    badge: { text: "عرض الصيف", color: "bg-yellow-500", icon: "Star" }
  },
  {
    id: "valorant",
    name: "Valorant",
    cat: "PC",
    tags: ["VP", "Skins", "FPS"],
    color: "bg-[#b084ff]",
    image: "https://i.pinimg.com/1200x/4d/df/df/4ddfdf50854d7aa373dac53dfe0b97c4.jpg",
    desc: "Valorant Points and premium skin bundles.",
    descAr: "نقاط فالورانت وحزم الأسلحة المميزة.",
    category: "pc",
    badge: { text: "جديد", color: "bg-blue-600", icon: "Sparkles" },
    packages: [
      { id: "pkg1", name: "475 VP", price: "120", image: "https://i.pinimg.com/1200x/0b/d2/90/0bd29018298b5bb1ecc31f247e283587.jpg" },
      { id: "pkg2", name: "1000 VP", price: "240", image: "https://i.pinimg.com/1200x/0b/d2/90/0bd29018298b5bb1ecc31f247e283587.jpg" },
      { id: "pkg3", name: "2050 VP", price: "470", popular: true, image: "https://i.pinimg.com/1200x/0b/d2/90/0bd29018298b5bb1ecc31f247e283587.jpg" },
      { id: "pkg4", name: "3650 VP", price: "800", image: "https://i.pinimg.com/1200x/0b/d2/90/0bd29018298b5bb1ecc31f247e283587.jpg" },
      { id: "pkg5", name: "5350 VP", price: "1150", image: "https://i.pinimg.com/1200x/0b/d2/90/0bd29018298b5bb1ecc31f247e283587.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "riotId", label: "Riot ID", placeholder: "مثال: Player#TAG", required: true },
        { 
          key: "server", 
          label: "السيرفر", 
          placeholder: "اختر السيرفر", 
          required: true,
          type: 'select',
          options: [
            { label: "Europe (EU)", value: "EU" },
            { label: "North America (NA)", value: "NA" },
            { label: "Asia Pacific (AP)", value: "AP" },
            { label: "Brazil (BR)", value: "BR" },
            { label: "LATAM", value: "LATAM" },
          ]
        },
      ],
      chargingInfo: ["يتم الشحن عبر Riot ID", "تأكد من السيرفر الصحيح"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "10 - 30 دقيقة",
    }
  },
  {
    id: "roblox",
    name: "Roblox",
    cat: "ALL PLATFORMS",
    tags: ["Robux", "Top-Up", "Kids"],
    color: "bg-[#ccff00]",
    image: "https://i.pinimg.com/1200x/3c/3f/5b/3c3f5b9a226134d49386a2ed6c087d18.jpg",
    desc: "Robux and Premium subscriptions.",
    descAr: "روبوكس واشتراكات لعب مميزة.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "400 Robux", price: "120", image: "https://i.pinimg.com/736x/ff/0d/d4/ff0dd41f3a2b13c7f098be411259a264.jpg" },
      { id: "pkg2", name: "800 Robux", price: "230", popular: true, image: "https://i.pinimg.com/736x/ff/0d/d4/ff0dd41f3a2b13c7f098be411259a264.jpg" },
      { id: "pkg3", name: "1700 Robux", price: "460", image: "https://i.pinimg.com/736x/ff/0d/d4/ff0dd41f3a2b13c7f098be411259a264.jpg" },
      { id: "pkg4", name: "4500 Robux", price: "1100", image: "https://i.pinimg.com/736x/ff/0d/d4/ff0dd41f3a2b13c7f098be411259a264.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "username", label: "Roblox Username", placeholder: "أدخل اسم المستخدم في Roblox", required: true },
      ],
      chargingInfo: ["يتم إرسال Robux عبر Game Pass أو Group Funds", "سيتم التواصل معك لتأكيد الطريقة"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "15 - 60 دقيقة",
    }
  },
  {
    id: "clash-of-clans",
    name: "Clash of Clans",
    cat: "MOBILE",
    tags: ["Gems", "Top-Up", "Strategy"],
    color: "bg-[#ff5e00]",
    image: "https://i.pinimg.com/1200x/54/3f/2c/543f2c6a86555b28c5e5a536bce250da.jpg",
    desc: "Gems and Gold Pass for Clash of Clans.",
    descAr: "جواهر وبطاقة السيزون الذهبية للعبة كلاش.",
    category: "mobile",
    packages: [
      { id: "pkg1", name: "80 Gems", price: "25", image: "https://i.pinimg.com/736x/f1/0a/d8/f10ad873ddc910a301dc46d835d8d762.jpg" },
      { id: "pkg2", name: "500 Gems", price: "120", image: "https://i.pinimg.com/736x/f1/0a/d8/f10ad873ddc910a301dc46d835d8d762.jpg" },
      { id: "pkg3", name: "1200 Gems", price: "250", popular: true, image: "https://i.pinimg.com/736x/f1/0a/d8/f10ad873ddc910a301dc46d835d8d762.jpg" },
      { id: "pkg4", name: "2500 Gems", price: "500", image: "https://i.pinimg.com/736x/f1/0a/d8/f10ad873ddc910a301dc46d835d8d762.jpg" },
      { id: "pkg5", name: "Gold Pass", price: "130", image: "https://i.pinimg.com/736x/f1/0a/d8/f10ad873ddc910a301dc46d835d8d762.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "playerTag", label: "Player Tag", placeholder: "مثال: #XXXXXXXX", required: true },
      ],
      chargingInfo: ["يتم الشحن عبر Player Tag", "Gold Pass يتم تفعيله مباشرة"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "5 - 20 دقيقة",
    }
  },
  {
    id: "fifa-ea-fc",
    name: "FIFA / EA FC",
    cat: "PC / CONSOLE",
    tags: ["FIFA Points", "Coins", "Sports"],
    color: "bg-[#b084ff]",
    image: "https://i.pinimg.com/736x/62/2d/ae/622daecf117deb935b16e142c2d6b549.jpg",
    desc: "FIFA Points and coin packages.",
    descAr: "نقاط فيفا وحزم الكوينز المتنوعة.",
    category: "pc",
    packages: [
      { id: "pkg1", name: "500 coins", price: "130", image: "https://i.pinimg.com/1200x/e0/ea/a4/e0eaa49dc67ec8bbbd6924801d1d0c95.jpg" },
      { id: "pkg2", name: "1050 coins", price: "260", image: "https://i.pinimg.com/1200x/e0/ea/a4/e0eaa49dc67ec8bbbd6924801d1d0c95.jpg" },
      { id: "pkg3", name: "2200 coins", price: "520", popular: true, image: "https://i.pinimg.com/1200x/e0/ea/a4/e0eaa49dc67ec8bbbd6924801d1d0c95.jpg" },
      { id: "pkg4", name: "4600 coins", price: "1050", image: "https://i.pinimg.com/1200x/e0/ea/a4/e0eaa49dc67ec8bbbd6924801d1d0c95.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "platform", label: "المنصة", placeholder: "PS / Xbox / PC", required: true },
        { key: "eaEmail", label: "EA Email", placeholder: "أدخل إيميل حساب EA", required: true },
      ],
      chargingInfo: ["يتم الشحن عبر حساب EA مباشرة", "تأكد من ربط المنصة الصحيحة بحسابك"],
      chargingMethod: "Vodafone Cash / InstaPay / تحويل بنكي",
      deliveryTime: "30 - 60 دقيقة",
    }
  },
  {
    id: "minecraft",
    name: "Minecraft",
    cat: "ALL PLATFORMS",
    tags: ["Minecoins", "Accounts", "Sandbox"],
    color: "bg-[#ccff00]",
    image: "https://i.pinimg.com/736x/46/31/2b/46312bd881d791e50cc6a5577ebe2890.jpg",
    desc: "Minecoins, Realms, and premium accounts.",
    descAr: "ماين كوينز وحسابات ماينكرافت.",
    category: "pc",
    packages: [
      { id: "pkg1", name: "320 Minecoins", price: "50", image: "https://i.pinimg.com/736x/6c/86/b5/6c86b598fe8ed62abc9b9816c5a25108.jpg" },
      { id: "pkg2", name: "1020 Minecoins", price: "150", popular: true, image: "https://i.pinimg.com/736x/6c/86/b5/6c86b598fe8ed62abc9b9816c5a25108.jpg" },
      { id: "pkg3", name: "1720 Minecoins", price: "240", image: "https://i.pinimg.com/736x/6c/86/b5/6c86b598fe8ed62abc9b9816c5a25108.jpg" },
      { id: "pkg4", name: "Premium Account", price: "350", image: "https://i.pinimg.com/736x/6c/86/b5/6c86b598fe8ed62abc9b9816c5a25108.jpg" },
    ],
    fieldConfig: {
      fields: [
        { key: "username", label: "Minecraft Username", placeholder: "أدخل اسم المستخدم", required: true },
        { key: "edition", label: "النسخة", placeholder: "Java / Bedrock", required: true },
      ],
      chargingInfo: ["يتم إرسال الكود عبر واتساب", "تأكد من اختيار النسخة الصحيحة"],
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "10 - 30 دقيقة",
    }
  },
  {
    id: "test-arabic-game",
    name: "لعبة تجريبية جديدة",
    cat: "MOBILE",
    tags: ["Test", "Arabic"],
    color: "bg-green-500",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
    desc: "Test game to verify Arabic slugs.",
    descAr: "لعبة تجريبية للتأكد من عمل الروابط العربية.",
    category: "mobile",
    discount: 0
  }
];
