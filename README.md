# Web app to enable musicians to record their parts for a virtual ensemble/choir/orchestra.  Based on Simple WebAudioRecorder.js demo
# Appli web pour permettre à des musiciens possédant peu de connaissances techniques d'enregistrer leurs parties pour un ensemble virtuel.   
Based on [WebAudioRecorder.js](https://github.com/higuma/web-audio-recorder-js) and [https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/](https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/) and this demo [https://addpipe.com/simple-web-audio-recorder-demo/](https://addpipe.com/simple-web-audio-recorder-demo/)

Tool for conductors and choir masters to have members of their ensembles record their parts from home in order to create a virtual choir/orchestra.  The user just has to press record and the backing track starts at the same time as the recording meaning the parts are all in sync, little technical knowledge needed as the "app" is loaded from a web page.  The goal is for the system to work on very basic devices like smartphones.  I would appreciate any help as I am very inexperienced with web development.

The choir/orchestra director adds the URL of the sound file they wish to use to the URL of the overdub web page in the following manner:  https://preidorg.github.io/overdub/?playback=https://example.com/sound.mp3 where https://example.com/sound.mp3 is the URL of the sound file.  They then share this link with their musicians who then follow the link, practice with the backing track, record themselves, download the recording, then send the recording to the director.  

Try here: Démo ici: [https://preidorg.github.io/overdub/?playback=https://preidorg.github.io/overdub/son/sound1.mp3](https://preidorg.github.io/overdub/?playback=https://preidorg.github.io/overdub/son/sound1.mp3)


To do :
I have modified this to do list as I found a different way of integrating backing track files that I hadn't initially thought of via the "?playback=" URL parameter
1. Work out how to disable client side signal processing of the sound.  When used on a mobile, the echo cancellation and noise reduction create undesirable artifacts for the intended use in musical production.  This issue is ongoing and I don't yet see a way of resolving it.
2. Test if the synchronisation is good between the backing track and the recording and if not, use a more accurate timing system.
3. Create a system so that the sound is automatically uploaded to a server.  This could be via php, dropbox, owncloud or something similar.


# en français
Dans le contexte du confinement qui nous touche actuellement à cause du COVID-19 je souhaitais pouvoir réaliser un orchestre ou choeur virtuel.  Les techniques employées par les choeurs comme celui de Eric Whitacre nécessite de débrancher son micro, démarrer une vidéo guide-chant, de faire entendre le bip sonore dans le micro, de remettre son casque et ensuite de chanter.   Je cherchais donc une application simple permettant aux musiciens de s'enregistrer en écoutant simultanément une piste guide pour éviter des problèmes de synchronisation ou de devoir faire de longues explications pour utiliser des outils d'enregistrement.  N'ayant pas trouvé une telle application, je me suis lancé avec mes connaissances limitées en programmation dans le développement d'overdub. L'outil qui n'est pas encore au point, mais la fonctionnalité de base est présente.   

## Utilisation :
La/le chef d'orchestre/chef de choeur modifie l'URL de la page overdub en y ajoutant l'URL du son à utiliser comme playback de la manière suivante : https://preidorg.github.io/overdub/?playback=https://example.com/sound.mp3 où https://example.com/sound.mp3 correspond à l'URL du playback. On partage ensuite cette URL avec les musiciens qui s'y rendent, s'entrainent avec le playback, s'enregistrent avec le playback, téléchargent le son résultant et l'envoient à la/au chef.

Démo ici: [https://preidorg.github.io/overdub/?playback=https://preidorg.github.io/overdub/son/sound1.mp3](https://preidorg.github.io/overdub/?playback=https://preidorg.github.io/overdub/son/sound1.mp3)

Ce qu'il reste à faire :
J'ai modifié cette liste puisque j'ai trouvé une autre façon d'intégrer les sons mp3 qui ne nécessite pas que les fichiers soient stockés sur le même serveur. 
1. Trouver le moyen de désactiver les effets de type réduction de bruit, annulation d'écho, etc, pour pouvoir récupérer un son propre comme à l'entrée du micro. 
2. Etablir si les enregistrements et le playback sont bien synchronisés et si ce n'est pas le cas, employer les outils de synchronisation plus précises.  
3. Faire en sorte que le son puisse être envoyé directement au serveur/dropbox/owncloud sans que l'utilisateur soit obligé de le télécharger avant.



