# PASSATION — fabriquer les vidéos « Pourquoi c'est horrible de… ? »

Ce document est pour toi, l'agent Claude qui reprend ce dépôt (eliasottari/ottaristation). Il contient toute la méthode, à appliquer à la lettre.
Réponds à l'utilisateur en français, de façon directe et concise. Il a peu de crédits de session : avance, et ne lui pose pas d'autres questions que le QCM.

## 0. AVANT TOUT : le QCM (outil AskUserQuestion, en un seul appel)
À chaque nouvelle demande de vidéo, pose ces 4 questions, puis applique ses réponses :
1. **Voix** : « Tu me fournis le fichier voix (mp3/wav) ? » → Oui, je l'envoie / Non, génère-la sur ElevenLabs depuis mon script (voix Tenko, modèle v4).
2. **Montage voix** : « Je coupe les silences (phrases bord à bord, style TikTok) ? » → Oui (recommandé) / Non.
3. **Volume** : « Je monte la voix de +10 dB ? » → Oui (recommandé) / Non.
4. **Format** : « Quel format ? » → 9:16 Shorts, style SIZEX fun (recommandé) / 16:9 YouTube long (voir tortue/).
Les réponses recommandées sont celles qu'il valide depuis 30 épisodes. S'il envoie plusieurs scripts ou voix d'un coup, fais les vidéos UNE PAR UNE, dans l'ordre, et envoie chaque vidéo dès qu'elle est prête.

## 1. Ce qu'on livre
- Un dessin animé 2D cartoon généré par code (SVG → images → MP4), en 1080p, à 30 images/s.
- Chaque gag et chaque bruitage tombe sur le mot prononcé.
- Livraison découpée en `partie_1.mp4`, `partie_2.mp4`… de moins de 30 Mo chacune (limite d'envoi). L'utilisateur les recolle dans CapCut et veut la qualité maximale, pas de version compressée.
- Pas de sous-titres incrustés : il ajoute les siens en bas de l'image.

## 2. Lire d'abord
- `CLAUDE.md` : règles client et tableau des épisodes faits.
- `.claude/skills/video-pourquoi/SKILL.md` : la recette complète du format SIZEX fun. C'est la référence.
- Un épisode récent en entier comme modèle : `kevin/scenes.js` (ou `loin/`, `nouveau/`).

## 3. Pipeline (commandes réelles)
```bash
# A. Voix générée (si l'utilisateur fournit seulement le script)
#    Le script va dans <ep>/assets/script.txt, une phrase par ligne.
#    La clé ElevenLabs est dans engine/.env (gitignoré). Si le fichier n'existe pas, demande la clé.
#    Ne jamais écrire la clé ailleurs ni la committer.
#    Crédits : environ 1 400 caractères par vidéo. Vérifie le solde avec GET /v1/user/subscription.
python3 tools/tts.py <ep>/assets/script.txt /tmp/<ep>_tts.mp3

# B. Préparation en une seule commande : template, silences coupés, transcription whisper,
#    blocs, calage, voix +10 dB, contrôle des phrases ratées.
tools/new_episode.sh <ep> /tmp/<ep>_tts.mp3        # ou le fichier voix fourni
#    Si l'utilisateur a refusé la coupe des silences ou le +10 dB, refais ces étapes à la main
#    (voir le contenu du script).
#    Si on a le script, blocks.txt = lignes du script. Utilise Python, PAS sed : sed abîme les accents.
cd <ep>
python3 -c "import re;L=[re.sub(r'[«»]','',l).strip() for l in open('assets/script.txt',encoding='utf-8') if l.strip()];open('assets/blocks.txt','w',encoding='utf-8').write('\n'.join(L)+'\n')"
#    Fusionne avec un voisin les blocs de moins de 0,5 s (« Toi ? », « AH. »),
#    coupe un bloc de plus de 4 s s'il contient 2 idées, puis recalcule le calage :
python3 ../tools/prep.py --realign
#    Si gaps.py signale un trou (phrase ratée par whisper) :
#    python3 ../tools/gaps.py --fix, ajoute la phrase dans blocks.txt, puis --realign.

# C. Écrire scenes.js (le cœur du travail), voir la section 4.

# D. Vérifier
node ../engine/check.mjs          # doit finir par [nPlans, [], nCues] sans « mot introuvable »
GUIDE=1 node ../engine/snap.mjs /tmp/<ep>_1.png B1:.85 B2:.8 B3:.7 …   # 12 plans par planche
#    Lis chaque PNG et corrige jusqu'à ce que tout soit propre.

# E. Rendu et livraison en une commande (3 à 5 min)
../tools/finish.sh <ep>           # check → rendu → niveau audio → planche finale → parties
#    Puis envoie out/partie_*.mp4 (SendUserFile), commit + push sur la branche de travail,
#    et ajoute une ligne au tableau de CLAUDE.md.
```
Pour gagner du temps, délègue l'écriture de scenes.js à un sous-agent pendant que l'épisode précédent se rend. Fais un seul rendu à la fois : deux rendus en parallèle saturent la machine.

## 4. Structure de scenes.js (format SIZEX fun)
- En-tête : copie celle du template avec `B(n, {...}, offset)`, `at(n,'mot',k)` et `dur(n)`. `TOTAL` et `BT` viennent de timing.js.
- `sxFun('#accent')` : choisis un accent propre à l'épisode. La police est Fredoka gras.
- **Plans 1 à 3 : intro motion.**
  - Fond `gridBg` + `halftoneFade` ou `paper` + `gobo`, héros en `cutout()`.
  - Titre en 3 lignes : `kthin` à y 330 (taille 62), `kthin` à y 415 (taille 58), `kword` du mot-clé à y 540 (taille 66 à 80, en jaune `SX.acc2`).
  - Effet « débloqué » en ÉTOILES sur le mot-clé : `unlock(..,{part:'back'})` avant le perso, `unlock(..,{part:'front'})` après. On le réutilise 2 ou 3 fois dans l'épisode, pas plus.
- **Ensuite : vrais décors RICHES**, avec 15 à 30 éléments, 3 couches `depth()` et des éléments animés.
  - `engine/decor.js` en fournit : streetT, schoolyard, classroomT, hallway, bedroomN, salonF, partyT, restoT, SKY, kidsBg, plus les accessoires d*.
  - Ne redéclare JAMAIS ces noms en const/let : ça fait une erreur JS. Préfixe tes propres fonctions.
- **Couche motion par-dessus** : funTag, funBox, burst, blob, popStars, kword, kthin, marker*, card.
  - Interdits : `rings`, `selBox`, `pill`.
  - Une transition motion (`trans`) environ 1 plan sur 3, en alternance avec les entrées cartoon : crash, whip, drop, flash.
- **Cartoon extrême** : expressions EXPR fortes, gags pris au pied de la lettre, caméra épaule, zooms.
  - Les phrases en CAPITALES du script = cris : `kword` en slam, flash et tremblement.
- **Héros** : il porte le sujet visuellement (ex. auréole, cernes, chasuble), via `hairFn` ou un overlay sur `head()`. Kevin est le personnage récurrent : `kevin()`.
- **Cadrage 9:16** : visages et textes entre y 380 et 1150 (sur 1920). Sous y 1250, décor seulement : c'est la zone de ses sous-titres.
- **Bruitages** : 3 à 5 par plan, chacun placé avec `at()`, synthétisés uniquement, pas de musique. La liste des noms est dans SKILL.md.
- **LISIBILITÉ** : jamais de texte foncé avec un contour foncé. Le moteur met déjà un contour blanc autour d'un texte foncé ; préfère des textes clairs.
- **Sujets sensibles** : ton bienveillant, on rit des situations et des autres personnages, jamais de la personne concernée. Rien de gore.
- **Fin** : la dernière phrase en gros, plus un dernier gag.

## 5. Pièges connus
- Whisper écrit certains mots autrement (« 3h », « Kévin », « sel » pour « self ») : `at()` doit utiliser le mot TEL QU'IL est écrit dans words.js.
- Si un rendu plante avec un « Timeout », la machine est surchargée : relance `finish.sh`.
- Une fois le rendu fini, ne committe que le MP4 complet (out/<ep>_9x16.mp4). out/tmp et partie_* sont dans le .gitignore.
- Le hook de fin exige un dépôt propre : commit + push après chaque étape.
- Si une limite de session coupe un sous-agent, relance-le avec SendMessage plutôt qu'en créant un nouvel agent. L'utilisateur peut demander un réveil automatique (send_later) à l'heure de reset.
