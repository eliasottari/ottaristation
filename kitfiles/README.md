# Kit « Vidéo Pourquoi » — ta voix off devient un dessin animé prêt à poster

Tu envoies **un fichier audio** et Claude te rend **un MP4 1080p vertical**, prêt pour Shorts, TikTok ou Reels :
- **un dessin animé cartoon** avec une couche de motion design fun (police Fredoka, étiquettes rebondies, étoiles, explosions BD) ;
- **de vrais décors détaillés** : rue, école, chambre, soirée, resto…
- **35 à 45 plans**, avec chaque gag et chaque bruitage calés au mot près sur ta voix ;
- **un titre d'accroche** animé au premier plan ;
- **ta voix resserrée et boostée** : silences supprimés, +10 dB, phrases enchaînées à la TikTok ;
- **une zone basse laissée libre** pour tes propres sous-titres.

## Installation (5 min, une seule fois)
1. Crée un dépôt GitHub privé et mets-y le contenu de ce dossier.
2. Ouvre-le dans **Claude Code** : web/cloud (claude.ai/code), app desktop ou terminal.
3. Premier message : « lance `bash tools/setup.sh` ». Le script installe ffmpeg, la transcription et Chromium.

## Utilisation
Envoie ton audio avec une phrase du genre :
> Nouvel épisode : « Pourquoi c'est horrible d'être le mec trop gentil ? » — voici la voix.

Optionnel : colle aussi ton texte, pour que les mots mal entendus soient corrigés.

Claude suit alors la skill `video-pourquoi`, sans rien te demander :
1. il resserre et cale la voix ;
2. il écrit les plans ;
3. il vérifie le cadrage sur des planches contact ;
4. il fait le rendu ;
5. il t'envoie la vidéo en `partie_1`, `partie_2`… (moins de 30 Mo chacune), à recoller dans CapCut.

Pour retoucher, il suffit de demander : « le plan du resto, mets Kevin plus énervé », « bruitages plus forts », « change la couleur d'accent »…

## Bon à savoir
- La durée idéale va de 45 à 75 s. Le rendu d'une vidéo de 70 s prend ~3 min, et une vidéo complète se fabrique en 20 à 40 min environ.
- Les dossiers `exemple_*` sont des épisodes complets qui servent de modèle à Claude, sans les voix : n'y touche pas.
