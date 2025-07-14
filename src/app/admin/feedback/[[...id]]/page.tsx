"use client";

import { useRef, useEffect, ChangeEvent, RefObject, MouseEvent, useState } from "react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { MongoMessage } from "@/models";
import { getFeedbackChatService } from "@/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatListSkeleton } from "@/components/chat-list-skeleton";
import { CodeDisplayBlock } from "@/components/code-display-block";

export default function FeedbackPage({ params }: {
  params: {
    id: string
  }
}) {
  const chatParamId = params.id?.[0];
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MongoMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userName = 'User';

  useEffect(() => {
    if (chatParamId) {
      setIsLoading(true);
      getFeedbackChatService(chatParamId)
        .then(data => setMessages(data.messages))
        .finally(() => setIsLoading(false));
    }
  }, [])

  return (
    isLoading ?
      <ChatListSkeleton />
      : <div
        id="scroller"
        className="overflow-y-scroll overflow-x-hidden h-full justify-end"
      >
        <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.role === "user" && (
                  <div className="flex items-end gap-3">
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {message.content}
                    </span>
                    <Avatar className="flex justify-start items-center rounded-full border">
                      <AvatarImage
                        src="/"
                        alt="user"
                        width={6}
                        height={6}
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="relative group/feedback">
                    <div className="flex items-end gap-2">
                      <Avatar className="flex justify-start items-center rounded-full border">
                        <AvatarImage
                          src="/drive-assist-logo.png"
                          alt="AI"
                          width={6}
                          height={6}
                          className="object-contain"
                        />
                      </Avatar>
                      <span className={cn(
                        {
                          ["text-green-600"]:
                            message.data?.feedback === true,
                          ["text-red-700"]:
                            message.data?.feedback === false,
                        },
                        "bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto"
                      )}
                      >
                        {/* Check if the message content contains a code block */}
                        {message.content.split("```").map((part, mIndex) => {
                          if (mIndex % 2 === 0) {
                            return (
                              <Markdown key={mIndex} remarkPlugins={[remarkGfm]}>
                                {part}
                              </Markdown>
                            );
                          } else {
                            return (
                              <pre className="whitespace-pre-wrap" key={mIndex}>
                                <CodeDisplayBlock code={part} lang="" />
                              </pre>
                            );
                          }
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div id="anchor" ref={bottomRef}></div>
      </div>
  );
}
