---
name: video-pourquoi
description: Fabrique une vidéo cartoon 2D animée (format « Pourquoi c'est horrible de naître/devenir/avoir X ? ») à partir d'un fichier voix off : transcription mot à mot, découpage en blocs, 30–40 plans SVG ultra dynamiques calés sur la voix, bruitages synthétisés, rendu MP4 1080p (9:16 Shorts/TikTok ou 16:9 YouTube). À utiliser dès que l'utilisateur fournit un audio (mp3/wav) pour un nouvel épisode, même sans script ni découpage.
---

# Vidéo « Pourquoi c'est horrible de… » — de l'audio au MP4

L'utilisateur arrive avec **un fichier voix** (parfois le texte, parfois un découpage « BEATFLOW » en blocs B001…).
Tu livres **un MP4 1080p** : dessin animé flat cartoon, très dynamique, chaque action et chaque bruitage tombant
**sur le mot prononcé**. Tu ne poses pas de questions : tu fabriques, tu vérifies, tu livres.
Réponds en français, ton direct et concis.

Tout est dans ce dépôt :
- `engine/` : le moteur (SVG → frames → MP4) ;
- `template/` : le squelette d'un épisode ;
- `tools/` : la préparation, la livraison et le setup ;
- `hyperactif/`, `calvitie/`, `dents/` (ou `exemple_*/` dans le kit) : trois épisodes de référence 9:16. **Lis l'un d'eux en entier avant d'écrire.** `dents/scenes.js` est le plus récent.

## 0. Prérequis (une fois par machine)
`bash tools/setup.sh` installe node, ffmpeg, python3 + numpy, faster-whisper, playwright + chromium.
Le script vérifie d'abord ce qui est déjà là.

## 1. Créer l'épisode et caler la voix (OBLIGATOIRE, jamais au jugé)
```bash
tools/new_episode.sh <nom>            # ajouter 16x9 pour du YouTube long
cd <nom>
python3 ../tools/prep.py <chemin/voix.mp3>
```
`prep.py` fait quatre choses :
1. il convertit la voix en `assets/voix.mp3` ;
2. il transcrit mot à mot avec faster-whisper : `assets/words.json` et `words.js` ;
3. il découpe en blocs, une phrase par ligne dans `assets/blocks.txt` ;
4. il calcule `timing.js` avec `TOTAL` (fin de la voix + 0,6 s) et `BT` (début réel de chaque bloc).

Il affiche ensuite le tableau `B001 début → fin (durée) texte`.

- **Si l'utilisateur a donné un texte ou un BEATFLOW** : réécris `assets/blocks.txt` avec une ligne par bloc, la NARRATION du bloc. Puis lance `python3 ../tools/prep.py --realign`.
  - Les temps écrits dans le BEATFLOW sont souvent faux, parfois de 5 s : on ne s'en sert JAMAIS.
  - On garde l'ordre des blocs, leur sens et l'angle caméra demandé (wide / close-up / low-angle…).
  - On ignore « stickman » et les prompts d'image : on dessine avec NOS personnages.
- **Sinon** : relis les phrases auto. Corrige les mots mal entendus dans `blocks.txt` : prénoms, nombres (« 5 » → « cinq »), mots inventés. Fusionne les fragments trop courts (< 0,4 s) et relance `--realign`.
- Une transcription douteuse ? Réécoute le passage avec le modèle `medium` (`--model medium`).

## 2. Écrire `scenes.js` (le cœur du travail)
Pars de `template/scenes.js`.

**Le titre :**
- Remplis `TITLE` : 3 lignes, la question de l'épisode, le dernier mot en couleur `TITLE_COL`.
- Chaque ligne doit faire ≤ ~16 caractères. Exemples : « POURQUOI C'EST » / « HORRIBLE D'AVOIR » / « UN APPAREIL ? ».

**Les personnages :**
- Définis 2 à 4 personnages récurrents avec `person()` / `head()`. Garde le même héros, la même couleur de t-shirt et la même coiffure tout du long.

**Les plans :**
- Un `B(n, {...})` par bloc. Un bloc long (> 2,5 s) ou à deux idées se coupe en sous-plans : `B(n, {...}, at(n, 'mot') - .15)`.
- Vise 33 à 40 plans pour ~60 s.

**Les objets nouveaux :**
- S'il faut un objet réutilisable (outil, animal, décor), crée-le dans `engine/<theme>.js` et ajoute la balise `<script>` dans `index.html`.
- Les objets propres à un seul épisode vont dans `scenes.js`.

### Anatomie d'un plan
```js
B(12, { enter: 'crash', flash: 1,                    // entrée : 'punch' (défaut) | 'whip' | 'drop' | 'crash' | 'tilt' | 'none'
  cam: (t, d) => ({ z: lerp(1, 1.1, t / d), hand: .5, shake: t > at(12, 'boum') ? 8 : 0, r: -6, cy: 800 }),
  draw: (t, d) => fond + perso + accessoires + texte,  // renvoie une chaîne SVG (1080×1920 ; W, H globaux)
  sfx: [[0, 'whoosh', .7], [at(12, 'boum'), 'boom', .9], [at(12, 'boum') + .1, 'gasp', .6]] });
```
- `t` = temps depuis le début du plan, `d` = durée du plan.
- `at(n, 'mot', k)` = temps relatif au bloc n du k-ième mot qui commence par « mot », sans accents. **Tout événement visible ou sonore est placé avec `at()`**, jamais avec un nombre au hasard. Si la console affiche `at(): mot introuvable`, cherche le mot tel que whisper l'a écrit dans `words.js`.
- `zin(a, b, hand)` est un zoom lent. `camHand(z, a)` est une caméra épaule.

### Le style (règles validées par le client — à respecter à la lettre)
1. **Look** : cartoon flat, contours épais `#2b2420`, têtes rondes, yeux points, joues roses, fonds pastel en dégradé, poussières flottantes (automatiques).
2. **Ciné et cartoon extrême (style V2)** :
   - Varie les valeurs de plan d'un plan à l'autre : très large → moyen → gros plan → insert.
   - Utilise plongées, contre-plongées (`cy`), plans débullés (`r`), caméra épaule (`hand`), crash zooms, whip pans, `flash` sur les chocs.
   - Fausse 3D avec `depth({zoom, x}, [{z:1.6, svg:fond, haze:.1}, {z:1, svg:persos}, {z:.6, svg:blur(10, premierPlan)}])`.
3. **Réactions exagérées** : chaque plan a une expression forte.
   - `EXPR` disponibles : terror, panic, jawdrop, chatter, sob, rage, ecstatic, dizzy, dead, effort, smugger, zen, chill, wow, love, mock, embarrassed, starving, metal, metalPain, metalShock, perfect…
   - Effets : `sweatSpray`, `tremble`, larmes en fontaine, vapeur. « Même quand c'est chill, c'est chill de ouf. »
4. **Gags visuels** : chaque phrase est **illustrée littéralement et poussée à l'absurde**. Une purée « sport de combat » devient une purée-boxeur sur un ring ; « liberté surveillée » donne un bracelet électronique sous un projecteur. Un gag lisible en 1 seconde.
5. **Texte punch** : un mot-clé en `tag()`, `stamp()` ou `bigText()` sur les moments forts (« 2 ANS », « PARDON ?! »). **Jamais de sous-titres** : le client met les siens.
6. **Cadrage 9:16** : visages et textes entre **y≈380 et y≈1150** (sur 1920). **Sous y≈1250 : décor seulement** (sol, table, bas du corps), car les sous-titres TikTok sont là.
   - Une personne `s:1.4` debout à `y:1500` a la tête vers y≈1090 : c'est la bonne hauteur.
   - **Cadrage 16:9** : textes entre y 90 et 650, visages au-dessus de y 700.
7. **Titre** : seulement dans le plan 1, en haut, avec `title(t)`. Il est petit et loin des bords car YouTube Shorts recadre.
8. **Bruitages** : 3 à 5 par plan, chacun sur l'action. Noms disponibles :
   angel baby_coo boing boom buzz chirp chomp clock_fast coins crack crickets ding drum ecg_beep error_beep fire flash_hit flutter gasp ghost glint growl gulp hammer heartbeat hmm jackpot kaching kiss magic pop pop_hi printer rewind rimshot ring school_bell scratch shutter siren sizzle slot snip sparkle spray squeak steps sting tada thud thunder tick tiptoe typing vibrate waves whistle whoosh whoosh_up wind wolf zap
   (`python3 engine/sfx.py preview` pour les écouter). Shorts : **pas de musique**, bruitages synthétisés seulement.
9. **Pudique** : rien de gore ni de sexuel ; tout passe en cartoon (miettes plutôt que sang, cœurs derrière une feuille).
10. **Fin** : la dernière phrase en gros texte et un dernier gag. Le fondu au noir est automatique.

### Boîte à outils du moteur (voir les fichiers pour les options)
- **lib.js**
  - Personnages : `person({age:'kid'|'adult'|'baby', x, y, s, expr, look:[x,y], armL/armR:[a1,a2], legL/legR, holdR:svg, walk, tremble, flip, rot, hair, hairColor, shirt, glasses, mustache, cap, coat, face:{eyes,mouth,brows}})` et `head({hr, expr, ...})`.
  - Primitives : rect circ ell path line text grad glow sunburst.
  - Effets : speedLines motionLines impactStar sparkle steam flames sweat heart cloud bubble.
  - Animation : pop seg lerp wave eOutBack.
  - Décors et objets : building windowFrame doorFrame desk chair phone mirror bill wallet scissors…
- **cine.js** : depth blur haze handheld letterbox povEyes streaks shockRing fgGrass fgRock bokeh.
- **Thèmes** :
  - `bugs.js` : insectes, branches, médaille, éclair ;
  - `sea.js` : tortue, aigle, crabe, plage, mer ;
  - `hair.js` : cheveux, calvitie ;
  - `teeth.js` : bouche géante, appareil dentaire, nourriture, prison.
- **Aides du template** : title tag stamp bigText rays cross calendar stars confetti chatBubble sweatSpray puddle bigClock heartsUp, décors tiles bathroomWall mirror sink classroom street bedroomNight laptop showerBg.

## 3. Vérifier (toujours, avant le rendu)
```bash
node ../engine/check.mjs                                    # doit finir par [nPlans, [], nCues] : aucune erreur, aucun NaN
GUIDE=1 node ../engine/snap.mjs /tmp/p1.png B1:.8 B2:.7 B3:.7 ...   # planche contact (12 plans par planche), bande rouge = sous-titres
```
Regarde **chaque** planche (outil Read sur le PNG) et corrige :
- un visage ou un texte dans la bande rouge ;
- un bras ou un objet qui cache un visage ;
- un personnage coupé ou hors champ ;
- un fond noir (couche trop courte : dégradé de hauteur `H + 2*M`) ;
- un texte illisible ;
- un plan vide ou statique.

Refais les planches jusqu'à ce que tout soit propre.

## 4. Rendu et livraison
```bash
node ../engine/render.mjs out/<nom>_9x16.mp4 assets/voix.mp3     # ~2 min pour 60 s (lance-le en tâche de fond)
ffmpeg -i out/<nom>_9x16.mp4 -af volumedetect -vn -f null - 2>&1 | grep volume   # moyenne ≈ -11 dB, max ≤ 0
../tools/deliver.sh out/<nom>_9x16.mp4    # découpe en partie_1, partie_2… si > 30 Mo (le client recolle dans CapCut)
```
Ensuite :
1. Fais une planche du MP4 final : `ffmpeg -i out/x.mp4 -vf "select='not(mod(n\,64))',scale=216:384,tile=10x3" -frames:v 1 /tmp/final.png`.
2. Commit + push (`out/tmp/` est ignoré).
3. Envoie le MP4 en qualité max, sans aperçu basse qualité.
4. Ajoute une ligne au tableau des épisodes de CLAUDE.md.

Si l'utilisateur ne réagit qu'à l'audio (niveau des bruitages) : `AUDIO_ONLY=1 node ../engine/render.mjs …` remixe sans refaire l'image. Les gains sont dans `engine/sfx.py` (`SFX_GAIN`).

## Option : bande-son ElevenLabs (format long YouTube seulement, sur demande)
`engine/eleven.py` génère des musiques, ambiances et bruitages depuis `assets/sfx/spec.json`.
- La clé va dans `engine/.env` (`ELEVENLABS_API_KEY=…`, gitignoré). **Ne jamais la committer ni l'écrire ailleurs.**
- Cues `'el:clef'` et nappes `BEDS = [{name:'el:m_xxx', t0, t1, vol, duck, fin, fout}]`. Voir `tortue/` si présent.
