import asyncio
import random
import json
import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import replicate
from dotenv import load_dotenv

load_dotenv()

class ReplicateAIService:
    """Real AI service using Replicate API for Stable Diffusion"""
    
    def __init__(self):
        self.api_token = os.getenv('REPLICATE_API_TOKEN')
        if not self.api_token:
            print("WARNING: REPLICATE_API_TOKEN not set. Using mock mode.")
            self.use_mock = True
        else:
            self.use_mock = False
    
    UNIVERSE_PROMPTS = {
        "cyberpunk": {
            "style": "cyberpunk 2077 style, neon lights, futuristic city background, cybernetic implants, highly detailed, 4k",
            "story": """Sen Cyberpunk 2099 evreninde doğmuş bir Netrunner'sın.

Neon ışıklı Neo-Tokyo sokaklarında büyüdün. Çocukken gördüğün bir siber saldırı 
hayatını değiştirdi - aileni kaybettin ama yeteneklerini keşfettin. Şimdi underworld'ün en tehlikeli 
hackerlarından birisin. Megacorporation'ların karanlık sırlarını ifşa ediyorsun. Son keşfettiğin bilgi 
tüm şehri değiştirebilir...""",
            "traits": ["Siber implantlar", "Elite hacking yetenekleri", "Sokak zekası"],
            "class": "Netrunner"
        },
        "medieval": {
            "style": "medieval fantasy art, knight in armor, castle background, epic lighting, oil painting style, highly detailed",
            "story": """Sen Valora Krallığı'nda bir şövalye olarak doğdun.

Krallığın en eski ailesinden geliyorsun. Küçük yaşta kılıç eğitimi aldın. 
İlk savaşında gösterdiğin cesaret efsane oldu. Kral sana kutsal bir görev verdi: kayıp kılıcı bul 
ve krallığı karanlıktan kurtar. Yolculuğun seni uzak diyarlara götürecek...""",
            "traits": ["Kılıç ustalığı", "Şeref ve onur", "Taktik deha"],
            "class": "Knight"
        },
        "samurai": {
            "style": "samurai warrior, traditional japanese art style, cherry blossoms, katana, feudal japan, ukiyo-e inspired, highly detailed",
            "story": """Sen Sengoku döneminde doğmuş bir Ronin'sin.

Efendin savaşta öldükten sonra ronin oldun. Bushido koduna sadık kaldın. 
Köyleri savunurken ününü kazandın. Katana'n ile birçok düşmanı yendin. Şimdi son görevi arıyorsun: 
efendinin intikamını almak ve asil ölmek...""",
            "traits": ["Katana uzmanlığı", "Bushido kodu", "Meditasyon"],
            "class": "Ronin"
        },
        "viking": {
            "style": "viking warrior, norse mythology, snowy landscape, battle axe, fur armor, epic fantasy art, highly detailed",
            "story": """Sen Midgard'ın donmuş topraklarında doğmuş bir Viking savaşçısısın.

Kuzey denizlerinde korku salıyorsun. İlk baskında gösterdiğin cesaret seni 
Jarl yaptı. Balta'nla sayısız düşmanı yendin. Valhalla seni bekliyor ama önce son bir fetih var: 
efsanevi hazineyi bul ve klanını sonsuza kadar zenginleştir...""",
            "traits": ["Balta savaşı", "Berserker öfkesi", "Denizcilik"],
            "class": "Jarl"
        },
        "anime": {
            "style": "anime art style, powerful hero, energy aura, dynamic pose, studio ghibli meets shonen, vibrant colors, highly detailed",
            "story": """Sen gücün her şeyi belirlediği bir dünyada doğdun.

Küçükken hiç gücün yoktu. Herkes sana güldü. Ama içindeki kararlılık seni 
güçlendirdi. Antrenman yaptın, dövüştün, kaybettin, öğrendin. Şimdi en güçlü kahramanlardan birisin. 
Final savaşı yaklaşıyor - kötülüğü yenip dünyayı kurtarmalısın!""",
            "traits": ["Süper hız", "Enerji patlamaları", "Kararlılık"],
            "class": "Hero"
        }
    }
    
    async def generate_avatar(self, original_image_path: str, universe_id: str, output_path: str) -> str:
        """Generate AI avatar using Replicate Stable Diffusion"""
        
        if self.use_mock:
            return await self._mock_generate(original_image_path, universe_id, output_path)
        
        try:
            universe = self.UNIVERSE_PROMPTS.get(universe_id, self.UNIVERSE_PROMPTS["cyberpunk"])
            
            # Open image as file object
            with open(original_image_path, "rb") as image_file:
                # Replicate SDXL img2img
                output = await asyncio.to_thread(
                    replicate.run,
                    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                    input={
                        "image": image_file,
                        "prompt": f"portrait photo of a person, {universe['style']}",
                        "strength": 0.8,
                        "num_inference_steps": 30,
                    }
                )
            
            # Download generated image
            import urllib.request
            if isinstance(output, list) and len(output) > 0:
                urllib.request.urlretrieve(output[0], output_path)
            else:
                urllib.request.urlretrieve(output, output_path)
            
            return output_path
            
        except Exception as e:
            print(f"Replicate API error: {e}")
            # Fallback to mock
            return await self._mock_generate(original_image_path, universe_id, output_path)
    
    async def _mock_generate(self, original_image_path: str, universe_id: str, output_path: str) -> str:
        """Fallback mock generation"""
        await asyncio.sleep(3)
        
        img = Image.new('RGB', (512, 512), color=(73, 109, 137))
        d = ImageDraw.Draw(img)
        text = f"{universe_id.upper()}\nAVATAR\n(MOCK MODE)"
        d.text((256, 256), text, fill=(255, 255, 255), anchor="mm")
        img.save(output_path)
        
        return output_path
    
    def generate_story(self, universe_id: str) -> str:
        """Generate story based on universe"""
        universe = self.UNIVERSE_PROMPTS.get(universe_id, self.UNIVERSE_PROMPTS["cyberpunk"])
        
        story = f"""{universe['story']}

Özel Yeteneklerin:
• {universe['traits'][0]}
• {universe['traits'][1]}
• {universe['traits'][2]}

Macera başlıyor..."""
        
        return story.strip()
    
    def generate_character_card(self, universe_id: str) -> dict:
        """Generate character card with stats"""
        universe = self.UNIVERSE_PROMPTS.get(universe_id, self.UNIVERSE_PROMPTS["cyberpunk"])
        
        return {
            "name": f"The {universe['class']}",
            "class_name": universe['class'],
            "level": random.randint(15, 50),
            "stats": {
                "strength": random.randint(60, 100),
                "agility": random.randint(60, 100),
                "intelligence": random.randint(60, 100),
                "charisma": random.randint(60, 100),
                "luck": random.randint(60, 100)
            }
        }

ai_service = ReplicateAIService()
