import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, MessageSquare, Play, Pause, Plus, Flame, Vote, Sparkles,
  Smile, ShieldAlert, CheckCircle2, Bot
} from 'lucide-react';
import { Avatar2D } from '../Avatar2D';
import { AvatarType, Role } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import { networkHub, NetworkMessage } from '../../utils/networkSync';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: AvatarType;
  role?: Role;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

interface VirtualPhone {
  id: string;
  name: string;
  avatar: AvatarType;
  isHost: boolean;
  role: Role;
  secretWord: string;
  categoryName: string;
}

interface GroupDiscussionChatProps {
  activePhone: VirtualPhone;
  phones: VirtualPhone[];
  categoryName: string;
  secretWord: string;
  roundNumber: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleRun: () => void;
  onAddSeconds: (sec: number) => void;
  onOpenVoting: () => void;
}

const QUICK_CHIPS = [
  "👀 Who is acting sus?",
  "🤫 I'm 100% innocent!",
  "💡 My clue: It's very common",
  "🤔 What's your clue?",
  "🚨 Vote the imposter!",
  "🤐 Don't give it away!"
];

export const GroupDiscussionChat: React.FC<GroupDiscussionChatProps> = ({
  activePhone,
  phones,
  categoryName,
  secretWord,
  roundNumber,
  timerSeconds,
  isTimerRunning,
  onToggleRun,
  onAddSeconds,
  onOpenVoting
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'msg_sys_1',
        senderId: 'system',
        senderName: 'Game Master',
        avatar: 'fox',
        isSystem: true,
        text: `Discussion started! Category: ${categoryName}. Share subtle clues and find the Imposter!`,
        timestamp: timeNow
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to real network chat packets
  useEffect(() => {
    const unsubscribe = networkHub.subscribe((msg: NetworkMessage) => {
      if (msg.type === 'CHAT_MESSAGE' && msg.payload?.chatMsg) {
        const incoming = msg.payload.chatMsg as ChatMessage;
        setMessages(prev => {
          if (prev.some(m => m.id === incoming.id)) return prev;
          return [...prev, incoming];
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!content) return;

    soundEffects.playTap();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${activePhone.id}_${Date.now()}`,
      senderId: activePhone.id,
      senderName: activePhone.name,
      avatar: activePhone.avatar,
      role: activePhone.role,
      text: content,
      timestamp: timeNow
    };

    setMessages(prev => [...prev, newMsg]);
    if (textToSend === undefined) {
      setInputText('');
    }

    // Broadcast message over Wi-Fi / Hotspot to all connected players
    networkHub.sendMessage({
      type: 'CHAT_MESSAGE',
      senderId: activePhone.id,
      senderName: activePhone.name,
      senderAvatar: activePhone.avatar,
      roomCode: networkHub.getRoomCode(),
      payload: { chatMsg: newMsg }
    });
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = timerSeconds <= 20;

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0D1117]">
      {/* Compact Top Discussion & Timer Bar */}
      <div className="bg-[#161B22] border border-slate-800/80 rounded-2xl p-2.5 mb-2.5 shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-100">Group Chat</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {categoryName}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              Active: <span className="font-bold text-cyan-300">{activePhone.name}</span>
            </span>
          </div>
        </div>

        {/* Compact Timer Pill & Controls */}
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-mono text-xs font-black border transition-all ${
              isWarning
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-slate-900 text-cyan-300 border-slate-700'
            }`}
          >
            {isWarning && <Flame className="w-3.5 h-3.5 text-rose-400" />}
            <span>{formattedTime}</span>
          </div>

          <button
            id="btn-chat-toggle-timer"
            onClick={() => {
              soundEffects.playTap();
              onToggleRun();
            }}
            className={`p-1.5 rounded-xl border text-xs transition-colors ${
              isTimerRunning
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
            }`}
            title={isTimerRunning ? "Pause timer" : "Resume timer"}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            id="btn-chat-add-time"
            onClick={() => {
              soundEffects.playTap();
              onAddSeconds(30);
            }}
            className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-0.5"
            title="Add 30 seconds"
          >
            <Plus className="w-3 h-3" />
            30s
          </button>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-1.5">
                <div className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-[10px] font-medium text-cyan-300/90 text-center max-w-[90%] shadow-sm">
                  📢 {msg.text}
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === activePhone.id;

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.18 }}
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="shrink-0 mb-0.5">
                <Avatar2D avatarType={msg.avatar} size={28} />
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-0.5 px-1">
                  <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                    {msg.senderName}
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>

                <div
                  className={`px-3 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-md ${
                    isMe
                      ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-br-xs border border-cyan-400/30 font-medium'
                      : 'bg-[#161B22] border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="pt-2 pb-1 shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#161B22] hover:bg-[#21262D] border border-slate-800 hover:border-slate-700 text-[10px] font-medium text-slate-300 transition-colors shadow-xs active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Bar */}
      <div className="pt-1 pb-1 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <div className="relative flex-1">
            <input
              id="input-chat-discussion"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message as ${activePhone.name}...`}
              maxLength={120}
              className="w-full pl-3 pr-8 py-2.5 bg-[#161B22] border border-slate-800 focus:border-cyan-400 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
            />
          </div>

          <button
            id="btn-chat-send"
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-500/20 active:scale-95'
                : 'bg-[#161B22] text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Action CTA to Voting */}
      <div className="pt-2 shrink-0">
        {activePhone.isHost ? (
          <button
            id="btn-network-call-vote"
            onClick={() => {
              soundEffects.playTap();
              onOpenVoting();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-slate-100 font-black text-xs tracking-wider uppercase shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Vote className="w-4 h-4" />
            OPEN VOTING PHASE
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-2">
            <Vote className="w-3.5 h-3.5" />
            WAITING FOR HOST TO OPEN VOTING
          </div>
        )}
      </div>
    </div>
  );
};
