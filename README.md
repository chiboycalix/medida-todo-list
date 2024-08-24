# Local Setup Instructions

Follow the instruction provided below to set up and run the Todo List project on your local machine:

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/chiboycalix/medida-todo-list.git
cd medida-todo-list
```

## Step 2: Install all Dependencies

```bash
npm install
```

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your actual Firebase configuration after creting the project on Firebase console.

Also, create both a Realtime Database and a Firestore Database in your firebase console.

The Realtime database will store the extra information (like `name` for our application), provided by a user while registering using the Email/Password Provider.

Firestore Database will store the rest of the collections we create for our project

# Setting Up Firestore Indexes

You also need to set up composite indexes in Firestore for optimal performance and to support complex queries. Follow these steps:

1. **Access Firebase Console:**
   - Go to https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Indexes:**
   - In the left sidebar, click on "Firestore Database"
   - Select the "Indexes" tab

3. **Create Composite Index:**
   - Click on "Add Index"
   - For "Collection ID", enter `todos`
   - Under "Fields to index", add the following fields in this order:
     1. `userId` (Ascending)
     2. `dueDate` (Ascending)
     3. `priority` (Descending)
     4. `createdAt` (Descending)
   - Click "Create index"

4. **Wait for Index to Build:**
   - It may take a few minutes for the index to finish building
   - You'll see a blue icon next to the index while it's building
   - A green icon indicates the index is complete and ready to use

Note: If you modify your queries in the future, you may need to create additional indexes to support them.

Proper indexing is crucial for Firestore performance, especially as dataset grows. Always ensure your frequently used queries are properly indexed.


## Step 4: Run the Development Server

```bash
npm run dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Step 5: Build for Production (Optional)

If you want to create a production build:

```bash
npm run build
npm start
```

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are correctly set.
2. Check if you're using the correct Node.js version.
3. Clear your browser cache or try in an incognito window.