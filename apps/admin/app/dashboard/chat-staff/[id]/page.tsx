"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardContent } from "@repo/ui/card";

import { useAuth } from "@/Context/useAuth";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import {
  ChatGetConversationAPI,
  ChatMarkAsReadAPI,
} from "@/Services/ChatService";

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

export default function ChatStaffConversationPage() {
  const { id } = useParams(); // staff email from route
  const { user } = useAuth();

  const staffEmail = decodeURIComponent(id as string);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  /* ---------------- Load conversation ---------------- */
  useEffect(() => {
    if (!user?.emailAddress || !staffEmail) return;

    const fetchMessages = async () => {
      const res = await ChatGetConversationAPI(user.emailAddress, staffEmail);
      if (!res?.data) return;

      const formatted = res.data.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        read: msg.read,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setMessages(formatted);

      // Mark unread staff messages as read
      await Promise.all(
        formatted
          .filter((m) => m.sender === staffEmail && !m.read)
          .map((m) => ChatMarkAsReadAPI(m.id)),
      );
    };

    fetchMessages();
  }, [user?.emailAddress, staffEmail]);

  /* ---------------- WebSocket ---------------- */
  useEffect(() => {
    if (!user?.emailAddress || !staffEmail) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8085/ws") as any,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/private.${user.emailAddress}`, async (frame) => {
        if (!frame.body) return;

        const msg = JSON.parse(frame.body);

        if (msg.sender === staffEmail) {
          await ChatMarkAsReadAPI(msg.id);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [user?.emailAddress, staffEmail]);

  /* ---------------- Send message ---------------- */
  const handleSendMessage = () => {
    if (!message.trim() || !stompClientRef.current || !user?.emailAddress)
      return;

    stompClientRef.current.publish({
      destination: "/app/private",
      body: JSON.stringify({
        sender: user.emailAddress, // admin
        receiver: staffEmail, // staff
        content: message,
      }),
    });

    setMessage("");
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="mx-auto max-w-4xl space-y-6 mt-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/chat-staff">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Chat with Staff</h1>
          <p className="text-sm text-muted-foreground">{staffEmail}</p>
        </div>
      </div>

      {/* Chat */}
      <Card className="flex h-150 flex-col">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === user?.emailAddress;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm lg:max-w-md
                    ${
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                >
                  <p>{msg.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message…"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
