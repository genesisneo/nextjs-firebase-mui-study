# nextjs-firebase-materialui-study

This is a simple set up for Firebase for client side applications.

The firebase app is initialized in `firebase/clientApp.js`, to use you just have to import it anywhere in the app

The React Context API is used to provide user state.

### Configuration

- [Create a Firebase project](https://console.firebase.google.com/u/0/) and add a new app to it.

- 🔑 Firebase Authentication

<img src="./public/firebase/firebase-01.jpg">

- 👨 Firebase Databse (`users`)

<img src="./public/firebase/firebase-02.jpg">

- 📄 Firebase Database (`database`)

<img src="./public/firebase/firebase-03.jpg">

- ⚙️ Firebase Database Rules

<img src="./public/firebase/firebase-04.jpg">

- Create a `.env` file and copy the contents of `.env.example` into it.

```bash
cp .env.example .env
```

- Set each variable on `.env` with your Firebase Configuration (found in "Project settings").

- Install it and run the application

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

### Notes:

If you will use [Vercel](https://vercel.com/), keys will be coming from Vercel Secret keys.

```
"@firebase-api-key"
"@firebase-auth-domain"
"@firebase-database-url"
"@firebase-project-id"
"@firebase-storage-bucket"
"@firebase-messaging-sender-id"
"@firebase-app-id"
```