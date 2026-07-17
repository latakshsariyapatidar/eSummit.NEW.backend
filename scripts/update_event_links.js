const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const EventSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  registrationLink: { type: String },
});

const Event = mongoose.model('Event', EventSchema, 'events');

const links = [
  { slug: 'bid-a-biz', link: 'https://unstop.com/competitions/bid-a-biz-e-summit-26-indian-institute-of-technology-iit-dharwad-1709069' },
  { slug: 'e-mun', link: 'https://unstop.com/competitions/e-mun-20-e-summit-26-indian-institute-of-technology-iit-dharwad-1709086' },
  { slug: 'technostrophe', link: 'https://unstop.com/quiz/technostrophe-26-e-summit-26-indian-institute-of-technology-iit-dharwad-1709090' },
  { slug: 'the-forum', link: 'https://unstop.com/competitions/the-forum-a-group-discussion-event-indian-institute-of-technology-iit-dharwad-1709541' },
  { slug: 'boardroom-battles', link: 'https://unstop.com/competitions/boardroom-battles-20-indian-institute-of-technology-iit-dharwad-1709531' },
  { slug: 'find-the-bug', link: 'https://unstop.com/competitions/find-the-bug-e-summit-26-indian-institute-of-technology-iit-dharwad-1706303' },
  { slug: 'innovex', link: 'https://unstop.com/competitions/inovex-30-e-summit-26-indian-institute-of-technology-iit-dharwad-1709073' },
];

async function updateLinks() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const item of links) {
    const res = await Event.updateOne({ slug: item.slug }, { $set: { registrationLink: item.link } });
    console.log(`Updated ${item.slug}: matched ${res.matchedCount}, modified ${res.modifiedCount}`);
  }
  console.log('Done updating links.');
  process.exit(0);
}

updateLinks().catch(err => {
  console.error(err);
  process.exit(1);
});
