export type EventItem = {
  title: string;
  image: string;
  slug: string;
  date: string;
  time: string;
  location: string;
};

export const events: EventItem[] = [
  {
    title: "React Nexus 2025",
    image: "/images/event1.png",
    slug: "react-nexus-2025",
    date: "October 12, 2025",
    time: "09:00 AM",
    location: "San Francisco, CA",
  },
  {
    title: "Next.js Conf",
    image: "/images/event2.png",
    slug: "nextjs-conf",
    date: "October 26, 2025",
    time: "10:00 AM",
    location: "Online",
  },
  {
    title: "AI for Developers Summit",
    image: "/images/event3.png",
    slug: "ai-dev-summit",
    date: "November 15, 2025",
    time: "08:30 AM",
    location: "London, UK",
  },
  {
    title: "Global Hackathon Series",
    image: "/images/event4.png",
    slug: "global-hackathon",
    date: "December 05, 2025",
    time: "06:00 PM",
    location: "New York, NY",
  },
  {
    title: "Tech Leaders Meetup",
    image: "/images/event5.png",
    slug: "tech-leaders-meetup",
    date: "January 20, 2026",
    time: "05:00 PM",
    location: "Berlin, Germany",
  },
  {
    title: "Open Source World",
    image: "/images/event6.png",
    slug: "open-source-world",
    date: "February 10, 2026",
    time: "09:00 AM",
    location: "Austin, TX",
  },
];
