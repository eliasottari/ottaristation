---
name: video-pourquoi
description: Fabrique une vidéo cartoon 2D animée « Pourquoi c'est horrible de… ? » au format SIZEX fun (cartoon + motion design rebondi, police Fredoka, décors riches) à partir d'un fichier voix off. Elle couvre la voix resserrée et +10 dB, la transcription mot à mot, 32–45 plans SVG calés au mot près, les bruitages synthétisés et le rendu MP4 1080p 9:16 (Shorts / TikTok / Reels) découpé en parties de moins de 30 Mo. À utiliser dès que l'utilisateur envoie un audio (mp3/wav) pour un nouvel épisode, même sans texte ni découpage.
---

# Vidéo « Pourquoi c'est horrible de… ? » — format SIZEX fun

L'utilisateur envoie **un fichier voix**, parfois avec le texte ou un découpage en blocs B001….
Tu livres **un MP4 1080p 9:16** :
- un dessin animé cartoon flat avec une couche de motion design fun ;
- chaque action et chaque bruitage tombent **sur le mot prononcé** ;
- le MP4 est découpé en `partie_1, partie_2…` (moins de 30 Mo chacune), que l'utilisateur recolle dans CapCut.

**Tu ne poses pas de questions** : tu fabriques, tu vérifies, tu livres. Réponds en français, ton direct et concis.

Pour un résultat identique à la série d'origine, applique les règles ci-dessous **à la lettre**. Lis toujours **un exemple complet avant d'écrire** :
- `exemple_gentil/scenes.js` ;
- `exemple_pauvres/scenes.js` ;
- `exemple_secours/scenes.js` ;
- dans le dépôt d'origine : `gentil/`, `pauvres/`, `secours/`, `aine/`.

## 0. Prérequis (une fois par machine)
Lance `bash tools/setup.sh`. Il installe node, ffmpeg, python3 + numpy, faster-whisper, playwright + chromium.

## 1. Préparer l'épisode (une commande)
```bash
tools/new_episode.sh <nom> <chemin/voix.mp3>
```
La commande enchaîne cinq étapes :
1. Elle crée `<nom>/` depuis `template/`, avec `index.html` (moteur + motion.js + decor.js + grain) et le squelette `scenes.js`.
2. Elle **resserre la voix** avec `tools/tighten.py --keep .06 --min .12`. Les silences sont supprimés et les phrases s'enchaînent bord à bord, à la TikTok. C'est une demande client.
3. Elle **transcrit mot à mot** avec `tools/prep.py` et faster-whisper. Elle écrit :
   - `words.js` (`WORDS = [[début, fin, mot]…]`) ;
   - `assets/blocks.txt` (une phrase par ligne) ;
   - `timing.js` (`TOTAL`, `BT` = début réel de chaque bloc).
4. Elle produit la **voix finale +10 dB** avec limiteur : `assets/voix.mp3`. C'est une demande client.
5. Elle **contrôle les trous** avec `tools/gaps.py`. Whisper saute parfois une phrase entière : on voit alors un trou de plus de 0,8 s entre deux mots alors que la voix parle. Dans ce cas :
   1. lance `python3 ../tools/gaps.py --fix` : le passage est retranscrit avec le modèle medium et les mots sont insérés ;
   2. ajoute la phrase affichée à sa place dans `blocks.txt` ;
   3. relance `--realign`.

   Ne remplis **jamais** un trou par un plan « silence ».

Ensuite, `cd <nom>` et relis `assets/blocks.txt` :
- **Corrige les mots mal entendus en gardant le sens.** Exemples : « tu prêtes de t'éjouer » → « tu prêtes ton jouet » ; « Il revient de casser » → « Il revient cassé ».
- **Fusionne** les fragments de moins de 0,5 s avec le bloc voisin (« Pardon ? », « Tu viens ? »).
- **Coupe** un bloc de plus de 4 s s'il porte deux idées.
- **Relance le calage** : `python3 ../tools/prep.py --realign`.
- **Si l'utilisateur a fourni un découpage** (BEATFLOW, B001…) : une ligne par bloc avec sa NARRATION.
  - Ses temps écrits sont souvent faux, parfois de 5 s : on ne s'en sert **jamais**, seul le calage sur la voix compte.
  - On garde l'ordre et le sens de chaque bloc, ainsi que l'angle caméra demandé.
  - On ignore « stickman » et les prompts d'image.

## 2. Écrire `scenes.js` (le cœur du travail)
Pars du squelette (`template/scenes.js`). Il contient déjà :
- les aides `B`, `at`, `dur` ;
- un plan 1 signature ;
- un plan d'intro motion ;
- un plan en décor riche.

Vise **32–45 plans pour ~60–70 s**, soit un `B(n, {...})` par bloc. Un bloc de 2,5 s ou plus, ou un bloc à deux idées, se coupe en sous-plans : `B(n, {...}, at(n, 'mot') - .15)`.

### Anatomie d'un plan
```js
B(12, { enter: 'crash', flash: 1,          // entrée cartoon : 'punch' (défaut) | 'whip' | 'drop' | 'crash' | 'tilt' | 'none'
  trans: 'wipe', transD: .25,              // OU transition motion : 'wipe' | 'zoom' | 'circle' | 'push' | 'up' | 'glitch' | 'black'
  cam: (t, d) => ({ z: lerp(1, 1.1, t / d), hand: .5, shake: t > at(12, 'boum') ? 8 : 0, r: -6, cy: 800 }),
  draw: (t, d, T) => décor + persos + accessoires + couche motion,    // chaîne SVG 1080×1920 (W, H globaux)
  sfx: [[0, 'whoosh', .6], [at(12, 'boum'), 'boom', .8], [at(12, 'boum') + .1, 'gasp', .6]] });
```
- `t` est le temps depuis le début du plan, `d` la durée du plan.
- `at(n, 'mot', k)` donne le temps, relatif au bloc n, du k-ième mot qui commence par « mot » (sans accents).
- **Tout événement visible ou sonore se place avec `at()`**, jamais avec un nombre au hasard.
- Si `at(): mot introuvable` apparaît, cherche le mot tel que whisper l'a écrit dans `words.js` (« 20 » et non « vingt »).

### LES RÈGLES DU FORMAT (validées client — non négociables)
1. **Police et accent.** En haut de scenes.js, appelle `sxFun('#ACCENT')`, avec **un accent propre à l'épisode**. Tous les textes motion passent alors en **Fredoka** gras avec contour cartoon. `SX.acc2 = '#ffd23f'` sert aux mots-clés et annotations.
2. **Intro (plans 1 à 3) = signature motion**, sur fond graphique : `gridBg(SX.ink) + halftoneFade(...)` ou `paper() + gobo(T)`. Le héros et les persos sont en `cutout(...)` (bord blanc d'autocollant).
3. **Titre au plan 1**, en 3 lignes, en haut, petit et loin des bords car YouTube Shorts recadre :
   ```js
   kthin("POURQUOI C'EST", CX, 330, t, .05, {size: 62}) +
   kthin("HORRIBLE D'ÊTRE LE", CX, 415, t, .3, {size: 58}) +
   kword('MOT-CLÉ ?', CX, 540, t, at(1, 'mot') - .05, {size: 66–80, fill: SX.acc2})
   ```
   Chaque ligne fait au plus ~760 px de large : Fredoka gras ≈ 0,6 × taille par caractère.
4. **Effet « débloqué » en ÉTOILES sur le mot-clé du titre.** Place `unlock(x, y, t, t0, {part: 'back', r: 480})` AVANT le perso (rayons) et `unlock(..., {part: 'front', r: 480})` APRÈS (flash + gerbe d'étoiles). Ressors-le sur **2 ou 3** moments de prise de conscience, pas plus. **`rings` est interdit partout.**
5. **Après l'intro : de VRAIS DÉCORS RICHES et vivants.** Le client veut un MAX d'éléments : 15 à 30 par décor, 3 couches de profondeur, et 2 ou 3 éléments animés (nuages, oiseaux, vapeur de tasse, horloge, rideau, néon, figurants).
   - `engine/decor.js` en fournit de prêts à l'emploi : `streetT`, `schoolyard`, `classroomT`, `hallway`, `bedroomN`, `salonF`, `partyT`, `restoT`, `SKY`, `kidsBg` (figurants).
   - Les accessoires `d*` servent à composer d'autres décors : `dWall`, `dParquet`, `dTileFloor`, `dShelf`, `dBooks`, `dFrame`, `dPoster`, `dPot`, `dCurtain`, `dWindowView`, `dLamp`, `dMug`, `dBuilding`, `dCar`, `dBike`, `dBush`, `dLampPost`, `dBench`, `dFlowers`, `dNeon`, `dSpeaker`…
   - **Crée les décors propres au sujet** (cinéma, plateau, salle de sport, cuisine…) dans scenes.js, en composant ces accessoires.
   - Profondeur : `depth({zoom, x}, [{z: 1.5, svg: décor, haze: .1}, {z: 1, svg: persos}, {z: .6, svg: blur(10, objetDePremierPlan)}])`.
   - `WASH()` ajoute un voile léger qui garde les visages lisibles.
   - Les fonds de couleur unie ou à rayons (`rays`) se limitent à **2–4 plans « concept »** au maximum.
6. **Couche motion fun par-dessus le décor**, rebondie et cernée de `#2b2420`, jamais « corporate » :
   - `funTag` : étiquette molle ;
   - `funBox` : cadre tremblé avec étiquette « fichier.png » ;
   - `burst` : explosion BD ;
   - `blob`, `squiggle` ;
   - `popStars` ;
   - `kword` (mot-clé slam) et `kthin` (mots de liaison) ;
   - `markerArrow`, `markerCircle`, `markerText` ;
   - `card` ;
   - `counter`.

   **Interdits : `selBox`, `pill`, `rings`.** Un seul mot-clé fort par moment, posé sur `at()`.
7. **Transitions** : une transition motion (`trans`, `transD` .2–.3) environ **1 plan sur 3**, en alternance avec les entrées cartoon (`crash`, `whip`, `drop`, `flash: 1` sur les chocs).
8. **ADN cartoon extrême.** Chaque plan a une expression forte (`EXPR`) : terror, panic, jawdrop, sob, rage, ecstatic, dizzy, embarrassed, smugger, mock, starving, shock, confused, suspicious, chill…
   - **Gags pris au pied de la lettre et poussés à l'absurde**, lisibles en 1 s. Exemples : « développer une colonne vertébrale » = une colonne qui pousse dans le dos ; « figurant dans ta propre vie » = un plateau de tournage.
   - Caméra : épaule (`hand`), crash zooms, plongées et contre-plongées (`cy`), débullés (`r`). « Même quand c'est chill, c'est chill de ouf. »
9. **Héros et persos.**
   - Le héros **porte visuellement le sujet** : barbe clairsemée, cernes, auréole qui se fissure, chasuble de remplaçant… Crée ces overlays dans scenes.js via `hairFn` (voir `gentilHair` dans l'exemple) et garde-les tout l'épisode.
   - **Kevin** est le personnage récurrent (rouquin à pics, t-shirt vert, taches de rousseur) : `kevin()` / `kevinHead()` de decor.js. Les figurants viennent de `kid(i)` et `adult(i)`.
   - Ne déclare jamais une `const` qui porte le nom d'une fonction du moteur (`hero`, `phone`, `mirror`, `cloud`, `plane`…) : préfixe tes noms.
10. **Cadrage 9:16.** Visages et textes entre **y≈380 et y≈1150** (sur 1920). **Sous y≈1250, décor seulement**, car le client met ses sous-titres là. Un perso `s: 1.3–1.4` debout à `y: 1480–1500` a la tête vers y≈1100. **Aucun sous-titre incrusté.**
11. **Bruitages** : **3 à 5 par plan**, chacun sur l'action avec `at()`. Synthétisés uniquement, **pas de musique**. Noms disponibles :
    angel baby_coo boing boom buzz chirp chomp clock_fast coins crack crickets ding drum ecg_beep error_beep fire flash_hit flutter gasp ghost glint growl gulp hammer heartbeat hmm jackpot kaching kiss magic pop pop_hi printer rewind rimshot ring school_bell scratch shutter siren sizzle slot snip sparkle spray squeak steps sting tada thud thunder tick tiptoe typing vibrate waves whistle whoosh whoosh_up wind wolf zap

    Usage motion : `pop_hi` ou `tick` sur les étiquettes, `boom` sur le slam d'un mot-clé, `scratch` sur le marqueur, `whoosh` sur les transitions.
12. **Sujets sensibles** : traités en cartoon pudique et bienveillant, sans jamais se moquer de la personne qui vit la situation. Rien de gore ni de sexuel.
13. **Fin** : la dernière phrase en gros (`kword` / `kthin`) et un dernier gag. Le fondu au noir est automatique.

## 3. Vérifier (toujours, avant le rendu)
```bash
node ../engine/check.mjs        # doit finir par [nPlans, [], nCues] : aucune erreur, aucun NaN, aucun « mot introuvable »
GUIDE=1 node ../engine/snap.mjs /tmp/<nom>_1.png B1:.85 B2:.8 B3:.7 ...   # 12 plans par planche, bande rouge = sous-titres
```
Regarde **chaque** planche (lis le PNG) et corrige :
- un visage ou un texte dans la bande rouge ;
- un texte qui déborde (plus de ~900 px) ;
- un objet ou un bras qui cache un visage ;
- des superpositions laides ;
- du noir sur les bords (couche trop courte : utiliser `-M` à `W + 2*M`, `H + 2*M`) ;
- un plan vide ou statique ;
- un décor pauvre (moins de 15 éléments).

Refais les planches jusqu'à ce que **tout** soit propre.

## 4. Rendu et livraison (une commande)
```bash
../tools/finish.sh <nom>     # check → rendu 1080p 30 fps (~2–4 min pour 70 s) → niveau audio → planche finale → parties < 30 Mo
```
1. Regarde `out/planche_finale.png`. Le niveau doit afficher mean ≈ -11 à -14 dB et max ≤ 0.
2. Envoie `out/partie_1.mp4`, `partie_2.mp4`… dans l'ordre, en qualité max, sans aperçu basse qualité.
3. Si c'est un dépôt git : commit + push. `out/tmp/` et `out/partie_*` sont ignorés.

Une retouche qui ne touche que l'audio (niveau des bruitages) se fait sans refaire l'image : `AUDIO_ONLY=1 node ../engine/render.mjs out/<nom>_9x16.mp4 assets/voix.mp3`. Les gains sont dans `engine/sfx.py` : `SFX_GAIN`, avec des bruitages ~10–16 dB sous la voix.

## Mémo de la boîte à outils
- **lib.js** :
  - personnages : `person({age:'kid'|'adult'|'baby', x, y, s, expr, look, armL/armR:[a1,a2], holdR, walk, tremble, flip, hair, hairColor, hairFn, shirt, glasses, freckles…})` et `head({hr, expr, …})` ;
  - primitives : `rect circ ell path line text grad glow sunburst G tr op` ;
  - effets : `speedLines impactStar sparkle steam sweat heart cloud lightning` ;
  - animation : `pop seg lerp wave clamp eOutBack eOutCubic eInOut` ;
  - objets : `bill phone desk chair building`….
- **cine.js** : `depth blur haze handheld fgGrass bokeh`.
- **motion.js** : `sxFun SX kword kthin ftext funTag funBox burst blob squiggle popStars unlock cutout card counter markerArrow markerCircle markerText gridBg halftoneFade paper gobo grain`.
- **decor.js** :
  - décors : listés en règle 5 ;
  - aides : `rays stamp cross confetti chatBubble heartsUp sweatSpray zin camHand clipR mixC WASH bigClockF` ;
  - persos : `kevin kevinHead kid adult`.
- **Thèmes en option** : `hair.js` (cheveux, `bigForehead`), `teeth.js` (bouche, appareil dentaire), `bugs.js`, `sea.js`.
