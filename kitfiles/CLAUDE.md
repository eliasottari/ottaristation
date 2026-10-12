# Studio vidéo « Pourquoi c'est horrible de… » (cartoon 2D généré par code)

Ce dépôt fabrique des vidéos animées (SVG → frames → MP4) calées mot à mot sur une voix off.
**Dès que l'utilisateur envoie un fichier audio (mp3/wav) : utiliser la skill `video-pourquoi`** (`.claude/skills/video-pourquoi/SKILL.md`)
et la suivre de bout en bout, sans poser de questions : préparation → plans → planches → rendu → livraison.
Répondre en français, ton direct et concis.

## Règles client (résumé — détail dans la skill)
- Cartoon flat, contours `#2b2420`, têtes rondes, joues roses ; style V2 ciné : fausse 3D, caméra épaule, crash zooms, réactions extrêmes.
- Chaque action et chaque bruitage calés sur le mot prononcé (`at(n,'mot')`), jamais sur les temps d'un découpage fourni.
- 9:16 : visages/textes entre y 380 et 1150, rien d'important sous y 1250 (sous-titres du client). Pas de sous-titres incrustés.
- Titre d'accroche 3 lignes en haut du plan 1, dernier mot en couleur, loin des bords.
- 3–5 bruitages synthétisés par plan ; pas de musique sur les Shorts.
- Livraison : MP4 1080p ; si > 30 Mo, découpé en `partie_1, partie_2…` (`tools/deliver.sh`).

## Arborescence
- `engine/` moteur (lib.js persos/primitives, cine.js fausse 3D, player.js caméra, sfx.py bruitages+mix, render.mjs, snap.mjs, check.mjs, thèmes bugs/sea/hair/teeth.js)
- `template/` squelette d'épisode · `tools/` setup.sh, new_episode.sh, prep.py, deliver.sh
- `exemple_dents/`, `exemple_hyperactif/`, `exemple_calvitie/` : épisodes de référence complets (lire `exemple_dents/scenes.js` avant d'écrire)

## Épisodes faits
| Dossier | Épisode | Durée | Statut |
|---|---|---|---|
