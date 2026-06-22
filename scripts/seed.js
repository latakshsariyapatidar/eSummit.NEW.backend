const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in the environment variables.');
  process.exit(1);
}

// Inline Schemas and Models to ensure seeding works independently of codebase modules
const PassSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  perks: [String],
  available: { type: Boolean, default: true },
});

const MerchSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  img: String,
});

const EventSchema = new mongoose.Schema({
  slug: String,
  name: String,
  tagline: String,
  day: String,
  time: String,
  about: String,
  brief: String,
  format: [String],
});

const SponsorSchema = new mongoose.Schema({
  name: String,
  tier: String,
  logoType: String,
});

const ScheduleSchema = new mongoose.Schema({
  day: String,
  items: [{
    time: String,
    title: String,
    category: String,
    location: String,
  }],
});

const FAQSchema = new mongoose.Schema({
  q: String,
  a: String,
});

const ConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
});

const TeamSchema = new mongoose.Schema({
  lead: {
    name: String,
    role: String,
    team: String,
    email: String,
    bio: String,
    image: String,
    event: String,
  },
  crew: [{
    name: String,
    image: String,
  }],
});

const PassModel = mongoose.model('SeedPass', PassSchema, 'passes_availability');
const MerchModel = mongoose.model('SeedMerch', MerchSchema, 'merch');
const EventModel = mongoose.model('SeedEvent', EventSchema, 'events');
const SponsorModel = mongoose.model('SeedSponsor', SponsorSchema, 'sponsors');
const ScheduleModel = mongoose.model('SeedSchedule', ScheduleSchema, 'schedules');
const FAQModel = mongoose.model('SeedFAQ', FAQSchema, 'faqs');
const ConfigModel = mongoose.model('SeedConfig', ConfigSchema, 'configs');
const TeamModel = mongoose.model('SeedTeam', TeamSchema, 'teams');

const data = {
  'PASSES': [
    {
      'id': 'pit',
      'name': 'Pit Pass',
      'price': 299,
      'perks': ['Access to all keynotes', 'Expo floor', 'Refreshments'],
      'available': true,
    },
    {
      'id': 'grid',
      'name': 'Grid Pass',
      'price': 499,
      'perks': ['All Pit perks', 'Workshops', 'Networking dinner', 'Swag kit'],
      'available': true,
    },
    {
      'id': 'podium',
      'name': 'Podium Pass',
      'price': 899,
      'perks': [
        'All Grid perks',
        'VIP lounge',
        'Founder meet & greet',
        'Track day ride',
      ],
      'available': true,
    },
  ],
  'MERCH': [
    { 'id': 'm1', 'name': 'Team Jacket', 'price': 1299, 'img': 'jacket' },
    { 'id': 'm2', 'name': 'Pit Crew Cap', 'price': 399, 'img': 'cap' },
    { 'id': 'm3', 'name': 'Racing Tee', 'price': 599, 'img': 'tee' },
    { 'id': 'm4', 'name': 'Driver Gloves', 'price': 799, 'img': 'gloves' },
  ],
  'EVENTS': [
    {
      'slug': 'innovex',
      'name': 'INNOVEX 3.0',
      'tagline': 'Where Ideas Meet Expertise and Innovation Takes Flight',
      'day': 'Day 2',
      'time': '03:30 PM',
      'about': "INNOVEX 3.0 is the flagship pitch deck competition conducted under E-Summit, the umbrella entrepreneurship event of IIT Dharwad, organised by the Institution's Innovation Council (IIC), IIT Dharwad and Dharti Foundation.",
      'brief': 'The event brings together innovative minds from colleges across the country, providing them a platform to present their startup ideas, validate their concepts, and receive valuable insights from a panel of industry experts. Whether you are exploring entrepreneurship for the first time or refining an existing idea, INNOVEX 3.0 gives you the opportunity to transform your vision into a structured pitch and showcase your innovation.',
      'format': [
        'Startup idea submission & screening',
        'Pitch deck validation & mentorship',
        'Presentation to panel of industry experts',
        'Winners declared & startup support',
      ],
    },
    {
      'slug': 'find-the-bug',
      'name': 'Find The Bug 4.0',
      'tagline': 'Identify flaws in existing company strategies and pitch transformative solutions in a fast-paced, problem-solving competition.',
      'day': 'Day 2',
      'time': '11:30 AM',
      'about': 'Find the Bug 4.0 takes you beyond code and into the core of business operations.',
      'brief': "Participants are presented with real-world scenarios involving inefficient strategies, broken workflows, or crisis points within a company. Your task: analyze the problems, find the bugs, and pitch practical and innovative fixes to outsmart your competitors. It's a test of business intelligence, creativity, and communication. Think fast, think sharp, and show the judges you can turn a failing company around.",
      'format': [
        'Scenario briefing & problem selection',
        'Analysis of inefficient workflows & strategy bugs',
        'Solution design & pitch deck preparation',
        'Presentation & Q&A session with judges',
      ],
    },
    {
      'slug': 'bid-a-biz',
      'name': 'Bid-A-Biz',
      'tagline': 'A high-stakes battle of strategy, auctions, and adaptability where every bid can build your empire—or become the reason someone else walks away with the prize money.',
      'day': 'Day 1',
      'time': '02:00 PM',
      'about': 'Bid a Biz is a fast-paced strategy competition designed to test your business instincts, decision-making, and ability to adapt under pressure.',
      'brief': "What begins as a battle of auctions quickly evolves into a high-stakes challenge where market disruptions can turn brilliant strategies into costly mistakes. Participants compete through dynamic auctions, build ventures from strategic assets, and navigate unexpected disruptions that test their ability to think on their feet. Smart decisions can build industry leaders, while a single bad move can become someone else's biggest opportunity. Think you can outsmart the competition, build a thriving enterprise, and stay ahead when the market turns against you? There's only one way to find out.",
      'format': [
        'Strategic asset bidding & auctions',
        'Venture building from acquired assets',
        'Market disruption simulation & pivoting',
        'Final valuation & performance scoring',
      ],
    },
    {
      'slug': 'boardroom-battles',
      'name': 'Boardroom Battles',
      'tagline': "A high-stakes showdown where strategy, persuasion, and innovation collide around the decisions that shape tomorrow's businesses.",
      'day': 'Day 2',
      'time': '10:30 AM',
      'about': 'Boardroom Battles is the ultimate arena where strategy and innovation meet ambition and integrity.',
      'brief': "Participants face a series of challenges that simulate real-world business environments ranging from solo growth pitches to unexpected joint ventures. It's not just about having an idea; it's about defending it, pitching it, and navigating tough competition under pressure. If you're ready to sharpen your business acumen, showcase your leadership, and stand tall in the world of boardroom politics, this is your battlefield.",
      'format': [
        'Scenario analysis & growth pitch preparation',
        'Solo pitches & initial defense',
        'Unexpected joint venture & boardroom crisis simulation',
        'Cross-examination & final boardroom verdict',
      ],
    },
    {
      'slug': 'technostrophe',
      'name': 'Technostrophe',
      'tagline': 'A two-round quiz event that blends tech, trivia, and tension to test your brainpower and reaction time.',
      'day': 'Day 1',
      'time': '09:30 PM',
      'about': 'Technostrophe is a fast-paced quiz showdown designed to push your mental boundaries.',
      'brief': "From hardcore technology to offbeat trivia, it covers a broad spectrum and attracts nationwide participation. Whether you're a techie, trivia geek, or adrenaline junkie, this quiz is your stage to shine. Buzz fast, think faster, and don't miss a beat.",
      'format': [
        'Round 1: Online/On-site written screening quiz',
        'Shortlisted teams announcement',
        'Round 2: Head-to-head buzzer-driven interactive finale',
        'Final score tally & winners ceremony',
      ],
    },
    {
      'slug': 'e-mun',
      'name': 'E-MUN (Corporate Crisis Council)',
      'tagline': "Collaboration is mandatory. Loyalty is sold separately. Also 'Backstabbing' strictly prohibited. Until incentivized And Physical In Nature. Last but not the least Together we stand. Then I quietly profit.",
      'day': 'Day 1 & Day 2',
      'time': '09:30 AM',
      'about': "The world doesn't end with a bang. It ends with a logistics failure. Corporate Crisis Council is a fast-paced diplomacy showdown where the world's most powerful companies are locked in one room and handed one impossible task: survive a catastrophe none of them can solve alone.",
      'brief': "Round one filters for the sharpest minds — the thinkers who see three moves ahead. Round two throws them into a live, two-day corporate war room where alliances are currency, trust is collateral, and every handshake hides a knife. You won't represent a country. You'll command an empire. Forge pacts, broker bailouts, outmaneuver regulators, and decide who survives the collapse and who becomes the cautionary tale. Cooperation is mandatory. Loyalty is optional. The only rule that matters: protect your own. From strategy to back-channel betrayal, this is diplomacy with the gloves off. Negotiate hard, think harder, and remember — in a crisis, the most dangerous person in the room is the one still smiling.",
      'format': [
        'Round 1: Crisis screening & strategy testing',
        'Round 2 Day 1: Corporate war room setup & initial alliances',
        'Round 2 Day 2: Market disruptions, bailouts & final negotiations',
        'Crisis resolution & survival/profit assessment',
      ],
    },
  ],
  'SPONSORS': [
    { 'name': 'VELOCITAS', 'tier': 'Title Sponsor', 'logoType': 'engine' },
    { 'name': 'AXLE&CO', 'tier': 'Co-Powered By', 'logoType': 'gear' },
    { 'name': 'KAIROS EV', 'tier': 'EV Tech Partner', 'logoType': 'battery' },
    { 'name': 'OCTANE', 'tier': 'Mobility Partner', 'logoType': 'bolt' },
    { 'name': 'MERIDIAN MOTORS', 'tier': 'Automotive Partner', 'logoType': 'shield' },
    { 'name': 'REDLINE APEX', 'tier': 'Racing Partner', 'logoType': 'apex' },
    { 'name': 'TORQUE LABS', 'tier': 'Innovation Sponsor', 'logoType': 'wing' },
    { 'name': 'APEX FUEL', 'tier': 'Energy Sponsor', 'logoType': 'circle' },
  ],
  'SCHEDULE': [
    {
      'day': 'Day 01',
      'items': [
        {
          'time': '09:45 AM',
          'title': 'Inauguration',
          'category': 'Ceremony',
          'location': 'F020',
        },
        {
          'time': '09:30 AM',
          'title': 'Corporate Crisis Council (E-MUN) Day I',
          'category': 'Competition',
          'location': '101',
        },
        {
          'time': '02:00 PM',
          'title': 'Bid-A-Biz Phase I',
          'category': 'Competition',
          'location': '111',
        },
        {
          'time': '04:30 PM',
          'title': 'Bid-A-Biz Phase II',
          'category': 'Competition',
          'location': '111',
        },
        {
          'time': '09:30 PM',
          'title': 'Technostrophe Round II',
          'category': 'Competition',
          'location': 'Main Stage',
        },
      ],
    },
    {
      'day': 'Day 02',
      'items': [
        {
          'time': '09:30 AM',
          'title': 'Corporate Crisis Council (E-MUN) Day II',
          'category': 'Competition',
          'location': '101',
        },
        {
          'time': '10:30 AM',
          'title': 'Boardroom Battles I',
          'category': 'Competition',
          'location': '111',
        },
        {
          'time': '11:30 AM',
          'title': 'Find The Bug - Round II',
          'category': 'Competition',
          'location': '120',
        },
        {
          'time': '01:30 PM',
          'title': 'Boardroom Battles II',
          'category': 'Competition',
          'location': '111',
        },
        {
          'time': '03:30 PM',
          'title': 'INNOVEX 3.0',
          'category': 'Competition',
          'location': '103',
        },
        {
          'time': '06:30 PM',
          'title': 'Cultural Night',
          'category': 'Cultural',
          'location': 'F020',
        },
      ],
    },
  ],
  'FAQS': [
    {
      'q': 'When and where is E-Summit 2026?',
      'a': 'March 6–8, 2026 at IIT Dharwad.',
    },
    {
      'q': 'Who should attend?',
      'a': "Anyone with a passion for innovation, entrepreneurship, and problem-solving. Whether you're a student, creator, aspiring entrepreneur, developer, designer, or simply curious to learn, E-Summit has something for you.",
    },
    {
      'q': 'Can I get a refund?',
      'a': 'Passes are non-refundable.',
    },
    {
      'q': 'Is accommodation available?',
      'a': 'Yes. Accommodation is provided to eligible attendees based on their participation category. Participants may be accommodated in IIT Dharwad hostels, while invited guests are provided accommodation at the campus guest house. Further details will be communicated after registration.',
    },
  ],
  'UPI_IDS': [
    'esummit@iitdh',
    'esummit26@okhdfcbank',
    'iitdh.esummit@okaxis',
    'payment.esummit@paytm',
  ],
  'TARGET_DATE': '2026-08-20T09:00:00.000Z',
  'FUNCTIONAL_TEAMS': [
    {
      'lead': {
        'name': 'Rajat Gupta',
        'role': 'Overall Coordinator',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Directing the overall execution and strategic partnerships of E-Summit 2026.',
        'image': 'https://ui-avatars.com/api/?name=Rajat+Gupta&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'Anant Tripathi',
        'role': 'Operations Head',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Managing overall ground operations, logistics, and resource planning for E-Summit 2026.',
        'image': 'https://ui-avatars.com/api/?name=Anant+Tripathi&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'L Shreya',
        'role': 'Outreach Head',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Driving institutional partnerships, external relations, and marketing campaigns.',
        'image': 'https://ui-avatars.com/api/?name=L+Shreya&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'Soumya Basuli',
        'role': 'Design Lead',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': "Curating E-Summit 2026's visual identity, graphic design assets, and event style guide.",
        'image': 'https://ui-avatars.com/api/?name=Soumya+Basuli&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'Nirav Mittal',
        'role': 'Events Coordinator',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Managing event timelines, judging rubrics, and scheduling across all competition grids.',
        'image': 'https://ui-avatars.com/api/?name=Nirav+Mittal&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'Mayank Mishra',
        'role': 'PR Lead',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Handling public relations, media reach, speaker coordination, and press releases.',
        'image': 'https://ui-avatars.com/api/?name=Mayank+Mishra&background=0D0D0C&color=fff',
      },
      'crew': [],
    },
    {
      'lead': {
        'name': 'Lataksh Sariya',
        'role': 'Web Team Lead',
        'team': 'Core Committee',
        'email': 'outreach.iic@iitdh.ac.in',
        'bio': 'Architecting the digital interfaces, transitions, and user experiences for E-Summit 2026.',
        'image': 'https://ui-avatars.com/api/?name=Lataksh+Sariya&background=0D0D0C&color=fff',
      },
      'crew': [
        {
          'name': 'Aaditya Kumar',
          'image': 'https://ui-avatars.com/api/?name=Aaditya+Kumar&background=0D0D0C&color=fff',
        },
        {
          'name': 'Anju',
          'image': 'https://ui-avatars.com/api/?name=Anju&background=0D0D0C&color=fff',
        },
        {
          'name': 'Ashutosh Tiwari',
          'image': 'https://ui-avatars.com/api/?name=Ashutosh+Tiwari&background=0D0D0C&color=fff',
        },
        {
          'name': 'Jayesh',
          'image': 'https://ui-avatars.com/api/?name=Jayesh&background=0D0D0C&color=fff',
        },
        {
          'name': 'Krish Gupta',
          'image': 'https://ui-avatars.com/api/?name=Krish+Gupta&background=0D0D0C&color=fff',
        },
        {
          'name': 'Lakshman',
          'image': 'https://ui-avatars.com/api/?name=Lakshman&background=0D0D0C&color=fff',
        },
      ],
    },
  ],
  'EVENT_TEAMS': [
    {
      'lead': {
        'event': 'Innovex',
        'name': 'Navajeevan K S',
        'role': 'Event Lead',
        'bio': 'Leading execution of the flagship Innovex startup pitch stage.',
        'image': 'https://ui-avatars.com/api/?name=Navajeevan+K+S&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Tejas Sharma',
          'image': 'https://ui-avatars.com/api/?name=Tejas+Sharma&background=0D0D0C&color=fff',
        },
        {
          'name': 'Saikat Ghosh',
          'image': 'https://ui-avatars.com/api/?name=Saikat+Ghosh&background=0D0D0C&color=fff',
        },
        {
          'name': 'Jayesh',
          'image': 'https://ui-avatars.com/api/?name=Jayesh&background=0D0D0C&color=fff',
        },
      ],
    },
    {
      'lead': {
        'event': 'Find The Bug',
        'name': 'SAI RAM',
        'role': 'Event Lead',
        'bio': 'Orchestrating the code debugging and code reviews tracking challenge.',
        'image': 'https://ui-avatars.com/api/?name=SAI+RAM&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Hithesh V R',
          'image': 'https://ui-avatars.com/api/?name=Hithesh+V+R&background=0D0D0C&color=fff',
        },
        {
          'name': 'Aditya Jain',
          'image': 'https://ui-avatars.com/api/?name=Aditya+Jain&background=0D0D0C&color=fff',
        },
        {
          'name': 'Chaitanya Handore',
          'image': 'https://ui-avatars.com/api/?name=Chaitanya+Handore&background=0D0D0C&color=fff',
        },
        {
          'name': 'Aaditya Kumar',
          'image': 'https://ui-avatars.com/api/?name=Aaditya+Kumar&background=0D0D0C&color=fff',
        },
      ],
    },
    {
      'lead': {
        'event': 'Bid-A-Biz',
        'name': 'Pranav S Newton',
        'role': 'Event Lead',
        'bio': 'Leading the business strategy bid and auction simulation.',
        'image': 'https://ui-avatars.com/api/?name=Pranav+S+Newton&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Rahul Ahirwar',
          'image': 'https://ui-avatars.com/api/?name=Rahul+Ahirwar&background=0D0D0C&color=fff',
        },
        {
          'name': 'Shivam Srivastava',
          'image': 'https://ui-avatars.com/api/?name=Shivam+Srivastava&background=0D0D0C&color=fff',
        },
        {
          'name': 'Aadhi',
          'image': 'https://ui-avatars.com/api/?name=Aadhi&background=0D0D0C&color=fff',
        },
        {
          'name': 'Sameer Patel',
          'image': 'https://ui-avatars.com/api/?name=Sameer+Patel&background=0D0D0C&color=fff',
        },
      ],
    },
    {
      'lead': {
        'event': 'Technostrophe',
        'name': 'Pranav',
        'role': 'Event Lead',
        'bio': 'Running the technology quiz event and adrenaline-filled buzzer finals.',
        'image': 'https://ui-avatars.com/api/?name=Pranav&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Achinthya',
          'image': 'https://ui-avatars.com/api/?name=Achinthya&background=0D0D0C&color=fff',
        },
        {
          'name': 'Shubhra Kishor Nikam',
          'image': 'https://ui-avatars.com/api/?name=Shubhra+Kishor+Nikam&background=0D0D0C&color=fff',
        },
        {
          'name': 'Lakshya Kumar',
          'image': 'https://ui-avatars.com/api/?name=Lakshya+Kumar&background=0D0D0C&color=fff',
        },
      ],
    },
    {
      'lead': {
        'event': 'Boardroom Battles',
        'name': 'Anushaa B',
        'role': 'Event Lead',
        'bio': 'Leading the business strategy pitches and boardroom simulation battles.',
        'image': 'https://ui-avatars.com/api/?name=Anushaa+B&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Priyanshu Nimbalkar',
          'image': 'https://ui-avatars.com/api/?name=Priyanshu+Nimbalkar&background=0D0D0C&color=fff',
        },
        {
          'name': 'Gourav Sherikar',
          'image': 'https://ui-avatars.com/api/?name=Gourav+Sherikar&background=0D0D0C&color=fff',
        },
        {
          'name': 'Saisha Nimbalkar',
          'image': 'https://ui-avatars.com/api/?name=Saisha+Nimbalkar&background=0D0D0C&color=fff',
        },
        {
          'name': 'Lakshman Naidu Bandela',
          'image': 'https://ui-avatars.com/api/?name=Lakshman+Naidu+Bandela&background=0D0D0C&color=fff',
        },
      ],
    },
    {
      'lead': {
        'event': 'E-MUN + GD',
        'name': 'Sudhakar',
        'role': 'Event Lead',
        'bio': 'Orchestrating the corporate diplomacy council crisis model.',
        'image': 'https://ui-avatars.com/api/?name=Sudhakar&background=0D0D0C&color=fff',
        'email': 'outreach.iic@iitdh.ac.in',
      },
      'crew': [
        {
          'name': 'Anjali Kumari',
          'image': 'https://ui-avatars.com/api/?name=Anjali+Kumari&background=0D0D0C&color=fff',
        },
        {
          'name': 'Aditi Upadhye',
          'image': 'https://ui-avatars.com/api/?name=Aditi+Upadhye&background=0D0D0C&color=fff',
        },
        {
          'name': 'Tangirala Dhanunjaya Rao',
          'image': 'https://ui-avatars.com/api/?name=Tangirala+Dhanunjaya+Rao&background=0D0D0C&color=fff',
        },
      ],
    },
  ],
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔄 Connected to database for seeding...');

    // Clear existing collections to prevent duplicates
    await PassModel.deleteMany({});
    await MerchModel.deleteMany({});
    await EventModel.deleteMany({});
    await SponsorModel.deleteMany({});
    await ScheduleModel.deleteMany({});
    await FAQModel.deleteMany({});
    await ConfigModel.deleteMany({});
    await TeamModel.deleteMany({});
    console.log('🧹 Cleaned existing collections...');

    // Seed passes and merch
    await PassModel.insertMany(data.PASSES);
    await MerchModel.insertMany(data.MERCH);
    await EventModel.insertMany(data.EVENTS);
    await SponsorModel.insertMany(data.SPONSORS);
    await ScheduleModel.insertMany(data.SCHEDULE);
    await FAQModel.insertMany(data.FAQS);
    console.log('✅ Seeded passes, merch, events, sponsors, schedule, faqs...');

    // Seed configurations (UPI_IDS, TARGET_DATE)
    await ConfigModel.create({ key: 'UPI_IDS', value: data.UPI_IDS });
    await ConfigModel.create({ key: 'TARGET_DATE', value: data.TARGET_DATE });
    console.log('✅ Seeded general configuration settings...');

    // Seed teams (Functional and Event)
    const teamsToInsert = [];

    data.FUNCTIONAL_TEAMS.forEach(team => {
      teamsToInsert.push({
        lead: team.lead,
        crew: team.crew,
      });
    });

    data.EVENT_TEAMS.forEach(team => {
      teamsToInsert.push({
        lead: team.lead,
        crew: team.crew,
      });
    });

    await TeamModel.insertMany(teamsToInsert);
    console.log('✅ Seeded functional and event teams...');

    console.log('🚀 Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
