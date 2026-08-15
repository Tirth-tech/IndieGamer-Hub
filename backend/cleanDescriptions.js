import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Game from './models/Game.js';
import { stripHtml } from './controllers/gameController.js';

dotenv.config();

const cleanAllGames = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('No MONGODB_URI found, skipping database clean.');
      process.exit(0);
    }

    console.log('Connecting to MongoDB to clean game descriptions...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected!');

    const games = await Game.find({});
    let cleanedCount = 0;

    for (const game of games) {
      const cleanDesc = stripHtml(game.description || '');
      const cleanShort = stripHtml(game.shortDescription || game.description || '');

      if (game.description !== cleanDesc || game.shortDescription !== cleanShort) {
        game.description = cleanDesc;
        game.shortDescription = cleanShort;
        await game.save();
        cleanedCount++;
        console.log(`Cleaned HTML from game: "${game.title}"`);
      }
    }

    console.log(`✅ Successfully cleaned HTML tags from ${cleanedCount} games in MongoDB!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning game descriptions:', err);
    process.exit(1);
  }
};

cleanAllGames();
