import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "World", slug: "world" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Tech", slug: "tech" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
];

const subcategories: Record<string, { name: string; slug: string }[]> = {
  world: [
    { name: "Asia", slug: "asia" },
    { name: "Europe", slug: "europe" },
    { name: "Middle East", slug: "middle-east" },
    { name: "Africa", slug: "africa" },
    { name: "Americas", slug: "americas" },
  ],
  politics: [
    { name: "U.S. Politics", slug: "us-politics" },
    { name: "Elections", slug: "elections" },
    { name: "Policy", slug: "policy" },
    { name: "Opinion", slug: "opinion" },
  ],
  business: [
    { name: "Markets", slug: "markets" },
    { name: "Economy", slug: "economy" },
    { name: "Technology", slug: "technology" },
    { name: "Finance", slug: "finance" },
  ],
  tech: [
    { name: "AI & Machine Learning", slug: "ai-machine-learning" },
    { name: "Software", slug: "software" },
    { name: "Hardware", slug: "hardware" },
    { name: "Startups", slug: "startups" },
  ],
  sports: [
    { name: "Football", slug: "football" },
    { name: "Basketball", slug: "basketball" },
    { name: "Soccer", slug: "soccer" },
    { name: "Baseball", slug: "baseball" },
  ],
  entertainment: [
    { name: "Movies", slug: "movies" },
    { name: "TV Shows", slug: "tv-shows" },
    { name: "Music", slug: "music" },
    { name: "Celebrity", slug: "celebrity" },
  ],
};

const articles = [
  {
    title: "Global Leaders Gather for Climate Summit",
    slug: "global-leaders-gather-for-climate-summit",
    excerpt: "World leaders meet to discuss urgent climate action and carbon emission targets for the next decade.",
    content: "World leaders from over 190 countries gathered today for a historic climate summit aimed at setting ambitious carbon emission targets for the next decade. The summit comes amid growing concerns about the pace of global warming and its impact on vulnerable communities worldwide.",
    subcategory: "asia",
    author: "Sarah Johnson",
    imageUrl: "https://picsum.photos/seed/climate1/600/400",
    date: "2026-07-23",
  },
  {
    title: "Tech Giants Report Record Quarterly Earnings",
    slug: "tech-giants-report-record-quarterly-earnings",
    excerpt: "Major technology companies surpass Wall Street expectations with strong AI-driven revenue growth.",
    content: "The world's largest technology companies reported record quarterly earnings this week, driven primarily by surging demand for artificial intelligence products and services. The results exceeded Wall Street expectations across the board.",
    subcategory: "markets",
    author: "Michael Chen",
    imageUrl: "https://picsum.photos/seed/markets1/600/400",
    date: "2026-07-22",
  },
  {
    title: "New AI Model Breaks Language Processing Records",
    slug: "new-ai-model-breaks-language-processing-records",
    excerpt: "Researchers unveil an AI system that achieves human-level performance across 50 languages.",
    content: "A team of researchers has unveiled a groundbreaking artificial intelligence system that achieves human-level performance in language understanding and generation across 50 different languages, setting new benchmarks in the field of natural language processing.",
    subcategory: "ai-machine-learning",
    author: "Emily Davis",
    imageUrl: "https://picsum.photos/seed/ai1/600/400",
    date: "2026-07-22",
  },
  {
    title: "Championship Finals Set for This Weekend",
    slug: "championship-finals-set-for-this-weekend",
    excerpt: "The two top-seeded teams prepare for what analysts call the most competitive finals in a decade.",
    content: "The championship finals are set for this weekend as the two top-seeded teams prepare for what sports analysts are calling the most competitive finals matchup in over a decade.",
    subcategory: "football",
    author: "James Wilson",
    imageUrl: "https://picsum.photos/seed/football1/600/400",
    date: "2026-07-21",
  },
  {
    title: "Senate Passes New Infrastructure Bill",
    slug: "senate-passes-new-infrastructure-bill",
    excerpt: "Bipartisan support pushes through $500 billion infrastructure package targeting roads and broadband.",
    content: "The United States Senate passed a landmark $500 billion infrastructure bill today with strong bipartisan support, targeting improvements to roads, bridges, and broadband internet access across the country.",
    subcategory: "us-politics",
    author: "Laura Martinez",
    imageUrl: "https://picsum.photos/seed/senate1/600/400",
    date: "2026-07-21",
  },
  {
    title: "Summer Blockbuster Breaks Box Office Records",
    slug: "summer-blockbuster-breaks-box-office-records",
    excerpt: "The highly anticipated sequel earns $300 million in its opening weekend worldwide.",
    content: "The highly anticipated summer blockbuster sequel shattered box office records this weekend, earning an impressive $300 million worldwide in its opening three days of release.",
    subcategory: "movies",
    author: "David Brown",
    imageUrl: "https://picsum.photos/seed/movies1/600/400",
    date: "2026-07-20",
  },
  {
    title: "Stock Markets Reach All-Time Highs",
    slug: "stock-markets-reach-all-time-highs",
    excerpt: "S&P 500 and Nasdaq climb to record levels driven by strong corporate earnings and economic data.",
    content: "Major stock market indices climbed to record highs today, with the S&P 500 and Nasdaq both reaching all-time peaks driven by strong corporate earnings reports and positive economic data.",
    subcategory: "economy",
    author: "Robert Taylor",
    imageUrl: "https://picsum.photos/seed/economy1/600/400",
    date: "2026-07-20",
  },
  {
    title: "Space Agency Announces Mars Mission Date",
    slug: "space-agency-announces-mars-mission-date",
    excerpt: "New crewed mission to Mars scheduled for 2028 with advanced propulsion technology.",
    content: "The national space agency announced today that a new crewed mission to Mars is scheduled for 2028, featuring advanced propulsion technology that will significantly reduce travel time to the Red Planet.",
    subcategory: "software",
    author: "Anna Lee",
    imageUrl: "https://picsum.photos/seed/software1/600/400",
    date: "2026-07-19",
  },
  {
    title: "International Peace Talks Resume in Geneva",
    slug: "international-peace-talks-resume-in-geneva",
    excerpt: "Diplomats gather for renewed negotiations aimed at resolving long-standing regional conflicts.",
    content: "International diplomats gathered in Geneva today for the resumption of peace talks aimed at resolving several long-standing regional conflicts that have displaced millions of people.",
    subcategory: "europe",
    author: "Thomas Anderson",
    imageUrl: "https://picsum.photos/seed/geneva1/600/400",
    date: "2026-07-19",
  },
  {
    title: "Olympic Medal Count Update",
    slug: "olympic-medal-count-update",
    excerpt: "Latest standings as athletes compete across multiple disciplines in the summer games.",
    content: "As the summer Olympic games continue, here are the latest medal standings as athletes from around the world compete across multiple disciplines.",
    subcategory: "basketball",
    author: "Jessica Kim",
    imageUrl: "https://picsum.photos/seed/basketball1/600/400",
    date: "2026-07-18",
  },
  {
    title: "New Cybersecurity Regulations Proposed",
    slug: "new-cybersecurity-regulations-proposed",
    excerpt: "Government introduces stricter data protection rules for companies handling user information.",
    content: "The government proposed new cybersecurity regulations today that would introduce stricter data protection requirements for companies handling sensitive user information.",
    subcategory: "hardware",
    author: "Kevin White",
    imageUrl: "https://picsum.photos/seed/hardware1/600/400",
    date: "2026-07-18",
  },
  {
    title: "Streaming Wars Heat Up with New Platform Launch",
    slug: "streaming-wars-heat-up-with-new-platform-launch",
    excerpt: "A new player enters the streaming market with exclusive content and competitive pricing.",
    content: "The streaming landscape got more competitive today with the launch of a new platform offering exclusive content and competitive pricing, intensifying the battle for viewers' attention and subscription dollars.",
    subcategory: "tv-shows",
    author: "Nicole Garcia",
    imageUrl: "https://picsum.photos/seed/tvshows1/600/400",
    date: "2026-07-17",
  },
  {
    title: "European Union Announces New Trade Agreement",
    slug: "european-union-announces-new-trade-agreement",
    excerpt: "EU signs landmark trade deal with Asian Pacific nations opening new markets.",
    content: "The European Union announced a landmark trade agreement with several Asian Pacific nations today, opening new markets for European businesses and strengthening economic ties across the region.",
    subcategory: "asia",
    author: "Sarah Johnson",
    imageUrl: "https://picsum.photos/seed/trade1/600/400",
    date: "2026-07-17",
  },
  {
    title: "Congress Debates New Healthcare Reform",
    slug: "congress-debates-new-healthcare-reform",
    excerpt: "Lawmakers discuss comprehensive healthcare changes affecting millions of Americans.",
    content: "Congressional lawmakers began heated debate today over a comprehensive healthcare reform bill that could affect millions of Americans' access to medical services and insurance coverage.",
    subcategory: "us-politics",
    author: "Laura Martinez",
    imageUrl: "https://picsum.photos/seed/elections1/600/400",
    date: "2026-07-16",
  },
  {
    title: "Central Bank Holds Interest Rates Steady",
    slug: "central-bank-holds-interest-rates-steady",
    excerpt: "Federal Reserve maintains current rates amid mixed economic signals.",
    content: "The Federal Reserve decided to maintain current interest rates today, citing mixed economic signals as the reason for holding steady rather than implementing further changes.",
    subcategory: "finance",
    author: "Robert Taylor",
    imageUrl: "https://picsum.photos/seed/finance1/600/400",
    date: "2026-07-16",
  },
  {
    title: "New Soccer League Announces Expansion",
    slug: "new-soccer-league-announces-expansion",
    excerpt: "Major soccer league adds four new teams for the upcoming season.",
    content: "A major soccer league announced today that it will expand by four new teams for the upcoming season, bringing the total number of clubs to a record high.",
    subcategory: "soccer",
    author: "James Wilson",
    imageUrl: "https://picsum.photos/seed/soccer1/600/400",
    date: "2026-07-15",
  },
  {
    title: "Tech Startup Raises $500M in Funding",
    slug: "tech-startup-raises-500m-in-funding",
    excerpt: "AI-powered startup secures massive funding round led by top venture capital firms.",
    content: "An AI-powered technology startup announced today that it has secured $500 million in funding in a round led by some of the world's top venture capital firms.",
    subcategory: "startups",
    author: "Emily Davis",
    imageUrl: "https://picsum.photos/seed/startup1/600/400",
    date: "2026-07-15",
  },
  {
    title: "Summer Music Festival Lineup Announced",
    slug: "summer-music-festival-lineup-announced",
    excerpt: "Major music festival reveals headliners and full schedule for this summer.",
    content: "One of the world's largest music festivals revealed its full lineup today, including headliners and the complete schedule for this summer's multi-day event.",
    subcategory: "music",
    author: "Nicole Garcia",
    imageUrl: "https://picsum.photos/seed/music1/600/400",
    date: "2026-07-14",
  },
  {
    title: "African Union Summit Addresses Climate Change",
    slug: "african-union-summit-addresses-climate-change",
    excerpt: "Leaders from across Africa gather to discuss environmental challenges and solutions.",
    content: "Leaders from across the African continent gathered today for the African Union summit, with climate change and environmental challenges topping the agenda.",
    subcategory: "africa",
    author: "Thomas Anderson",
    imageUrl: "https://picsum.photos/seed/africa1/600/400",
    date: "2026-07-14",
  },
  {
    title: "Baseball Season Mid-Year Report",
    slug: "baseball-season-mid-year-report",
    excerpt: "Teams positioned for playoff runs as season reaches halfway point.",
    content: "As the baseball season reaches its halfway point, several teams are positioning themselves for strong playoff runs while others face an uphill battle in the second half.",
    subcategory: "baseball",
    author: "Jessica Kim",
    imageUrl: "https://picsum.photos/seed/baseball1/600/400",
    date: "2026-07-13",
  },
];

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);
  const editorPassword = await bcrypt.hash("editor123", 10);
  const authorPassword = await bcrypt.hash("author123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@news.com" },
    update: { password: hashedPassword },
    create: {
      name: "Admin",
      email: "admin@news.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created admin user: ${admin.name}`);

  const editor = await prisma.user.upsert({
    where: { email: "editor@news.com" },
    update: { password: editorPassword },
    create: {
      name: "Editor",
      email: "editor@news.com",
      password: editorPassword,
      role: "EDITOR",
    },
  });
  console.log(`Created editor user: ${editor.name}`);

  const author = await prisma.user.upsert({
    where: { email: "author@news.com" },
    update: { password: authorPassword },
    create: {
      name: "Author",
      email: "author@news.com",
      password: authorPassword,
      role: "AUTHOR",
    },
  });
  console.log(`Created author user: ${author.name}`);

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    console.log(`Created category: ${cat.name}`);

    const subs = subcategories[cat.slug] || [];
    for (const sub of subs) {
      await prisma.category.upsert({
        where: { slug: sub.slug },
        update: {},
        create: {
          name: sub.name,
          slug: sub.slug,
          parentId: created.id,
        },
      });
      console.log(`  Created subcategory: ${sub.name}`);
    }
  }

  for (const article of articles) {
    const subCat = await prisma.category.findUnique({
      where: { slug: article.subcategory },
    });
    if (!subCat) continue;

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        imageUrl: article.imageUrl,
        status: "PUBLISHED",
        categoryId: subCat.id,
        authorId: admin.id,
        createdAt: new Date(article.date),
      },
    });
    console.log(`Created article: ${article.title}`);
  }

  const pages = [
    {
      title: "About Us",
      slug: "about",
      content: `<h2>Our Mission</h2><p>NEWS is dedicated to delivering accurate, timely, and comprehensive news coverage from around the world. Our mission is to inform and empower our readers with quality journalism that matters.</p><h2>Our Story</h2><p>Founded in 2026, NEWS has quickly grown to become a trusted source for breaking news, in-depth analysis, and human interest stories. Our team of experienced journalists and editors work around the clock to bring you the news that shapes our world.</p><h2>Our Values</h2><ul><li>Accuracy and truth in reporting</li><li>Independence and editorial integrity</li><li>Transparency in our processes</li><li>Respect for our readers and sources</li><li>Innovation in storytelling</li></ul><h2>Our Team</h2><p>Our diverse team of journalists, editors, and media professionals brings decades of combined experience in covering global events, politics, technology, business, sports, and entertainment.</p>`,
    },
    {
      title: "Careers",
      slug: "careers",
      content: `<h2>Why Work at NEWS?</h2><p>At NEWS, we believe in the power of journalism to inform and inspire. Join a team that values integrity, creativity, and impact. We offer competitive salaries, comprehensive benefits, and the opportunity to be part of something meaningful.</p><h2>Open Positions</h2><h3>Senior Political Correspondent</h3><p>Washington, D.C. &middot; Full-time</p><p>Cover breaking political news and policy developments for our growing audience.</p><h3>Technology Reporter</h3><p>San Francisco, CA &middot; Full-time</p><p>Report on the latest in tech, AI, and digital innovation.</p><h3>Sports Editor</h3><p>New York, NY &middot; Full-time</p><p>Lead our sports coverage and manage a team of writers.</p><h3>Video Producer</h3><p>Remote &middot; Full-time</p><p>Create compelling video content for our digital platforms.</p><h3>Social Media Manager</h3><p>Remote &middot; Full-time</p><p>Manage our social media presence and audience engagement.</p>`,
    },
    {
      title: "Contact Us",
      slug: "contact",
      content: `<p>We would love to hear from you. Reach out to us using the information below.</p><h2>Contact Info</h2><p><strong>Address:</strong> 123 News Street, New York, NY 10001</p><p><strong>Email:</strong> contact@news.com</p><p><strong>Phone:</strong> (555) 123-4567</p><h2>Office Hours</h2><p>Monday - Friday: 9:00 AM - 6:00 PM</p><p>Saturday: 10:00 AM - 4:00 PM</p><p>Sunday: Closed</p>`,
    },
    {
      title: "Advertise With Us",
      slug: "advertise",
      content: `<h2>Why Advertise With NEWS?</h2><p>NEWS reaches millions of engaged readers daily. Our audience trusts us for accurate, timely news, making your brand message more impactful. We offer various advertising solutions to meet your marketing goals.</p><h3>Display Advertising</h3><p>Banner ads, native ads, and rich media placements across our website and apps.</p><h3>Sponsored Content</h3><p>Native advertising that blends seamlessly with our editorial content.</p><h3>Newsletter Sponsorship</h3><p>Reach our email subscribers with targeted newsletter placements.</p><h3>Video Advertising</h3><p>Pre-roll, mid-roll, and companion banner ads on our video content.</p><p>Ready to advertise with us? Contact us at advertise@news.com.</p>`,
    },
    {
      title: "Terms of Service",
      slug: "terms",
      content: `<p><em>Last updated: July 23, 2026</em></p><h2>1. Acceptance of Terms</h2><p>By accessing and using NEWS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p><h2>2. Use of Services</h2><p>You may use our services for lawful purposes only. You agree not to use our services in any way that violates any applicable law or regulation.</p><h2>3. Content</h2><p>All content published on NEWS is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p><h2>4. User Accounts</h2><p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p><h2>5. Limitation of Liability</h2><p>NEWS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p><h2>6. Changes to Terms</h2><p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page.</p><h2>7. Contact Us</h2><p>If you have any questions about these Terms, please contact us at terms@news.com.</p>`,
    },
    {
      title: "Privacy Policy",
      slug: "privacy",
      content: `<p><em>Last updated: July 23, 2026</em></p><h2>1. Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.</p><h2>2. How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, to send you news and updates, and to communicate with you about our services.</p><h2>3. Information Sharing</h2><p>We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with legal obligations, or to protect our rights.</p><h2>4. Data Security</h2><p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p><h2>5. Your Rights</h2><p>You have the right to access, correct, or delete your personal information. You may also opt out of receiving promotional communications from us at any time.</p><h2>6. Contact Us</h2><p>If you have any questions about this Privacy Policy, please contact us at privacy@news.com.</p>`,
    },
    {
      title: "Cookie Policy",
      slug: "cookies",
      content: `<p><em>Last updated: July 23, 2026</em></p><h2>What Are Cookies</h2><p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p><h2>How We Use Cookies</h2><p>We use cookies for the following purposes:</p><ul><li>To remember your preferences and settings</li><li>To analyze how our website is used</li><li>To personalize content and advertisements</li><li>To provide social media features</li></ul><h2>Types of Cookies We Use</h2><h3>Essential Cookies</h3><p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access.</p><h3>Analytics Cookies</h3><p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p><h3>Marketing Cookies</h3><p>These cookies are used to track visitors across websites to display relevant advertisements.</p><h2>Managing Cookies</h2><p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p><h2>Contact Us</h2><p>If you have any questions about our Cookie Policy, please contact us at privacy@news.com.</p>`,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { content: page.content },
      create: {
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: "PUBLISHED",
      },
    });
    console.log(`Created page: ${page.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
