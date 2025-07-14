"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { Types } from 'mongoose';

import { MongoMessage } from "@/models";
import { ChatBottombar } from "@/components/chat/chat-bottombar";
import { ChatTopbar } from "@/components/chat/chat-topbar";
import { ChatList } from "@/components/chat/chat-list";
import { createChatDataService, createMessageDataService, getChatDataService } from "@/services";

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const chatParamId = params.id?.[0];
  const [chatId, setChatId] = useState<string>(chatParamId);
  const formRef = useRef<HTMLFormElement>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const {
    messages,
    input,
    isLoading,
    error,
    stop,
    handleSubmit,
    handleInputChange,
    setMessages,
  } = useChat({
    key: 'drive-assist',
    api: '/api/ai',
    headers: {
      'User-Id': 'UserId',
    },
    generateId: () => new Types.ObjectId().toString(),
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
      }
    },
    onFinish: async (message) => {
      if (chatId) {
        createMessageDataService(chatId, {
          id: message.id,
          role: message.role,
          content: message.content,
          annotations: message.annotations,
        })
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      toast.error(`An error occurred. ${error.message}`);
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessages([...messages]);
    if (chatId) {
      createMessageDataService(chatId, {
        id: new Types.ObjectId().toString(),
        role: 'user',
        content: input
      })
    }
    handleSubmit(e);
  };

  useEffect(() => {
    if (!isLoading && !error && !chatId && messages.length) {
      const mongoMessages = messages.map(item => ({
        role: item.role,
        content: item.content,
      }));
      createChatDataService(mongoMessages)
        .then(data => {
          window.dispatchEvent(new Event("storage"));
          setChatId(data.id);
        });

    }
  }, [isLoading, chatId, error, messages]);

  useEffect(() => {
    if (chatId) {
      setChatLoading(true);
      getChatDataService(chatId)
        .then(data => setMessages(data.messages))
        .catch(() => router.replace('/'))
        .finally(() => setChatLoading(false));
    }
  }, []);

  return (
    <div className="flex flex-col justify-between w-full max-w-3xl h-full ">
      <ChatTopbar />

      <ChatList
        messages={messages as MongoMessage[]}
        isLoading={isLoading}
        chatLoading={chatLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        formRef={formRef}
        setMessages={setMessages}
        handleInputChange={handleInputChange}
      />

      <ChatBottombar
        input={input}
        isLoading={isLoading}
        formRef={formRef}
        handleStop={stop}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
      />
    </div>
  );
}
