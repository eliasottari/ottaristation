# Studio vidéo « Pourquoi c'est horrible de… ? » — format SIZEX fun

Ce dossier fabrique des dessins animés 9:16 (Shorts / TikTok / Reels), générés par code (SVG → frames → MP4) et calés mot à mot sur une voix off.
**Dès que l'utilisateur envoie un fichier audio (mp3/wav), utilise la skill `video-pourquoi`** (`.claude/skills/video-pourquoi/SKILL.md`)
et suis-la de bout en bout, sans poser de questions :
1. `tools/new_episode.sh <nom> <voix>` ;
2. correction de `blocks.txt` ;
3. écriture de `scenes.js` ;
4. planches de contrôle ;
5. `tools/finish.sh <nom>` ;
6. envoi des parties.

Réponds en français, ton direct et concis.
Au tout premier usage sur une machine : `bash tools/setup.sh`.

## Règles client (résumé — le détail fait foi dans la skill)
- **Style et intro** :
  - cartoon flat, contours `#2b2420`, police **Fredoka** via `sxFun('#accent')`, un accent par épisode ;
  - intro motion (plans 1–3) avec titre 3 lignes et effet « débloqué » en étoiles ;
  - ensuite, des **décors riches** (15–30 éléments, 3 couches, éléments animés) avec une couche motion fun par-dessus.
- **Rythme et calage** :
  - voix resserrée (silences supprimés) et +10 dB ;
  - chaque action et chaque bruitage calés sur le mot (`at(n, 'mot')`) ;
  - 3–5 bruitages synthétisés par plan, pas de musique.
- **Cadrage** : visages et textes entre y 380 et 1150 ; sous y 1250, décor seulement, car le client met ses propres sous-titres. Aucun sous-titre incrusté.
- **Livraison** : MP4 1080p découpé en `partie_1, partie_2…` de moins de 30 Mo, à recoller dans CapCut.

## Arborescence
- `engine/` : le moteur.
  - lib.js : persos et primitives ;
  - motion.js : couche SIZEX ;
  - decor.js : décors riches, Kevin et figurants ;
  - cine.js : fausse 3D ;
  - player.js ;
  - sfx.py : bruitages et mix ;
  - render.mjs, snap.mjs, check.mjs.
- `template/` : squelette d'épisode.
- `tools/` : setup.sh, new_episode.sh, tighten.py, prep.py, gaps.py, finish.sh, deliver.sh.
- `exemple_gentil/`, `exemple_pauvres/`, `exemple_secours/`, `exemple_aine/` : épisodes de référence complets. **En lire un en entier avant d'écrire.**

## Épisodes faits
| Dossier | Épisode | Durée | Statut |
|---|---|---|---|
