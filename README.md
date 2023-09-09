# Lápiz Corto - Spanish Proverb Recorder

**Lápiz Corto** is a web application designed to help you record and organize Spanish proverbs without duplicates. Inspired by the saying "Vale más lápiz corto que memoria larga," this app is your digital notebook for collecting and preserving popular wisdom.

## Features

- Record and store Spanish proverbs.
- Avoid duplicate entries with intelligent search.
- Connect with MongoDB Atlas Search for efficient searching.
- Simple and user-friendly interface.

## Technologies Used

- **Next.js**: A powerful and flexible React framework for building web applications.
- **MongoDB**: A document-based, distributed database for data storage.
- **MongoDB Atlas**: Cloud-based database hosting for scalability and reliability.

## Getting Started

1. Clone this repository.

2. Set up a MongoDB database, either locally or using MongoDB Atlas.

3. Create a `.env.local` and add your MongoDB connection string as `MONGODB_URI`.

4. Install dependencies:

   ```bash
   npm install
   ```

5. Run the app in development mode:

   ```bash
   npm run dev
   ```

6. Your app will be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

1. Start recording Spanish proverbs using the app.

2. The app will intelligently search for similar proverbs to avoid duplicates.

3. Easily manage and organize your collection of proverbs.

## Deployment

You can deploy this app to the cloud with [Vercel](https://vercel.com) or your preferred hosting service.

## Contributions

Contributions to this project are welcome! Feel free to submit issues, suggest improvements, or send pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
