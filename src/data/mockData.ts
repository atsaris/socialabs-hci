import { Project, Tweet, Topic, Influencer, Community } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Persib Bandung",
    description: "Analisis sentimen dan topik terkait pemain baru Persib Bandung",
    category: "sports",
    keywords: ["Layvin Kurzawa"],
    language: "id",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    status: "active",
    tweetsCount: 45000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Pemilu 2024",
    description: "Analisis sentimen dan topik terkait pemilihan umum Indonesia 2024",
    category: "politics",
    keywords: ["pilpres 2024"],
    language: "id",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-02-15"),
    status: "completed",
    tweetsCount: 125000,
    createdAt: new Date("2024-01-01"),
  },
];

// Mock tweets for Persib Bandung / Layvin Kurzawa project
export const mockTweets: Tweet[] = [
  {
    id: "1",
    content: "Gila sih Layvin Kurzawa main di Persib! Mantan PSG loh, kualitasnya beda banget 🔵🔵 #PersibDay",
    author: {
      username: "bobotoh_sejati",
      displayName: "Bobotoh Sejati",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bobotoh",
      verified: true,
    },
    likes: 2850,
    retweets: 890,
    replies: 156,
    sentiment: "positive",
    emotion: "joy",
    topic: "Transfer Pemain",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "2",
    content: "Kurzawa gajinya berapa ya? Jangan sampai Persib rugi, harus produktif dong kalau digaji mahal",
    author: {
      username: "supporter_kritis",
      displayName: "Supporter Kritis",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kritis",
      verified: false,
    },
    likes: 345,
    retweets: 67,
    replies: 234,
    sentiment: "negative",
    emotion: "fear",
    topic: "Finansial Klub",
    createdAt: new Date("2024-02-09"),
  },
  {
    id: "3",
    content: "Penampilan debut Kurzawa lumayan, crossing-nya masih tajam. Semoga bisa konsisten!",
    author: {
      username: "analis_bola",
      displayName: "Analis Bola ID",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=analis",
      verified: true,
    },
    likes: 1567,
    retweets: 320,
    replies: 89,
    sentiment: "positive",
    emotion: "joy",
    topic: "Performa Pemain",
    createdAt: new Date("2024-02-08"),
  },
  {
    id: "4",
    content: "Kurzawa cedera lagi? Baru main 2x udah absen. Ini yang bikin khawatir, rekam medisnya emang buruk",
    author: {
      username: "viking_persib",
      displayName: "Viking Persib",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=viking",
      verified: false,
    },
    likes: 234,
    retweets: 45,
    replies: 178,
    sentiment: "negative",
    emotion: "anger",
    topic: "Cedera Pemain",
    createdAt: new Date("2024-02-07"),
  },
  {
    id: "5",
    content: "Dari segi pengalaman, Kurzawa jelas level atas. Pernah juara Ligue 1, main bareng Neymar Mbappe",
    author: {
      username: "football_stats",
      displayName: "Football Statistics",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=stats",
      verified: true,
    },
    likes: 2100,
    retweets: 567,
    replies: 123,
    sentiment: "positive",
    emotion: "joy",
    topic: "Transfer Pemain",
    createdAt: new Date("2024-02-06"),
  },
  {
    id: "6",
    content: "Manajemen Persib emang beda, bisa datangin pemain sekelas Kurzawa. Liga 1 makin menarik! 🔥",
    author: {
      username: "liga1_update",
      displayName: "Liga 1 Update",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liga1",
      verified: true,
    },
    likes: 3200,
    retweets: 890,
    replies: 234,
    sentiment: "positive",
    emotion: "surprise",
    topic: "Transfer Pemain",
    createdAt: new Date("2024-02-05"),
  },
];

// Topics for Persib Bandung project
export const mockTopics: Topic[] = [
  { 
    id: "1", 
    name: "Transfer Pemain", 
    keywords: ["kurzawa", "transfer", "pemain baru", "PSG"],
    description: "Topik ini membahas tentang kedatangan Layvin Kurzawa sebagai pemain baru Persib Bandung dari Paris Saint-Germain",
    tweetsCount: 18500, 
    percentage: 41 
  },
  { 
    id: "2", 
    name: "Performa Pemain", 
    keywords: ["main", "performa", "skill", "crossing"],
    description: "Topik ini membahas analisis performa dan kemampuan teknis Kurzawa di lapangan saat membela Persib",
    tweetsCount: 12000, 
    percentage: 27 
  },
  { 
    id: "3", 
    name: "Finansial Klub", 
    keywords: ["gaji", "kontrak", "biaya", "mahal"],
    description: "Topik ini membahas tentang aspek finansial dan nilai kontrak pemain untuk Persib Bandung",
    tweetsCount: 8500, 
    percentage: 19 
  },
  { 
    id: "4", 
    name: "Cedera Pemain", 
    keywords: ["cedera", "absen", "recovery", "medis"],
    description: "Topik ini membahas tentang kekhawatiran fans tentang riwayat cedera dan kondisi fisik Kurzawa",
    tweetsCount: 6000, 
    percentage: 13 
  },
];

export const mockInfluencers: Influencer[] = [
  {
    id: "1",
    username: "bandungfootball",
    displayName: "Bandung Football",
    avatar: "/Avatars/Bandung Football.jpg",
    verified: true,
    followers: 2500000,
    engagement: 4.5,
    tweetsCount: 890,
    influence: 95,
  },
  {
    id: "2",
    username: "FabrizioRomano",
    displayName: "Fabrizio Romano",
    avatar: "/Avatars/Fabrizio.jpg",
    verified: true,
    followers: 1800000,
    engagement: 3.8,
    tweetsCount: 654,
    influence: 88,
  },
  {
    id: "3",
    username: "FaktaSepakBola",
    displayName: "Fakta Sepak Bola",
    avatar: "/Avatars/Fakta Bola.jpg",
    verified: true,
    followers: 950000,
    engagement: 5.2,
    tweetsCount: 432,
    influence: 82,
  },
  {
    id: "4",
    username: "wallpassjournal",
    displayName: "The Wall Pass Journal",
    avatar: "/Avatars/WPJ.jpg",
    verified: true,
    followers: 3200000,
    engagement: 2.9,
    tweetsCount: 1250,
    influence: 79,
  },
  {
    id: "5",
    username: "maung_tempur",
    displayName: "Maung Tempur",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maung",
    verified: false,
    followers: 45200,
    engagement: 5.4,
    tweetsCount: 2100,
    influence: 75,
  },
  {
    id: "6",
    username: "pangeranbiru_id",
    displayName: "Pangeran Biru ID",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pangeran",
    verified: false,
    followers: 32100,
    engagement: 4.1,
    tweetsCount: 1540,
    influence: 72,
  },
  {
    id: "7",
    username: "tribun_selatan",
    displayName: "Suara Tribun Selatan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tribun",
    verified: false,
    followers: 12800,
    engagement: 6.8,
    tweetsCount: 980,
    influence: 68,
  },
  {
    id: "8",
    username: "infopersib_1933",
    displayName: "Info Persib 1933",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1933",
    verified: true,
    followers: 89400,
    engagement: 3.9,
    tweetsCount: 4200,
    influence: 81,
  },
  {
    id: "9",
    username: "galeri_bobotoh",
    displayName: "Galeri Bobotoh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=galeri",
    verified: false,
    followers: 56700,
    engagement: 5.9,
    tweetsCount: 3100,
    influence: 77,
  },
  {
    id: "10",
    username: "kabar_siliwangi",
    displayName: "Kabar Siliwangi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siliwangi",
    verified: false,
    followers: 8400,
    engagement: 8.2,
    tweetsCount: 450,
    influence: 65,
  },
];

export const mockCommunities: Community[] = [
  { id: "1", name: "Community of @bandung_football", members: 15200, mainTopic: "Transfer Pemain", color: "#1DA1F2" },
  { id: "2", name: "Community of @fabrizioromano", members: 8900, mainTopic: "Performa Pemain", color: "#17BF63" },
  { id: "3", name: "Community of @faktasepakbola", members: 6700, mainTopic: "Finansial Klub", color: "#FFAD1F" },
  { id: "4", name: "Community of @wallpassjournal", members: 5400, mainTopic: "Transfer Pemain", color: "#794BC4" },
];

// Sentiment data (only positive and negative)
export const sentimentData = [
  { name: "Positive", value: 64, color: "hsl(142, 76%, 36%)" },
  { name: "Negative", value: 36, color: "hsl(0, 84%, 60%)" },
];

export const emotionData = [
  { name: "Joy", value: 35, color: "#17BF63" },
  { name: "Anger", value: 15, color: "#E0245E" },
  { name: "Sadness", value: 12, color: "#1DA1F2" },
  { name: "Fear", value: 8, color: "#794BC4" },
  { name: "Surprise", value: 18, color: "#FFAD1F" },
  { name: "Disgust", value: 12, color: "#F45D22" },
];

// Word cloud data for sentiment
export const positiveWords = [
  { text: "keren", count: 1250 },
  { text: "mantap", count: 980 },
  { text: "hebat", count: 870 },
  { text: "bagus", count: 750 },
  { text: "berkelas", count: 680 },
  { text: "profesional", count: 590 },
  { text: "skill", count: 520 },
  { text: "tajam", count: 480 },
  { text: "pengalaman", count: 450 },
  { text: "juara", count: 420 },
  { text: "luar biasa", count: 380 },
  { text: "bangga", count: 350 },
  { text: "semangat", count: 320 },
  { text: "optimis", count: 290 },
  { text: "berharap", count: 260 },
];

export const negativeWords = [
  { text: "cedera", count: 890 },
  { text: "mahal", count: 720 },
  { text: "khawatir", count: 650 },
  { text: "ragu", count: 580 },
  { text: "kecewa", count: 520 },
  { text: "lambat", count: 450 },
  { text: "tua", count: 420 },
  { text: "gagal", count: 380 },
  { text: "buruk", count: 350 },
  { text: "rugi", count: 320 },
  { text: "absen", count: 290 },
  { text: "risiko", count: 260 },
];

// Extended Topic interface
export interface ExtendedTopic extends Topic {
  description: string;
}
