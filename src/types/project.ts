export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  language: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'pending';
  tweetsCount: number;
  createdAt: Date;
}

export interface Tweet {
  id: string;
  content: string;
  author: {
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  likes: number;
  retweets: number;
  replies: number;
  sentiment: 'positive' | 'negative';
  emotion: 'joy' | 'anger' | 'sadness' | 'fear' | 'surprise' | 'disgust';
  topic: string;
  createdAt: Date;
}

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  description?: string;
  tweetsCount: number;
  percentage: number;
}

export interface Influencer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followers: number;
  engagement: number;
  tweetsCount: number;
  influence: number;
}

export interface Community {
  id: string;
  name: string;
  members: number;
  mainTopic: string;
  color: string;
}
