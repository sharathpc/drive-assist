"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { getFeedbackChatsService } from "@/services";
import { Loader } from "@/components/ui/loader";
import { Chat } from "@/models";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackChats, setFeedbackChats] = useState<Chat[]>([]);

  useEffect(() => {
    setLoading(true);
    getFeedbackChatsService()
      .then(data => setFeedbackChats(data))
      .finally(() => setLoading(false));
  }, [])

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex justify-between items-center bg-background sticky top-0 px-2 mb-4">
        <div className="text-xl font-bold">Feedback</div>
      </div>
      {loading ?
        <Loader
          className="h-80"
          width={2}
          height={2}
          fullScreen={false}
        /> :
        <div className="flex h-[calc(100dvh-5rem)]">
          <div className="flex flex-col gap-2 w-1/4 pr-4 border-r-2">
            <div className="flex w-full justify-between items-center">
              <p className="text-sm text-muted-foreground">Chats List</p>
            </div>
            <div>
              {feedbackChats.map(data => (
                <Link
                  key={data.id}
                  href={`/admin/feedback/${data.id}`}
                  className={cn(
                    {
                      [buttonVariants({ variant: "outline" })]:
                        `/admin/feedback/${data.id}` === pathname,
                      [buttonVariants({ variant: "ghost" })]:
                        `/admin/feedback/${data.id}` !== pathname,
                    },
                    "flex justify-between w-full h-14 text-base font-normal items-center px-4 my-2"
                  )}
                >
                  <div className="flex items-center truncate">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {data.messages[0].content}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {new Date(data.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="w-full max-w-3xl">
              {children}
            </div>
          </div>
        </div>}
    </div>
  );
}