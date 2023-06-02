# cercafutur

CercaFutur és una aplicació per a mòbils; un cercador d'escoles i instituts amb filtres avançats, un mapa i compte
d'usuari. Creat amb Vue i Ionic Framework.

# Requeriments

- Git
- Node.js
- Android Studio

## Configuració de Firebase

A més, hauràs d'afegir el fitxer `firestore.json` dins la carpeta [`src`](src) importat a
[firestore.ts](src/firestore.ts) perquè funcioni Firebase. El seu contingut ha de ser l'objecte de configuració que 
es pot obtenir des de la configuració del projecte. Té aquest aspecte:
```json
{
	"apiKey": "",
	"authDomain": "",
	"projectId": "",
	"storageBucket": "",
	"messagingSenderId": "",
	"appId": ""
}
```

# Instal·lació

1. Clonar repositori.

```shell
git clone https://github.com/AFAIK-Technologies/cercafutur.git
```

2. Instal·lar dependències.

```shell
cd cercafutur
npm i
```

3. Iniciar servidor de Vite.

```shell
ionic serve
```

4. Obrir el projecte a Android Studio.

```shell
ionic capacitor copy android
ionic capacitor open android
```

5. Iniciar el projecte des d'Android Studio clicant el botó d'executar.
