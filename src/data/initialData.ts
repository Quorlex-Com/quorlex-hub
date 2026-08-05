import { HubItem, Comment, AppNotification, GlobalStats } from '../types';

export const INITIAL_STATS: GlobalStats = {
  totalDownloads: 0,
  totalAssets: 6,
  activeOnline: 1,
  discordMembers: 1,
  bandwidthServed: '0 MB',
};

export const INITIAL_ITEMS: HubItem[] = [
  {
    id: 'mod-quantum-crafting',
    title: 'Quantum Crafting & Dimension Expansion',
    category: 'mods',
    tagline: 'High-tech dimensional automation & multi-block quantum reactors for MC 1.20.4 - 1.21.',
    description: `Quantum Crafting brings industrial technology, spatial automation, and dimensional travel directly to Minecraft! Build quantum reactors, automated crafting pipelines, subatomic particle accelerators, and explore 4 new alien dimensions with custom biomes and boss battles.

### Key Features:
- **Quantum Power Grids**: Wireless power distribution up to 10,000 blocks.
- **Particle Accelerators**: Craft antimatter for ultimate power generation.
- **4 Custom Dimensions**: Neon Zenith, Subspace Void, Aetheria, and Cryo-Core.
- **Custom Shader & Sound Effects**: Built with custom spatial particle engines and immersive ambient soundscapes.
- **JEI & REI Integration**: Full recipe lookup compatibility out of the box.`,
    version: 'v2.4.1-FABRIC',
    targetVersion: 'Minecraft 1.20.4 - 1.21.1 (Fabric & Forge)',
    fileSize: '14.8 MB',
    downloadUrl: 'https://github.com/QuorlexHub/quantum-crafting/releases/download/v2.4.1/quantum-crafting-2.4.1.jar',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    tags: ['Minecraft', 'Fabric', 'Forge', 'Technology', 'Dimensions', 'Automation', '1.21'],
    downloadsCount: 0,
    rating: 4.9,
    ratingsCount: 512,
    isFeatured: true,
    isPinned: true,
    checksum: 'a8f9c21e04b98d23e1104e902b4891a27e8d302c118e90f231a4e102',
    changelog: `- Added 12 new Quantum Capacitor tiers.
- Fixed energy loss issue when teleporting through Subspace gates.
- Improved rendering performance in the Neon Zenith biome by 35%.
- Compatible with Sodium / Iris Shaders.`,
    installationGuide: `1. Install Fabric Loader or Forge 1.20.4+.
2. Download Fabric API (if using Fabric).
3. Place the downloaded .jar file into your Minecraft '.minecraft/mods' folder.
4. Launch Minecraft and enjoy Quantum Crafting!`,
    mirrors: [
      { name: 'CurseForge', url: 'https://curseforge.com', type: 'curseforge' },
      { name: 'Modrinth', url: 'https://modrinth.com', type: 'modrinth' },
      { name: 'GitHub Releases', url: 'https://github.com', type: 'github' }
    ],
    author: 'Quorlex Dev Team',
    createdAt: '2026-01-15',
    updatedAt: '2026-07-28',
    published: true
  },
  {
    id: 'plugin-quorlex-essentials',
    title: 'Quorlex Essentials Pro Suite',
    category: 'plugins',
    tagline: 'Ultra-fast Spigot/Paper server management plugin with zero lag & instant DB sync.',
    description: `The ultimate all-in-one administration, economy, teleportation, and player permission engine for modern Minecraft servers. Built with asynchronous database syncing, zero main-thread blocking, and full multi-server Proxy support (Velocity & BungeeCord).

### Features:
- **Instant Teleportation & Homes**: Lag-free warmups with particle feedback.
- **Smart Economy**: Built-in Vault interface, GUI shops, and trade logs.
- **Anti-Grief Protection**: Auto rollback, region claiming, and explosive dampeners.
- **Custom Chat Format & Discord Webhooks**: Instant Discord bridge for server chats.`,
    version: 'v5.1.0',
    targetVersion: 'Paper / Purpur / Spigot 1.18.2 - 1.21.x',
    fileSize: '3.2 MB',
    downloadUrl: 'https://github.com/QuorlexHub/essentials-pro/releases/download/v5.1.0/QuorlexEssentialsPro.jar',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Plugin', 'Paper', 'Purpur', 'Spigot', 'Economy', 'Admin', 'Discord Sync'],
    downloadsCount: 0,
    rating: 4.8,
    ratingsCount: 320,
    isFeatured: true,
    checksum: 'e7b921389c02138b10f28329a10c9d20f182c3e109841',
    changelog: `- Full support for Minecraft 1.21.1 items.
- Added Discord Rich Embed customization.
- Optimized database query caching for servers with 500+ concurrent players.`,
    installationGuide: `1. Drop QuorlexEssentialsPro.jar into your server's '/plugins' directory.
2. Restart your server.
3. Edit the generated 'config.yml' to tune settings and link database or Discord webhooks.`,
    mirrors: [
      { name: 'SpigotMC Mirror', url: 'https://spigotmc.org', type: 'mirror' },
      { name: 'Direct Download', url: 'https://quorlex.hub/download/QuorlexEssentialsPro.jar', type: 'direct' }
    ],
    author: 'Quorlex Dev Team',
    createdAt: '2026-02-10',
    updatedAt: '2026-08-01',
    published: true
  },
  {
    id: 'software-texture-packer-4k',
    title: 'TexturePacker Studio 4K & Model Optimizer',
    category: 'software',
    tagline: 'High-performance desktop app for generating, baking, and optimizing 3D textures & MC resource packs.',
    description: `TexturePacker Studio 4K is an automated desktop software tool designed for game developers, 3D artists, and Minecraft creators. Easily pack spritesheets, auto-bake PBR normal and height maps, convert format models (.json, .obj, .fbx, .gltf), and reduce game asset bundle sizes by up to 60% without visual quality loss.

### Highlights:
- **AI Texture Upscaling & PBR Generator**: Generate Metallic, Roughness, and Normal maps in one click.
- **Batch Resource Pack Exporter**: Target Bedrock, Java, Unity, or Unreal Engine instantly.
- **3D Real-time Model Previewer**: Built-in GPU viewport with customizable studio lighting.
- **Cross-Platform**: Windows 10/11, macOS (Apple Silicon native), and Linux.`,
    version: 'v3.2.0',
    targetVersion: 'Windows 10/11 x64, macOS 12+, Linux',
    fileSize: '84.5 MB',
    downloadUrl: 'https://github.com/QuorlexHub/texture-packer/releases/download/v3.2.0/TexturePackerStudio_Setup.exe',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Software', '3D Tools', 'Textures', 'Game Dev', 'PBR', 'Desktop App'],
    downloadsCount: 0,
    rating: 4.9,
    ratingsCount: 210,
    isFeatured: true,
    isPinned: true,
    checksum: 'c4f192b001a2384910e28f1023b1029c11',
    changelog: `- Added Apple M1/M2/M3 Metal GPU hardware acceleration.
- Integrated automatic Minecraft JSON model syntax validator.
- Export direct zip archives formatted for Modrinth and CurseForge uploads.`,
    installationGuide: `1. Run the installer for your OS (TexturePackerStudio_Setup.exe or .dmg).
2. Follow the setup wizard instructions.
3. Open the app and drag & drop your texture folder to begin optimization!`,
    mirrors: [
      { name: 'GitHub Releases', url: 'https://github.com', type: 'github' },
      { name: 'Direct CDN', url: 'https://quorlex.hub/cdn/TexturePackerStudio_3.2.exe', type: 'direct' }
    ],
    author: 'Quorlex Dev Team',
    createdAt: '2026-03-01',
    updatedAt: '2026-08-02',
    published: true
  },
  {
    id: 'assets-cyberpunk-3d-pack',
    title: 'Cyberpunk Sci-Fi 3D Props & Sound FX Pack',
    category: 'assets',
    tagline: '120+ modular 3D low-poly models, neon UI kits, and 80 royalty-free futuristic audio SFX.',
    description: `Boost your game, Minecraft server GUI, video production, or web app with the Cyberpunk Sci-Fi Asset Pack. Includes 120 modular 3D props (holograms, terminals, floating drones, neon signs), customizable UI kits, and 80 crisp spatial sound effects (UI beeps, laser hums, power-ups, atmospheric ambiances).

### What's Inside:
- 120 Low-Poly 3D Props (.FBX, .OBJ, .GLTF, Minecraft .JSON)
- 4K PBR Textures (Albedo, Emission, Normal, Roughness)
- 80 WAV 24-bit 48kHz Sound Effects
- Clean license: Commercial & Personal use included!`,
    version: 'v1.5',
    targetVersion: 'Unreal, Unity, Godot, Blender, Minecraft Custom Assets',
    fileSize: '320 MB',
    downloadUrl: 'https://quorlex.hub/assets/Cyberpunk_SciFi_Asset_Pack_v1.5.zip',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['Assets', '3D Models', 'Sound FX', 'Cyberpunk', 'UI Kit', 'Royalty Free'],
    downloadsCount: 0,
    rating: 5.0,
    ratingsCount: 189,
    isFeatured: false,
    checksum: 'f920a10c823019f2010c28391a0c',
    changelog: `- Added 25 new animated hologram GLTF models.
- Re-rendered emission textures for HDR lighting compatibility.`,
    installationGuide: `1. Unzip 'Cyberpunk_SciFi_Asset_Pack_v1.5.zip'.
2. Import the folder directly into your game engine or 3D software (Blender, Unity, Unreal, Blockbench).`,
    mirrors: [
      { name: 'Direct CDN Mirror', url: 'https://quorlex.hub/cdn/CyberpunkAssets.zip', type: 'direct' }
    ],
    author: 'Quorlex Dev Team',
    createdAt: '2026-04-12',
    updatedAt: '2026-07-15',
    published: true
  },
  {
    id: 'apps-quorlex-companion',
    title: 'Quorlex Mobile & Desktop Remote Hub',
    category: 'apps',
    tagline: 'Monitor server stats, receive push update notifications, and queue downloads remotely.',
    description: `Quorlex Hub Companion app connects your desktop and mobile devices directly to your Quorlex Hub account and Minecraft server cluster! Monitor active player counts, get instant notifications on new mod & plugin releases, and trigger remote file installations directly to your server.

### Features:
- **Real-time Server Analytics**: Monitor CPU, RAM, TPS, and player count.
- **Push Update Notifications**: Instant alerts when your favorite software or mods update.
- **Remote Download Queue**: Trigger download syncs to your designated servers.`,
    version: 'v1.1.2',
    targetVersion: 'Android, iOS, Windows, macOS',
    fileSize: '28.1 MB',
    downloadUrl: 'https://quorlex.hub/apps/QuorlexCompanion_v1.1.2.apk',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Apps', 'Mobile', 'Remote', 'Server Monitor', 'Push Alerts'],
    downloadsCount: 0,
    rating: 4.7,
    ratingsCount: 142,
    isFeatured: false,
    checksum: 'b7102931a02930192a01',
    changelog: `- Added Dark Mode biometric unlock.
- Integrated WebSocket push alerts for real-time community messages.`,
    installationGuide: `Install APK on Android or use the desktop executable on Windows/macOS. Connect using your Quorlex Hub account.`,
    mirrors: [
      { name: 'Direct APK Link', url: 'https://quorlex.hub/download/companion.apk', type: 'direct' }
    ],
    author: 'Quorlex Dev Team',
    createdAt: '2026-05-20',
    updatedAt: '2026-08-03',
    published: true
  },
  {
    id: 'mod-optix-ultra-shaders',
    title: 'OptiX Ray-Traced Ultra Shaders Pack',
    category: 'mods',
    tagline: 'Hyper-realistic atmospheric lighting, path-traced water reflections & dynamic volumetric clouds.',
    description: `Transform Minecraft into a visual masterpiece. OptiX Ultra Shaders provides hardware-accelerated ray tracing effects, realistic water caustic refractions, subsurface scattering, dynamic foliage movement, and custom volumetric cloud shadow casting.

### Highlights:
- **Low-Impact Performance Mode**: Designed to run smoothly on mid-range GPUs (RTX 2060+ or RX 6600+).
- **Custom Weather Lighting**: Dynamic light shifts during rainstorms, fog, and celestial eclipses.
- **Iris & Sodium Native Support**: 120+ FPS target on modern hardware.`,
    version: 'v4.0.2',
    targetVersion: 'Minecraft 1.16.5 - 1.21.1 (Iris / OptiFine)',
    fileSize: '18.2 MB',
    downloadUrl: 'https://quorlex.hub/mods/OptiX_Ultra_Shaders_v4.0.zip',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Minecraft', 'Shaders', 'Iris', 'Graphics', 'Ray Tracing', 'OptiFine'],
    downloadsCount: 0,
    rating: 4.95,
    ratingsCount: 680,
    isFeatured: true,
    checksum: 'd82019a128e0192a8301',
    changelog: `- Improved water caustics algorithm for 20% higher frame rates.
- Fixed subsurface scattering on custom mob models.`,
    installationGuide: `1. Install Iris Shaders or OptiFine.
2. Put the downloaded shader pack .zip into '.minecraft/shaderpacks'.
3. Select 'OptiX Ultra' in Video Settings -> Shaders.`,
    mirrors: [
      { name: 'Modrinth Shader Mirror', url: 'https://modrinth.com', type: 'modrinth' }
    ],
    author: 'Quorlex Graphics Lab',
    createdAt: '2026-01-02',
    updatedAt: '2026-08-04',
    published: true
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    itemId: 'mod-quantum-crafting',
    authorName: 'Alex_Vortex',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex_Vortex',
    authorUid: 'user-101',
    content: 'This mod is insane! The particle accelerators and dimension travel are smoother than any modpack I have tested on MC 1.21. Highly recommended!',
    rating: 5,
    upvotes: 28,
    createdAt: '2026-07-30T14:22:00Z',
    isVerifiedDownloader: true
  },
  {
    id: 'c2',
    itemId: 'mod-quantum-crafting',
    authorName: 'PixelCrafter99',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelCrafter99',
    authorUid: 'user-102',
    content: 'Very well optimized. Runs flawlessly on our Fabric server with 45 active players. No tick drop at all when quantum gates open.',
    rating: 5,
    upvotes: 19,
    createdAt: '2026-08-01T09:10:00Z',
    isVerifiedDownloader: true
  },
  {
    id: 'c3',
    itemId: 'software-texture-packer-4k',
    authorName: 'DesignMaster',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DesignMaster',
    authorUid: 'user-103',
    content: 'Saved me at least 15 hours of manual normal map baking for my custom resource pack. The batch exporter to ZIP is super clean.',
    rating: 5,
    upvotes: 14,
    createdAt: '2026-08-02T18:45:00Z',
    isVerifiedDownloader: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🚀 Quantum Crafting v2.4.1 Released!',
    message: 'Added 12 new quantum capacitor tiers and 35% performance boost in Neon Zenith.',
    date: '10 minutes ago',
    type: 'update',
    read: false,
    linkItemId: 'mod-quantum-crafting'
  },
  {
    id: 'notif-2',
    title: '💬 Discord Community Goal Reached',
    message: 'We crossed 4,800 members! Join the voice channels for live dev sessions and beta testing.',
    date: '2 hours ago',
    type: 'community',
    read: false
  },
  {
    id: 'notif-3',
    title: '🛡️ Virus Scan Status Clean',
    message: 'All published executables and JARs verified with SHA-256 and zero threat flags.',
    date: '1 day ago',
    type: 'system',
    read: true
  }
];
