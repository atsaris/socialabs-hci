import { Project, Tweet, Topic, Influencer, Community } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Analisis Pemilu 2024",
    description: "Analisis sentimen dan topik terkait pemilihan umum Indonesia 2024",
    category: "Politik",
    keywords: ["pemilu", "pilpres", "calon presiden"],
    language: "id",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-15"),
    status: "completed",
    tweetsCount: 125000,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Brand Monitoring - Tech",
    description: "Monitor brand perception untuk perusahaan teknologi",
    category: "Bisnis",
    keywords: ["startup", "tech", "innovation"],
    language: "en",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-02-28"),
    status: "active",
    tweetsCount: 45000,
    createdAt: new Date("2024-02-01"),
  },
];

export const mockTweets: Tweet[] = [
  {
    id: "1",
    content: "Sangat antusias dengan perkembangan teknologi AI di Indonesia! Semoga bisa membawa perubahan positif 🚀",
    author: {
      username: "techuser_id",
      displayName: "Tech Enthusiast",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
      verified: true,
    },
    likes: 1250,
    retweets: 340,
    replies: 89,
    sentiment: "positive",
    emotion: "joy",
    topic: "Teknologi AI",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "2",
    content: "Kecewa dengan layanan customer service yang lambat. Harap diperbaiki! 😤",
    author: {
      username: "customer_voice",
      displayName: "Customer Voice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=customer",
      verified: false,
    },
    likes: 89,
    retweets: 23,
    replies: 156,
    sentiment: "negative",
    emotion: "anger",
    topic: "Customer Service",
    createdAt: new Date("2024-02-09"),
  },
  {
    id: "3",
    content: "Netral saja melihat perkembangan situasi saat ini. Perlu data lebih lanjut untuk kesimpulan.",
    author: {
      username: "analyst_pro",
      displayName: "Data Analyst Pro",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=analyst",
      verified: true,
    },
    likes: 567,
    retweets: 120,
    replies: 45,
    sentiment: "neutral",
    emotion: "surprise",
    topic: "Analisis Data",
    createdAt: new Date("2024-02-08"),
  },
];

export const mockTopics: Topic[] = [
  { id: "1", name: "Teknologi AI", keywords: ["AI", "machine learning", "automation"], tweetsCount: 35000, percentage: 28 },
  { id: "2", name: "Ekonomi Digital", keywords: ["fintech", "e-commerce", "digital payment"], tweetsCount: 28000, percentage: 22 },
  { id: "3", name: "Kebijakan Pemerintah", keywords: ["regulasi", "kebijakan", "pemerintah"], tweetsCount: 22000, percentage: 18 },
  { id: "4", name: "Pendidikan", keywords: ["sekolah", "universitas", "belajar"], tweetsCount: 18000, percentage: 14 },
  { id: "5", name: "Kesehatan", keywords: ["kesehatan", "rumah sakit", "obat"], tweetsCount: 12000, percentage: 10 },
  { id: "6", name: "Lainnya", keywords: ["misc"], tweetsCount: 10000, percentage: 8 },
];

export const mockInfluencers: Influencer[] = [
  {
    id: "1",
    username: "influencer_tech",
    displayName: "Tech Influencer ID",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=influencer1",
    verified: true,
    followers: 2500000,
    engagement: 4.5,
    tweetsCount: 890,
    influence: 95,
  },
  {
    id: "2",
    username: "digital_expert",
    displayName: "Digital Expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=influencer2",
    verified: true,
    followers: 1800000,
    engagement: 3.8,
    tweetsCount: 654,
    influence: 88,
  },
  {
    id: "3",
    username: "thought_leader",
    displayName: "Thought Leader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=influencer3",
    verified: true,
    followers: 950000,
    engagement: 5.2,
    tweetsCount: 432,
    influence: 82,
  },
  {
    id: "4",
    username: "news_update",
    displayName: "News Update ID",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=influencer4",
    verified: true,
    followers: 3200000,
    engagement: 2.9,
    tweetsCount: 1250,
    influence: 79,
  },
];

export const mockCommunities: Community[] = [
  { id: "1", name: "Tech Enthusiasts", members: 12500, mainTopic: "Teknologi AI", color: "#1DA1F2" },
  { id: "2", name: "Business Leaders", members: 8900, mainTopic: "Ekonomi Digital", color: "#17BF63" },
  { id: "3", name: "Policy Watchers", members: 6700, mainTopic: "Kebijakan Pemerintah", color: "#FFAD1F" },
  { id: "4", name: "Education Advocates", members: 5400, mainTopic: "Pendidikan", color: "#F45D22" },
  { id: "5", name: "Health Professionals", members: 4200, mainTopic: "Kesehatan", color: "#794BC4" },
];

export const sentimentData = [
  { name: "Positif", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Negatif", value: 25, color: "hsl(0, 84%, 60%)" },
  { name: "Netral", value: 30, color: "hsl(38, 92%, 50%)" },
];

export const emotionData = [
  { name: "Joy", value: 35, color: "#17BF63" },
  { name: "Anger", value: 15, color: "#E0245E" },
  { name: "Sadness", value: 12, color: "#1DA1F2" },
  { name: "Fear", value: 8, color: "#794BC4" },
  { name: "Surprise", value: 18, color: "#FFAD1F" },
  { name: "Disgust", value: 12, color: "#F45D22" },
];

export const trendData = [
  { date: "1 Feb", tweets: 4500, positive: 2000, negative: 1200, neutral: 1300 },
  { date: "2 Feb", tweets: 5200, positive: 2400, negative: 1400, neutral: 1400 },
  { date: "3 Feb", tweets: 4800, positive: 2100, negative: 1300, neutral: 1400 },
  { date: "4 Feb", tweets: 6100, positive: 2800, negative: 1600, neutral: 1700 },
  { date: "5 Feb", tweets: 7200, positive: 3400, negative: 1900, neutral: 1900 },
  { date: "6 Feb", tweets: 6800, positive: 3100, negative: 1800, neutral: 1900 },
  { date: "7 Feb", tweets: 5900, positive: 2700, negative: 1500, neutral: 1700 },
];
