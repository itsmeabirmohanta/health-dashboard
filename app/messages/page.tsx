"use client";

import React, { useState } from 'react';
import { MessageSquare, Send, Search, UserCircle, Paperclip, Smile } from 'lucide-react';

// Mock data - replace with actual data fetching and state management
const mockConversations = [
  { id: '1', name: 'Dr. Emily Carter', lastMessage: 'Your test results are in...', timestamp: '10:30 AM', unread: 2, avatar: '/avatars/dr-carter.jpg' }, // Placeholder avatar
  { id: '2', name: 'Support Team', lastMessage: 'We\'ve updated our terms of service.', timestamp: 'Yesterday', unread: 0, avatar: '/avatars/support.png' },
  { id: '3', name: 'Health Bot', lastMessage: 'Remember to log your meals today!', timestamp: 'Mon', unread: 1, avatar: '/avatars/bot.png' },
];

const mockMessages = {
  '1': [
    { id: 'm1', sender: 'Dr. Emily Carter', text: 'Hello! Your recent lab results look good overall.', time: '10:25 AM', self: false },
    { id: 'm2', sender: 'Dr. Emily Carter', text: 'There are a couple of minor things I\'d like to discuss. Are you free for a quick call later today?', time: '10:26 AM', self: false },
    { id: 'm3', sender: 'You', text: 'Hi Dr. Carter, thanks for the update. Yes, I should be free after 3 PM.', time: '10:28 AM', self: true },
    { id: 'm4', sender: 'Dr. Emily Carter', text: 'Excellent. I\'ll call you around 3:15 PM.', time: '10:30 AM', self: false },
  ],
  '2': [
    { id: 'm5', sender: 'Support Team', text: 'We\'ve updated our terms of service. Please review them at your earliest convenience.', time: 'Yesterday', self: false },
  ],
  '3': [
    { id: 'm6', sender: 'Health Bot', text: 'Good morning! Remember to log your meals today for accurate tracking.', time: 'Mon', self: false },
    { id: 'm7', sender: 'You', text: 'Okay, will do!', time: 'Mon', self: true },
  ]
};

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const currentMessages = selectedConversationId ? mockMessages[selectedConversationId as keyof typeof mockMessages] : [];
  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;
    console.log(`Sending message to ${selectedConversation?.name}: ${newMessage}`);
    // In a real app, you would add the message to the state and send it to a backend
    // For this mock, we'll just log it and clear the input
    alert(`Message sent (mock): "${newMessage}"`);
    setNewMessage('');
  };

  const filteredConversations = mockConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-10rem)] container mx-auto my-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
      {/* Sidebar for conversations */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-7 h-7 mr-2 text-primary-500" /> Messages
          </h1>
          <div className="relative mt-4">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-grow">
          {filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700/30 transition-colors 
                          ${selectedConversationId === conv.id ? 'bg-primary-50 dark:bg-primary-700/20' : ''}`}
              onClick={() => setSelectedConversationId(conv.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* Basic Avatar Placeholder */}
                  <div className={`w-10 h-10 rounded-full ${conv.avatar ? 'bg-cover bg-center' : 'bg-gray-300 dark:bg-gray-600 flex items-center justify-center'}`} style={conv.avatar ? {backgroundImage: `url(${conv.avatar})`} : {}}>
                    {!conv.avatar && <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-semibold ${selectedConversationId === conv.id ? 'text-primary-600 dark:text-primary-300' : 'text-gray-800 dark:text-white'}`}>{conv.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${selectedConversationId === conv.id ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>{conv.timestamp}</p>
                  {conv.unread > 0 && 
                    <span className="mt-1 inline-block bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{conv.unread}</span>
                  }
                </div>
              </div>
            </div>
          ))}
          {filteredConversations.length === 0 && (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">No conversations found.</p>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${selectedConversation.avatar ? 'bg-cover bg-center' : 'bg-gray-300 dark:bg-gray-600 flex items-center justify-center'}`} style={selectedConversation.avatar ? {backgroundImage: `url(${selectedConversation.avatar})`} : {}}>
                  {!selectedConversation.avatar && <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">{selectedConversation.name}</h2>
              </div>
              {/* Add actions like call, info etc. here */}
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {currentMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl shadow ${msg.self ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                    {!msg.self && <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-0.5">{msg.sender}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.self ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'} text-right`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {currentMessages.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400">No messages in this conversation yet.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button type="button" className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder={`Message ${selectedConversation.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
                <button type="button" className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button 
                  type="submit" 
                  className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-6">
            <MessageSquare className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-medium mb-1">Select a conversation</h2>
            <p className="max-w-xs">Choose one of your existing conversations or start a new one to begin messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
} 