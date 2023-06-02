# cercafutur
CercaFutur és una aplicació per a mòbils; un cercador d'escoles i instituts amb filtres avançats, un mapa i compte 
d'usuari. Creat amb Vue i Ionic Framework.

# Requeriments
- Git
- Node.js
- Android Studio

També hauràs de reemplaçar el contingut de [firestore.ts](src/firestore.ts) amb el codi que Firebase et proporciona, indicant la clau de l'API.

# Ús
## Android
Descarrega't l'APK de l'última versió estable des de [la nostra web]([url](https://sites.google.com/insernestlluch.cat/afaik/distribuci%C3%B3-app/descarregat-lapp)).

Pots descarregar-te versions més antigues des de la secció Releases. Tingues en compte la retrocompatibilitat.

## iOS
Ho sentim, usuaris d'iPhone&mdash;no tenim plans per llançar CercaFutur a l'App Store degut a l'alt cost anual. És possible que això canviï en un futur, una mica llunyà.

# Desenvolupament
## Instal·lació
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
