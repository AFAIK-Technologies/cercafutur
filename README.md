# cercafutur
CercaFutur és una aplicació per a mòbils; un cercador d'escoles i instituts amb filtres avançats, un mapa i compte 
d'usuari. Creat amb Vue i Ionic Framework.


# Ús
## Android
Descarrega't l'APK de l'última versió estable des de [la nostra web]([url](https://sites.google.com/insernestlluch.cat/afaik/distribuci%C3%B3-app/descarregat-lapp)).

Pots descarregar-te versions més antigues des de la secció Releases. Tingues en compte la retrocompatibilitat.

## iOS
Ho sentim, usuaris d'iPhone&mdash;no tenim plans per llançar CercaFutur a l'App Store a causa de l'alt cost anual. És possible que això canviï en un futur, una mica llunyà.

# Desenvolupament
## Requeriments
- **Git**
- **Node.js**
- **Android Studio**

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
3. Assignar variables d'entorn.

Copia el fitxer `.env.example` a `.env` i edita aquest nou fitxer. Estableix tots els valors per configurar el Firebase.

Pots fer-ho des de la terminal amb les següents comandes:
```shell
cp .env.example .env
nano .env # Només a macOS / Linux
```

4. Iniciar servidor de Vite.
```shell
ionic serve
```
5. Obrir el projecte a Android Studio.
```shell
ionic capacitor copy android
ionic capacitor open android
```
6. Iniciar el projecte des d'Android Studio clicant el botó d'executar.