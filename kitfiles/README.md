# Kit « Vidéo Pourquoi » — de ta voix off à un dessin animé prêt à poster

Tu envoies un **fichier audio**, Claude sort un **MP4 1080p** :
- un dessin animé 2D cartoon ;
- 30 à 40 plans, chaque gag et chaque bruitage calé au mot près ;
- un titre d'accroche ;
- format 9:16 (Shorts/TikTok/Reels) ou 16:9 (YouTube).

## Installation (5 min, une seule fois)
1. Crée un dépôt GitHub (privé) avec le contenu de ce dossier.
2. Ouvre-le dans **Claude Code**. Ça marche aussi en version web/cloud (claude.ai/code) et en terminal.
3. Premier message : « lance `bash tools/setup.sh` ». Ce script installe ffmpeg, Python, la transcription et Chromium.

## Utilisation
Envoie ton audio avec une phrase du genre :
> Nouvel épisode : « Pourquoi c'est horrible de naître gaucher ? » — voici la voix. 9:16.

Optionnel : colle aussi ton texte ou ton découpage en blocs (B001, B002…) avec les angles caméra voulus.

Claude suit alors la skill `video-pourquoi`, sans rien te demander :
1. il transcrit et cale ta voix ;
2. il écrit les plans ;
3. il vérifie le cadrage sur des planches contact ;
4. il fait le rendu ;
5. il t'envoie le MP4 (en parties si > 30 Mo).

Pour une retouche, il suffit de demander : « le plan du bus, mets le contrôleur plus énervé », « bruitages plus forts »…

## Bon à savoir
- Laisse la zone basse de l'image (≈ 65–90 % de la hauteur) pour tes sous-titres : le kit n'y met jamais rien d'important.
- La durée idéale est de 45 à 75 s pour un Short. Le format long 16:9 marche aussi, avec un rendu plus long.
- Les dossiers `exemple_*` contiennent des épisodes complets qui servent de modèle à Claude.
