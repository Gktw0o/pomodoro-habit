import { Users, Search, Loader2, Newspaper, UserPlus, Bell, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { format } from "date-fns";

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  first_name: string;
  last_name: string;
}

interface Post {
  id: string;
  content: string;
  user: User;
  created_at: string;
}

interface FriendRequest {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
  user: User; // The sender
}

export function MobileSocialView() {
  const [activeTab, setActiveTab] = useState<'feed' | 'search' | 'requests'>('feed');
  const [loading, setLoading] = useState(false);
  
  // Feed State
  const [posts, setPosts] = useState<Post[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // Requests State
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await api.get('/posts/feed');
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.get('/friends/requests');
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await api.get(`/users/search?q=${searchQuery}`);
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await api.post(`/friends/request/${userId}`, {});
      alert("Friend request sent!");
    } catch (error) {
      alert("Failed to send request.");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.post(`/friends/accept/${requestId}`, {});
      // Refresh requests
      fetchRequests();
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.post(`/friends/reject/${requestId}`, {});
      // Refresh requests
      fetchRequests();
    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject request");
    }
  };

  useEffect(() => {
    if (activeTab === 'feed') {
      fetchFeed();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-black pb-20">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="text-indigo-500" />
            Social
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'feed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          Activity Feed
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          Find Friends
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          Requests
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {activeTab === 'feed' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 overflow-hidden">
                      {post.user.avatar_url ? <img src={post.user.avatar_url} className="w-full h-full object-cover"/> : post.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{post.user.username}</p>
                      <p className="text-xs text-zinc-500">{format(new Date(post.created_at), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <Newspaper className="opacity-50" size={32} />
                </div>
                <p className="font-medium">No updates yet</p>
                <p className="text-sm mt-1 opacity-70">Add friends to see their activity!</p>
              </div>
            )}
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-base outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="space-y-3">
              {loading ? (
                 <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300 overflow-hidden">
                         {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover"/> : user.username[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate w-40">{user.username}</p>
                        <p className="text-xs text-zinc-500 truncate w-40">{user.first_name} {user.last_name}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                      title="Add Friend"
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                ))
              ) : searchQuery && (
                <div className="text-center text-zinc-500 py-8">No users found.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
             {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
             ) : requests.length > 0 ? (
                requests.map(request => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300 overflow-hidden">
                         {request.user.avatar_url ? <img src={request.user.avatar_url} className="w-full h-full object-cover"/> : request.user.username[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate w-40">{request.user.username}</p>
                        <p className="text-xs text-zinc-500 truncate w-40">wants to be friends</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="p-2 text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                        title="Accept"
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))
             ) : (
                <div className="text-center text-zinc-500 py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <Bell className="opacity-50" size={32} />
                    </div>
                    <p className="font-medium">No pending requests</p>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
