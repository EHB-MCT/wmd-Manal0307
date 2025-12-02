<?php

namespace Database\Seeders;

use App\Models\Perfume;
use Illuminate\Database\Seeder;

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
                'image_url' => null,
                'notes_top' => 'Bergamote, Poire',
                'notes_middle' => 'Pivoine, Jasmin',
                'notes_base' => 'Musc blanc',
                'mood' => 'Calme',
            ],
            [
                'name' => 'Noir Tempête',
                'brand' => 'Atelier Nuit',
                'family' => 'oriental',
                'intensity' => 'fort',
                'image_url' => null,
                'notes_top' => 'Poivre noir, Safran',
                'notes_middle' => 'Ambre, Patchouli',
                'notes_base' => 'Vanille, Oud',
                'mood' => 'Mystérieux',
            ],
            [
                'name' => 'Esprit Libre',
                'brand' => 'Studio 27',
                'family' => 'citrus',
                'intensity' => 'léger',
                'image_url' => null,
                'notes_top' => 'Citron vert, Mandarine',
                'notes_middle' => 'Neroli, Thé vert',
                'notes_base' => 'Cèdre',
                'mood' => 'Énergique',
            ],
            [
                'name' => 'Velours Infini',
                'brand' => 'Opale',
                'family' => 'gourmand',
                'intensity' => 'présent',
                'image_url' => null,
                'notes_top' => 'Prune, Cannelle',
                'notes_middle' => 'Rose, Iris',
                'notes_base' => 'Caramel salé, Bois de cachemire',
                'mood' => 'Romantique',
            ],
            [
                'name' => 'Aube Sauvage',
                'brand' => 'Nordique',
                'family' => 'boisé',
                'intensity' => 'présent',
                'image_url' => null,
                'notes_top' => 'Baies roses, Citron',
                'notes_middle' => 'Sauge, Lavande',
                'notes_base' => 'Vétiver, Ambroxan',
                'mood' => 'Aventurier',
            ],
            [
                'name' => 'Orchidée Céleste',
                'brand' => 'Clair de Lune',
                'family' => 'floral',
                'intensity' => 'fort',
                'image_url' => null,
                'notes_top' => 'Mandarine, Poivre rose',
                'notes_middle' => 'Orchidée, Magnolia',
                'notes_base' => 'Fève tonka, Santal',
                'mood' => 'Luxueux',
            ],
            [
                'name' => 'Brise d’Azur',
                'brand' => 'Meridiem',
                'family' => 'aquatique',
                'intensity' => 'léger',
                'image_url' => null,
                'notes_top' => 'Accord marin, Lime',
                'notes_middle' => 'Lotus, Mimosa',
                'notes_base' => 'Ambre gris, Musc',
                'mood' => 'Minimaliste',
            ],
            [
                'name' => 'Rouge Vibrant',
                'brand' => 'La Coulisse',
                'family' => 'oriental',
                'intensity' => 'présent',
                'image_url' => null,
                'notes_top' => 'Framboise, Safran',
                'notes_middle' => 'Rose turque, Jasmin Sambac',
                'notes_base' => 'Bois de gaïac, Benjoin',
                'mood' => 'Créatif',
            ],
            [
                'name' => 'Forêt d’Or',
                'brand' => 'Éclat',
                'family' => 'boisé',
                'intensity' => 'fort',
                'image_url' => null,
                'notes_top' => 'Encens, Cardamome',
                'notes_middle' => 'Cyprès, Cèdre',
                'notes_base' => 'Myrrhe, Mousse de chêne',
                'mood' => 'Mystérieux',
            ],
            [
                'name' => 'Nébuleuse',
                'brand' => 'Atelier Nova',
                'family' => 'ambiant',
                'intensity' => 'envoûtante',
                'image_url' => null,
                'notes_top' => 'Pamplemousse, Cassis',
                'notes_middle' => 'Iris, Tuberose',
                'notes_base' => 'Encens, Suede',
                'mood' => 'Occasions spéciales',
            ],
        ];

        foreach ($perfumes as $perfume) {
            Perfume::create($perfume);
        }
    }
}
