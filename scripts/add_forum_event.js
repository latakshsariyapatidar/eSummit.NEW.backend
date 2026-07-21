const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Event } = require('../src/modules/content/content.model.js');

dotenv.config();

const forumEvent = {
  slug: 'the-forum',
  name: 'GROUP DISCUSSION',
  tagline: "The floor is open. So is the verdict. Speak freely — it'll be quoted back to you. Everyone gets a turn to talk. Not everyone gets remembered for it. Hold the room, or become the story someone else tells.",
  about: `Anyone can talk. Almost no one can hold the room.\n\nThe Forum is where sharp minds meet sharper stakes — a fast-paced arena of open debate where poise is currency and silence is a losing move. Round one throws you onto the floor alone: no script, no notes, just you against the clock and a room full of people waiting for you to slip. Round two changes the game entirely — you're paired with a stranger, handed a business nobody asked for, and made to sell it, fund it, and defend it as the ground shifts beneath your feet.\n\nYou won't just make a point. You'll build an empire out of one, then watch us set it on fire. Budgets buckle. Prices triple. A scandal goes viral mid-sentence. From measured discourse to full-blown damage control, every station is engineered to break the plan you walked in with.\n\nFrom boardroom polish to grace under fire, this is debate with the gloves off. Speak well, think faster, and stay composed when the floor turns against you — because in a room this sharp, the most dangerous voice is the one that never loses its cool.`,
  day: 'TBD',
  time: 'TBD',
  brief: 'A fast-paced arena of open debate where poise is currency.',
  format: [
    'Round 1: Solo debate against the clock.',
    'Round 2: Paired with a stranger to sell and defend a random business.'
  ]
};

const addEvent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');
    
    await Event.findOneAndUpdate(
      { slug: forumEvent.slug },
      { $set: forumEvent },
      { upsert: true, new: true }
    );
    
    console.log('Successfully added/updated THE FORUM event.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding event:', error);
    process.exit(1);
  }
};

addEvent();
