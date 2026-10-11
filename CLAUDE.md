# OttariStation — vidéos courtes animées « Pourquoi c'est l'enfer de naître… »

Projet : vidéos en dessin animé 2D générées par code (SVG → frames → MP4), calées sur une voix off fournie
par l'utilisateur, avec bruitages. Formats : **9:16 TikTok** (courts) et **16:9 YouTube** (format long, depuis `tortue/`).
Bande-son « film » : musiques + ambiances + SFX générés avec **ElevenLabs** (voir plus bas) + SFX synthétisés.
L'utilisateur parle français : répondre en français, ton direct et concis.

## Épisodes faits
| Dossier | Épisode | Durée | Statut |
|---|---|---|---|
| `roux/`  | Pourquoi c'est l'enfer de naître roux ? (33 plans) | 75 s | ✅ validé par l'utilisateur |
| `mante/` | Pourquoi c'est horrible de naître mante religieuse ? (35 plans) | 64,6 s | ✅ livré |
| `tortue/` | Pourquoi c'est horrible de naître tortue ? (182 blocs, **16:9 YouTube**, bande-son ElevenLabs) | 7 min 02 | ✅ livré |

## Ce que l'utilisateur fournit pour un nouvel épisode
1. Un fichier voix (mp3/wav) uploadé.
2. Le texte de narration.
3. Un découpage « BEATFLOW — LOT D'IMAGES » : blocs `B001…Bnnn`, chacun avec NARRATION, CAMERA LOCK
   (wide / close-up / low-angle / high-angle / medium / side-profile) et un nom de fichier contenant les temps :
   `EP001_B007_000016-320_000020-480_...` = début `00:00:16.320` → fin `00:00:20.480` (format HHMMSS-mmm,
   donc `000114-371` = 1 min 14,371 s = 74,371 s). **Ces temps servent à caler chaque plan.**
   - **Ignorer la mention « stickman »** et les prompts de génération d'image : on garde NOS personnages (voir style).
   - On respecte l'ordre, le sens de chaque bloc et l'angle caméra demandé, de façon libre et drôle.

## Règles validées par l'utilisateur (IMPORTANT)
- **Style** = celui de sa vidéo de référence « gaucher » : cartoon flat, contours épais `#2b2420` (7 px),
  têtes rondes, yeux points, joues roses, mains rondes, fonds pastel avec dégradé + poussières flottantes.
  Implémenté dans `engine/lib.js` (`person`, `head`, `EXPR`…). Animaux : même langage (`engine/bugs.js`).
- **Très dynamique** : décors 2D, expressions faciales variées, beaucoup d'actions, mouvements caméra
  (punch/whip/drop, zooms, tremblements), étincelles, traits de vitesse, fonds à rayons sur les moments forts.
- **SFX obligatoires**, calés sur l'action (≈3–5 par plan).
- **Titre d'accroche en haut du 1er plan** (question de l'épisode, dernier mot en couleur) : l'utilisateur adore.
  Un peu de texte « punch » est OK (ex. « 1 à 2 % », « 180° », « VIVANT ! », phrase finale en gros).
- **CADRAGE 9:16 (retour utilisateur)** : il ajoute ses propres sous-titres TikTok vers 65–75 % de la hauteur.
  → Visages et infos clés entre **y≈380 et y≈1150** (sur 1920). **Sous y≈1250 : décor seulement**
  (sol, herbe, branche, table…). Vérifier avec `GUIDE=1` (bande rouge = zone sous-titres).
- Pas de sous-titres incrustés par nous (il les met lui-même).
- Contenu sensible traité en cartoon pudique (cœurs derrière une feuille, miettes plutôt que sang).
- Niveau audio : SFX ~10–16 dB sous la voix (`SFX_GAIN` synthés, `EXT_GAIN` ElevenLabs dans `engine/sfx.py`),
  musique ~13 dB sous la voix en moyenne (`BED_GAIN`) avec ducking automatique pendant que la voix parle.
- En 16:9 (YouTube) pas de zone sous-titres à éviter : cadrer librement sur 1920×1080.

## Architecture
```
engine/            moteur commun à tous les épisodes
  lib.js           maths/easing, primitives SVG, fonds, effets, personnages humains, accessoires
  bugs.js          mantes, mouche, oiseau (dans scenes), branches, feuilles, accessoires nature
  sea.js           tortue (turtle profil / turtleFront / turtleTop, bébé ou adulte, nœud rose = héroïne), œuf,
                   aigle/mouette (eagle, gull:1), crabe, poissons, requin, méduse, sac plastique, sargasses, filet,
                   hôtels, route, voiture (phares), lampadaire, thermomètre, ♂/♀, Terre magnétique,
                   décors 16:9 : bgBeach, bgNightBeach, bgSand (coupe), bgUnder, bgSplit (surface)
  eleven.py        génère assets/sfx/<clef>.mp3 depuis assets/sfx/spec.json via l'API ElevenLabs
  player.js        renderFrame(T) : caméra (cam/enter/flash/shake), overlay, poussières, vignette, fondu final
  sfx.py           ~55 bruitages synthétisés en numpy + mixage voix/SFX/nappes (ducking, limiteur doux)
  render.mjs       rendu 30 fps en parallèle (4 workers) → ffmpeg → mix audio → MP4 final
  snap.mjs         planche contact de frames pour vérifier (GUIDE=1 = affiche la zone sous-titres)
  fredoka.woff2    police des textes
<episode>/
  index.html       charge engine/lib.js, engine/bugs.js, (engine/sea.js), scenes*.js, engine/player.js
                   16:9 : `<script>var STAGE = [1920, 1080];</script>` AVANT lib.js + viewBox 1920×1080 (voir tortue/index.html)
  scenes.js        TOTAL (durée = fin voix + ~0,6 s) et SCENES = [{ s, draw(t,d,T), cam, enter, flash, overlay, sfx:[[dt,'nom',vol]] }]
                   cue 'el:clef' = fichier ElevenLabs assets/sfx/clef.mp3 ; BEDS = [{name:'el:m_xxx', t0, t1, vol, duck, fin, fout}]
                   (musiques/ambiances en boucle). Long épisode : scenes.js + scenes_b.js + scenes_c.js, helper B(n, {...}, offset)
                   avec le tableau BT des débuts de blocs ; trier SCENES à la fin.
  assets/          voix (roux.mp3 / voix.wav / voix.mp3) ; assets/sfx/ (spec.json + mp3 ElevenLabs, commités)
  out/<nom>_9x16.mp4 ou <nom>_16x9.mp4   rendu final (commité)
```
Un plan = un objet de `SCENES` (on peut couper un bloc long en 2 sous-plans). `draw` renvoie une chaîne SVG
(1080×1920 ou 1920×1080 ; `W`, `H` globaux). Bruitages dispo : voir `LIB` dans `engine/sfx.py` (`python3 engine/sfx.py preview` pour les écouter).

## Commandes
```bash
cd <episode>
node ../engine/snap.mjs /tmp/planche.png 1.2 3.5 6.0        # aperçu de frames (ajouter GUIDE=1 devant)
node ../engine/render.mjs out/<nom>_9x16.mp4 assets/<voix>   # rendu complet (~2 min pour 70 s, ~13 min pour 7 min en 16:9)
AUDIO_ONLY=1 node ../engine/render.mjs out/x.mp4 assets/voix.mp3 # remixe seulement l'audio (réutilise out/tmp/video.mp4)
python3 ../engine/eleven.py [clef...]                          # génère les sons manquants (ou régénère les clefs données)
```

## ElevenLabs (bande-son)
- Clé API : dans `engine/.env` (`ELEVENLABS_API_KEY=...`, **gitignoré, ne jamais committer ni écrire la clé ailleurs**).
  Si le fichier n'existe plus (nouveau conteneur), redemander la clé à l'utilisateur.
- Compte **gratuit** (≈10 000 crédits/mois ; ~3–10 crédits/s de son) : l'API Musique (`/v1/music`) est refusée (402).
  → musiques ET ambiances via `/v1/sound-generation` (`loop: true`, 30 s max, `eleven_text_to_sound_v2`),
  prompts « cinematic … music loop, instrumental, no vocals ». Préfixes : `m_` musique, `a_` ambiance, sinon SFX.
- Les sons de `tortue/assets/sfx/` sont réutilisables (aigle, mouette, vagues, crabe, voiture, klaxon, bulles, filet…).
Outils déjà présents dans l'environnement cloud : node, playwright global + Chromium (/opt/pw-browsers), ffmpeg, python3 + numpy.

## Méthode pour un nouvel épisode
1. `mkdir <ep>/assets` ; copier la voix ; `ffprobe` pour la durée ; copier `index.html` d'un épisode existant
   (`tortue/` pour du 16:9). `ffmpeg -i voix -af silencedetect=noise=-35dB:d=0.18 -f null -` donne les reprises de
   parole : utile pour couper un bloc long en sous-plans.
2. Lister les temps des blocs ; écrire `scenes.js` (s'inspirer de `mante/scenes.js`). Nouveaux persos/accessoires
   réutilisables → les ajouter dans `engine/` (bugs.js ou un nouveau fichier chargé par index.html).
3. Planches contact à ~70 % de chaque plan avec `GUIDE=1`, corriger cadrage/poses.
4. Sons : écrire `assets/sfx/spec.json`, lancer `eleven.py`, placer les cues `el:` et les `BEDS` (une musique par
   section d'ambiance : comédie, tension, émotion…).
5. Rendu, vérifier durée + `volumedetect`, planche du MP4 final, commit + push, envoyer le MP4 à l'utilisateur.
