# Professional Minimalist Portfolio Website

A simple, elegant, responsive, and lightweight portfolio website template. Built using semantic HTML5, modern CSS3, vanilla ES6 JavaScript, and Firebase (Firestore + Hosting).

---

## Folder Structure

```text
portfolio/
│
├── index.html          # Main HTML structure, sections, SEO meta tags
├── css/
│   └── style.css       # Unified stylesheet with design system and variables
├── js/
│   ├── app.js          # App interactive logic (menu, validation, scroll effects)
│   └── firebase.js     # Firebase Modular SDK initialization & Firestore form submission
├── assets/
│   ├── images/         # Project screenshots and avatar profile photo
│   ├── icons/          # Custom SVG/PNG/web icon files
│   └── resume.pdf      # Downloadable resume document
├── favicon.ico         # Browser tab icon
├── firebase.json       # Firebase Hosting config file
├── .firebaserc         # Firebase project associations config file
└── README.md           # Setup, customization, and deployment instructions
```

---

## Features

* **Glassmorphism Navbar**: Sticky header with frosted-glass effect and responsive active link indicators.
* **Mobile Drawer Menu**: Fully accessible slide-in navigation drawer for mobile and tablet touch screen profiles.
* **Intersection Observer Animations**: Scroll-based slide-in animations (Scroll Reveal) that only run once elements enter the viewport.
* **Interactive Coding SVG**: High-fidelity developer coding vector illustration responsive to all screen sizes.
* **Client-Side Form Validation**: Real-time validation checks for blank fields, correct email syntax, and live character limits (max 1000) on message textarea.
* **Firestore Integration**: Contact form submissions are dispatched directly to the Firebase database with automatic server timestamps.
* **Graceful Mock Submissions**: Local simulation mode triggers automatically if placeholder config is detected in `js/firebase.js`—enabling swift offline development.
* **Custom Toast Notification System**: Animated, non-intrusive notification banners displaying submit statuses.
* **Accessibility Focused**: Compliant semantic tags (`<header>`, `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`), keyboard tab index support, skip-to-content links, visible focus outline borders, and proper aria-attributes.
* **SEO Optimized**: Pre-configured with meta keywords, description, canonical tags, Open Graph (OG), and Twitter Cards configurations.

---

## Technologies Used

* **Structure**: HTML5 (Semantic elements)
* **Styling**: CSS3 Custom Properties (Variables, Flexbox, CSS Grid)
* **Logic**: Vanilla JavaScript (ES6 Modules)
* **Backend Database**: Firebase Firestore (Modular SDK v10)
* **Hosting**: Firebase Hosting

---

## Installation & Local Development

1. **Clone or copy** the portfolio files to your local workstation.
2. Launch a local web server from the project directory. For example, using python or Node.js:
   ```bash
   # Option A: Python 3
   python -m http.server 8000
   
   # Option B: Node.js (serve packages)
   npx serve .
   ```
3. Open your browser and navigate to the address shown (usually `http://localhost:8000` or `http://localhost:3000`).

---

## Firebase Setup Guide

Follow these steps to link the contact form to your own database and host your site on Firebase:

### Step 1: Create a Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts to register a project.

### Step 2: Set Up Firestore Database
1. Inside your Firebase project dashboard, click on **Build > Firestore Database** in the left sidebar.
2. Click **Create database**.
3. Select your location, then choose **Start in production mode** or **Start in test mode**.
4. In the **Rules** tab, adjust your security rules to allow contact submissions. A recommended rule that allows anyone to create a document but prevents editing/deleting:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /contacts/{document} {
         allow create: if true; // Anyone can submit a message
         allow read, update, delete: if false; // Safeguard database from unauthorized inspection/edits
       }
     }
   }
   ```

### Step 3: Link Firebase to Website
1. In the Project Overview page, click the **Web icon (`</>`)** to add an app.
2. Register the app (e.g., "Portfolio Website") and optionally select Firebase Hosting.
3. Locate the `firebaseConfig` object inside the setup code provided. It will look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
4. Open [js/firebase.js](file:///d:/project%201/js/firebase.js) in your text editor.
5. Replace the placeholder config object with your actual keys. Once configured, submissions will write to your live Firestore database instead of simulating locally.

---

## Deployment to Firebase Hosting

Ensure you have the Firebase CLI installed on your machine. If not, install it via NPM:
```bash
npm install -g firebase-tools
```

1. **Log in to Firebase**:
   ```bash
   firebase login
   ```
2. **Associate your Local Project**:
   Open [.firebaserc](file:///d:/project%201/.firebaserc) and replace `your-firebase-project-id` with your actual Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-actual-project-id"
     }
   }
   ```
   *Alternative*: Run `firebase use --add` and select your project.
3. **Deploy the Site**:
   Run the following deployment command from the project root directory:
   ```bash
   firebase deploy --only hosting
   ```
4. Once completed, the terminal will print your **Hosting URL** (e.g., `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`).

---

## Customization Guide

### Personal Information & Projects
All text information, bio descriptions, education items, and project highlights can be edited directly inside [index.html](file:///d:/project%201/index.html).
* Search for `Your Name` to customize your name.
* Replace the contents of the `projects-grid` with your own project list.

### Styling & Theme Colors
You can change the look of the portfolio instantly by updating the CSS variables defined at the top of [css/style.css](file:///d:/project%201/css/style.css#L22-L35).
For example, to change the primary blue theme to emerald green, edit the variables:
```css
:root {
    --color-primary: #10B981;        /* Emerald-500 */
    --color-primary-hover: #047857;  /* Emerald-700 */
    --color-accent: #34D399;         /* Emerald-400 */
    --color-accent-light: #ECFDF5;   /* Emerald-50 */
}
```

### Profile Avatar & Resume
* **Resume**: Save your new resume PDF under `assets/resume.pdf` (overwriting the placeholder file).
* **Avatar**: Update the `<svg class="avatar-svg">` placeholder inside the About Me section of `index.html` with an `<img>` tag pointing to your real profile photo, e.g.:
  ```html
  <img src="assets/images/profile.jpg" alt="Your Name profile photo" class="avatar-img">
  ```
  And add CSS stylings for `.avatar-img` to match the border radius and box shadow.
