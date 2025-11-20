export interface Universe {
    id: string;
    name: string;
    description: string;
    imageUrl: string; // Placeholder URL or local require
    stylePrompt: string;
}

export const UNIVERSES: Universe[] = [
    {
        id: 'cyberpunk',
        name: 'Cyberpunk 2099',
        description: 'Neon lights, high-tech prosthetics, and a dystopian future.',
        imageUrl: 'https://via.placeholder.com/300x400/000000/00FFFF?text=Cyberpunk',
        stylePrompt: 'cyberpunk style, neon lights, futuristic city background, high tech armor, chrome details, night time, rain',
    },
    {
        id: 'medieval',
        name: 'Medieval Knight',
        description: 'Steel armor, swords, and the honor of the kingdom.',
        imageUrl: 'https://via.placeholder.com/300x400/333333/FFFFFF?text=Medieval',
        stylePrompt: 'medieval knight style, full plate armor, sword, castle background, epic fantasy, realistic texture',
    },
    {
        id: 'samurai',
        name: 'Ronin Samurai',
        description: 'The way of the warrior, katanas, and cherry blossoms.',
        imageUrl: 'https://via.placeholder.com/300x400/8B0000/FFFFFF?text=Samurai',
        stylePrompt: 'samurai style, traditional japanese armor, katana, cherry blossoms falling, feudal japan background, dramatic lighting',
    },
    {
        id: 'viking',
        name: 'Viking Warrior',
        description: 'Valhalla awaits! Furs, axes, and the frozen north.',
        imageUrl: 'https://via.placeholder.com/300x400/00008B/FFFFFF?text=Viking',
        stylePrompt: 'viking style, fur cloak, war paint, axe, snowy mountain background, rugged look, cinematic lighting',
    },
    {
        id: 'anime',
        name: 'Shonen Anime',
        description: 'Spiky hair, power auras, and epic battles.',
        imageUrl: 'https://via.placeholder.com/300x400/FFA500/000000?text=Anime',
        stylePrompt: 'anime style, cel shaded, vibrant colors, dynamic pose, power aura, speed lines, manga aesthetic',
    },
];
