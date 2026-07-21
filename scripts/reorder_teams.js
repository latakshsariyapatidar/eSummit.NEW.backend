const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const TeamSchema = new mongoose.Schema({
  lead: {
    name: { type: String },
    role: { type: String },
    team: { type: String },
    email: { type: String },
    bio: { type: String },
    image: { type: String },
    event: { type: String },
  },
  crew: [
    {
      name: { type: String },
      image: { type: String },
    },
  ],
});

const Team = mongoose.model('Team', TeamSchema, 'teams');

async function reorder() {
  const teams = await Team.find({}).lean();

  const desiredOrder = ['rajat', 'nirav', 'soumya', 'lataksh', 'anant', 'shreya', 'mayank'];

  teams.sort((a, b) => {
    const aName = a.lead?.name?.toLowerCase() || '';
    const bName = b.lead?.name?.toLowerCase() || '';

    let aIndex = desiredOrder.findIndex(name => aName.includes(name));
    let bIndex = desiredOrder.findIndex(name => bName.includes(name));

    if (aIndex === -1) aIndex = 999;
    if (bIndex === -1) bIndex = 999;

    if (aIndex !== bIndex) return aIndex - bIndex;
    return 0; // maintain original relative order otherwise
  });

  await Team.deleteMany({});

  // Remove _id to let MongoDB generate new ones
  const docsToInsert = teams.map(t => {
    delete t._id;
    return t;
  });

  await Team.insertMany(docsToInsert);
  console.log('Done reordering.');
  process.exit(0);
}

reorder().catch(err => {
  console.error(err);
  process.exit(1);
});
