<?php

namespace Database\Seeders;

use App\Models\Perfume;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PerfumeSeeder extends Seeder
{
    public function run(): void
    {
        $perfumes = [
            [
                'name' => 'Lumière Douce',
                'brand' => 'Maison Alba',
                'family' => 'floral',
                'intensity' => 'léger',
                'image_url' => 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Bergamote, Poire',
                'notes_middle' => 'Pivoine, Jasmin',
                'notes_base' => 'Musc blanc',
                'mood' => 'Calme & Serein',
            ],
            [
                'name' => 'Noir Tempête',
                'brand' => 'Atelier Nuit',
                'family' => 'oriental',
                'intensity' => 'fort',
                'image_url' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Poivre noir, Safran',
                'notes_middle' => 'Ambre, Patchouli',
                'notes_base' => 'Vanille, Oud',
                'mood' => 'Mystérieux & Profond',
            ],
            [
                'name' => 'Esprit Libre',
                'brand' => 'Studio 27',
                'family' => 'citrus',
                'intensity' => 'léger',
                'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Citron vert, Mandarine',
                'notes_middle' => 'Neroli, Thé vert',
                'notes_base' => 'Cèdre',
                'mood' => 'Énergique & Dynamique',
            ],
            [
                'name' => 'Velours Infini',
                'brand' => 'Opale',
                'family' => 'gourmand',
                'intensity' => 'présent',
                'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Prune, Cannelle',
                'notes_middle' => 'Rose, Iris',
                'notes_base' => 'Caramel salé, Bois de cachemire',
                'mood' => 'Romantique & Rêveur',
            ],
            [
                'name' => 'Brise d’Azur',
                'brand' => 'Meridiem',
                'family' => 'aquatique',
                'intensity' => 'léger',
                'image_url' => 'https://images.unsplash.com/photo-1497339100210-9e87df79c218?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Accord marin, Lime',
                'notes_middle' => 'Lotus, Mimosa',
                'notes_base' => 'Ambre gris, Musc',
                'mood' => 'Calme & Serein',
            ],
            [
                'name' => 'Rouge Vibrant',
                'brand' => 'La Coulisse',
                'family' => 'oriental',
                'intensity' => 'présent',
                'image_url' => 'https://images.unsplash.com/photo-1497339100210-9e87df79c218?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Framboise, Safran',
                'notes_middle' => 'Rose turque, Jasmin Sambac',
                'notes_base' => 'Bois de gaïac, Benjoin',
                'mood' => 'Énergique & Dynamique',
            ],
            [
                'name' => 'Orchidée Céleste',
                'brand' => 'Clair de Lune',
                'family' => 'floral',
                'intensity' => 'fort',
                'image_url' => 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Mandarine, Poivre rose',
                'notes_middle' => 'Orchidée, Magnolia',
                'notes_base' => 'Fève tonka, Santal',
                'mood' => 'Romantique & Rêveur',
            ],
            [
                'name' => 'Aube Sauvage',
                'brand' => 'Nordique',
                'family' => 'boisé',
                'intensity' => 'présent',
                'image_url' => 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Baies roses, Citron',
                'notes_middle' => 'Sauge, Lavande',
                'notes_base' => 'Vétiver, Ambroxan',
                'mood' => 'Confiant & Assuré',
            ],
            [
                'name' => 'Forêt d’Or',
                'brand' => 'Éclat',
                'family' => 'boisé',
                'intensity' => 'fort',
                'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Encens, Cardamome',
                'notes_middle' => 'Cyprès, Cèdre',
                'notes_base' => 'Myrrhe, Mousse de chêne',
                'mood' => 'Confiant & Assuré',
            ],
            [
                'name' => 'Nébuleuse',
                'brand' => 'Atelier Nova',
                'family' => 'ambiant',
                'intensity' => 'envoûtante',
                'image_url' => 'https://images.unsplash.com/photo-1508224756316-4f1818f5f3f4?auto=format&fit=crop&w=600&q=80',
                'notes_top' => 'Pamplemousse, Cassis',
                'notes_middle' => 'Iris, Tuberose',
                'notes_base' => 'Encens, Suede',
                'mood' => 'Mystérieux & Profond',
            ],
        ];

        Perfume::query()->delete();
        DB::statement('ALTER TABLE perfumes AUTO_INCREMENT = 1');

        foreach ($perfumes as $perfume) {
            Perfume::create($perfume);
        }
    }
}
