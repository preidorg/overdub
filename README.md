# Web app to enable musicians to record their parts for a virtual ensemble/choir/orchestra.  Based on Simple WebAudioRecorder.js demo
# Appli web pour permettre à des musiciens possèdant peu de connaissances techniques d'enregistrer leurs parties pour un ensemble virtuel.   
Based on [WebAudioRecorder.js](https://github.com/higuma/web-audio-recorder-js) and [https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/](https://blog.addpipe.com/using-webaudiorecorder-js-to-record-audio-on-your-website/) and this demo [https://addpipe.com/simple-web-audio-recorder-demo/](https://addpipe.com/simple-web-audio-recorder-demo/)

Tool for conductors and choir masters to have members of their ensembles record their parts from home in order to create a virtual choir/orchestra.  The user just has to press record and the backing track starts at the same time as the recording meaning the parts are all in sync, little technical knowledge needed as the "app" is loaded from a web page.  The goal is for the system to work on very basic devices like smartphones.  I would apprectiate any help as I am very inexperienced with web development.

To do :
1. Work out how to disable client side signal processing of the sound.  When used on a mobile, the echo cancellation and noise reduction create undesirable artifacts for the intended use in musical production.
2. Create a menu of sounds that automatically propogates with sound files from a folder onn the server so that the user can choose which backing sounds to record over.
3. Create a system so that the sound is automatically uploaded to a server.  This could be via php, dropbox, owncloud or something similar.
4. Make this tool easy to install for the project manager.


Dans le contexte du confinement qui nous touche actuellement à cause du COVID-19 je souhaitais pouvoir réaliser un orchestre ou choeur virtuel.  Les techniques employées par les choeurs comme celui de Eric Whitacre nécessite de débrancher son micro, démarrer une vidéo guide-chant, de faire entendre le bip sonore dans le micro, de remettre son casque et ensuite de chanter.   Je cherchais donc une application simple permettant aux musiciens de s'enregistrer en écoutant simultanément une piste guide pour éviter des problèmes de synchronisation et de devoir faire de longues expications.  N'ayant pas trouvé un tel application, je me suis lancé avec mes peu de connaissances en programmation dans le développement d'overdub. L'outil qui n'est pas encore à point mais la fonctionalité de base est présente.   

Ce qu'il reste à faire :
1. Trouver le moyen de désactiver les effets de type réduction de bruit, annulation d'écho etc, pour pouvoir récupérer un sonn propre comme à l'entrée du micro. 
2. Créer un menu pour qu l'utilisateur sélectionne la piste à travailler.
3. Faire en sorte que le son puisse être envoyé directement au serveur/dropbox/owncloud sans que l'utilisateur soit obligé de le télécharger avant.
4. Rendre l'outil facile à installer sur un serveur.  



Try here: [https://preidorg.github.io/overdub/](https://preidorg.github.io/overdub/)

