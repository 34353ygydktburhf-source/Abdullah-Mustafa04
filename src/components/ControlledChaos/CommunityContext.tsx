import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLogin } from "./LoginContext";
import { verifyContent } from "@/lib/contentFilter";

export type PostStatus = "pending" | "approved" | "rejected";

export interface Reactions {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description: string;
  images?: string[];
  status: PostStatus;
  timestamp: string;
  isAdminPost: boolean;
  reactions: Reactions;
  actionLink?: string; // Optional link for admins
  hiddenContact?: string; // Optional contact info hidden to users, visible to admins
  tippedGems?: number; // Total amount of gems gifted/tipped to this post
  giftCode?: string; // Optional gift code associated with the post
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: "visible" | "pending_middleman";
  image?: string;
  isRead?: boolean;
  postId?: string;
}

export interface MiddlemanRequest {
  id: string;
  userAId: string;
  userA_Name: string;
  userBId: string;
  userB_Name: string;
  timestamp: string;
  postId?: string;
}

interface CommunityContextType {
  posts: CommunityPost[];
  messages: ChatMessage[];
  devPinCode: string;
  isAuthenticatedDev: boolean;
  verifyDevPin: (pin: string) => boolean;
  logoutDev: () => void;
  submitPost: (post: Omit<CommunityPost, "id" | "status" | "timestamp" | "isAdminPost" | "reactions">) => void;
  publishDevPost: (post: Omit<CommunityPost, "id" | "status" | "timestamp" | "isAdminPost" | "authorId" | "authorName" | "reactions">) => void;
  approvePost: (id: string) => void;
  rejectPost: (id: string) => void;
  deletePost: (id: string) => void;
  reactToPost: (postId: string, reaction: keyof Reactions) => void;
  tipPost: (postId: string, amount: number) => void;
  sendMessage: (msg: Omit<ChatMessage, "id" | "timestamp" | "status">) => void;
  approveMessage: (id: string) => void;
  getChatHistory: (userA: string, userB: string, postId?: string) => ChatMessage[];
  markMessagesAsRead: (userA: string, userB: string, postId?: string) => void;
  middlemanRequests: MiddlemanRequest[];
  requestMiddleman: (userAId: string, userA_Name: string, userBId: string, userB_Name: string, postId?: string) => void;
  resolveMiddleman: (id: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const DEV_PIN = import.meta.env.VITE_ADMIN_PIN || "";

const RESTRICTED_REGEX = /((http|https):\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\b(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4,8}\b|\d{7,})/i;

const INITIAL_REACTIONS: Reactions = {
  like: 0,
  love: 0,
  haha: 0,
  wow: 0,
  sad: 0,
  angry: 0
};

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "post1",
    authorId: "dev",
    authorName: "AL LORD (Developer)",
    title: "مرحباً بكم في مجتمعنا الجديد",
    description: "هذا هو مكانكم الآمن لتبادل الحسابات والعروض بكل خصوصية. يرجى اتباع القوانين وعدم نشر أي روابط خارجية.",
    status: "approved",
    timestamp: new Date(Date.now() - 100000000).toISOString(),
    isAdminPost: true,
    reactions: { ...INITIAL_REACTIONS, love: 12, like: 45 },
    actionLink: "/games"
  },
  {
    id: "post2",
    authorId: "user123",
    authorName: "Ahmed Gamer",
    title: "مطلوب حساب Valorant",
    description: "أبحث عن حساب بسعر مناسب ويكون به سكنات Vandal حصرية.",
    status: "approved",
    timestamp: new Date(Date.now() - 50000000).toISOString(),
    isAdminPost: false,
    reactions: { ...INITIAL_REACTIONS, like: 8 },
    hiddenContact: "01000000000"
  }
];

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [middlemanRequests, setMiddlemanRequests] = useState<MiddlemanRequest[]>([]);
  const [isAuthenticatedDev, setIsAuthenticatedDev] = useState(false);

  useEffect(() => {
    const storedPosts = localStorage.getItem("community_posts");
    const storedAuth = sessionStorage.getItem("dev_authenticated");
    const storedMessages = localStorage.getItem("community_messages");
    const storedRequests = localStorage.getItem("community_requests");

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(MOCK_POSTS);
    }

    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    if (storedRequests) {
      setMiddlemanRequests(JSON.parse(storedRequests));
    }

    if (storedAuth === "true") {
      setIsAuthenticatedDev(true);
    }
  }, []);

  useEffect(() => {
    try {
      if (posts.length > 0) {
        localStorage.setItem("community_posts", JSON.stringify(posts));
      }
    } catch (e) {
      console.error("Failed to save posts to localStorage:", e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem("community_messages", JSON.stringify(messages));
      }
    } catch (e) {
      console.error("Failed to save messages to localStorage:", e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      if (middlemanRequests.length > 0) {
        localStorage.setItem("community_requests", JSON.stringify(middlemanRequests));
      }
    } catch (e) {
      console.error("Failed to save requests to localStorage:", e);
    }
  }, [middlemanRequests]);

  const verifyDevPin = (pin: string) => {
    if (pin === DEV_PIN) {
      setIsAuthenticatedDev(true);
      sessionStorage.setItem("dev_authenticated", "true");
      return true;
    }
    return false;
  };

  const logoutDev = () => {
    setIsAuthenticatedDev(false);
    sessionStorage.removeItem("dev_authenticated");
  };

  const submitPost = (post: Omit<CommunityPost, "id" | "status" | "timestamp" | "isAdminPost" | "reactions">) => {
    // Content Filter Check
    const filterTitle = verifyContent(post.title, false);
    const filterDesc = verifyContent(post.description, false);
    
    if (!filterTitle.isClean || !filterDesc.isClean) {
      const filter = !filterTitle.isClean ? filterTitle : filterDesc;
      if (filter.type === 'profanity' || filter.type === 'religion') {
        alert("يرجى الالتزام بالقواعد وعدم استخدام ألفاظ غير لائقة.");
        return;
      }
    }

    const newPost: CommunityPost = {
      ...post,
      id: Math.random().toString(36).substring(2, 9),
      status: "pending",
      timestamp: new Date().toISOString(),
      isAdminPost: false,
      reactions: { ...INITIAL_REACTIONS }
    };
    setPosts([newPost, ...posts]);
  };

  const publishDevPost = (post: Omit<CommunityPost, "id" | "status" | "timestamp" | "isAdminPost" | "authorId" | "authorName" | "reactions">) => {
    if (!isAuthenticatedDev) return;

    // Internal safety: Content Filter Check
    const filterTitle = verifyContent(post.title, false);
    const filterDesc = verifyContent(post.description, false);
    if (!filterTitle.isClean || !filterDesc.isClean) {
       console.warn("Dev post contains restricted content, but publishing anyway in Sudo mode.");
    }

    const newPost: CommunityPost = {
      ...post,
      id: Math.random().toString(36).substring(2, 9),
      authorId: "dev",
      authorName: "AL LORD (Developer)",
      status: "approved",
      timestamp: new Date().toISOString(),
      isAdminPost: true,
      reactions: { ...INITIAL_REACTIONS }
    };
    setPosts([newPost, ...posts]);
  };

  const approvePost = (id: string) => {
    if (!isAuthenticatedDev) return;
    setPosts(posts.map(p => p.id === id ? { ...p, status: "approved" } : p));
  };

  const rejectPost = (id: string) => {
    if (!isAuthenticatedDev) return;
    setPosts(posts.filter(p => p.id !== id));
  };

  const deletePost = (id: string) => {
    if (!isAuthenticatedDev) return;
    setPosts(posts.filter(p => p.id !== id));
  };

  const reactToPost = (postId: string, reaction: keyof Reactions) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const currentReactions = p.reactions || { ...INITIAL_REACTIONS };
        return {
          ...p,
          reactions: {
            ...currentReactions,
            [reaction]: (currentReactions[reaction] || 0) + 1
          }
        };
      }
      return p;
    }));
  };

  const tipPost = (postId: string, amount: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          tippedGems: (p.tippedGems || 0) + amount
        };
      }
      return p;
    }));
  };

  const sendMessage = (msg: Omit<ChatMessage, "id" | "timestamp" | "status">) => {
    const filter = verifyContent(msg.text);
    
    // Hard block for profanity/religion
    if (!filter.isClean && (filter.type === 'profanity' || filter.type === 'religion')) {
      return; 
    }

    const hasRestrictedContent = filter.type === 'restricted';
    const newMsg: ChatMessage = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      status: hasRestrictedContent ? "pending_middleman" : "visible",
    };
    setMessages([...messages, newMsg]);
  };

  const approveMessage = (id: string) => {
    if (!isAuthenticatedDev) return;
    setMessages(messages.map(m => m.id === id ? { ...m, status: "visible" } : m));
  };

  const getChatHistory = (userA: string, userB: string, postId?: string) => {
    return messages.filter(m => {
      const isParticipants = (m.senderId === userA && m.receiverId === userB) || (m.senderId === userB && m.receiverId === userA);
      const isSamePost = postId ? m.postId === postId : true;
      return isParticipants && isSamePost;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const markMessagesAsRead = (currentUser: string, otherUser: string, postId?: string) => {
    setMessages(prev => prev.map(m => {
      if (m.senderId === otherUser && m.receiverId === currentUser && !m.isRead) {
        if (!postId || m.postId === postId) {
          return { ...m, isRead: true };
        }
      }
      return m;
    }));
  };

  const requestMiddleman = (userAId: string, userA_Name: string, userBId: string, userB_Name: string, postId?: string) => {
    if (middlemanRequests.some(r => 
        (r.userAId === userAId && r.userBId === userBId) || (r.userAId === userBId && r.userBId === userAId)
    )) {
      return;
    }
    const newReq: MiddlemanRequest = {
      id: Math.random().toString(36).substring(2, 9),
      userAId,
      userA_Name,
      userBId,
      userB_Name,
      timestamp: new Date().toISOString(),
      postId
    };
    setMiddlemanRequests([...middlemanRequests, newReq]);
  };

  const resolveMiddleman = (id: string) => {
    if (!isAuthenticatedDev) return;
    setMiddlemanRequests(middlemanRequests.filter(r => r.id !== id));
  };

  return (
    <CommunityContext.Provider value={{
      posts,
      messages,
      devPinCode: DEV_PIN,
      isAuthenticatedDev,
      verifyDevPin,
      logoutDev,
      submitPost,
      publishDevPost,
      approvePost,
      rejectPost,
      deletePost,
      reactToPost,
      tipPost,
      sendMessage,
      approveMessage,
      getChatHistory,
      markMessagesAsRead,
      middlemanRequests,
      requestMiddleman,
      resolveMiddleman
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
}
