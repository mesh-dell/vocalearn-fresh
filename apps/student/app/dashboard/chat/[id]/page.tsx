"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardContent } from "@repo/ui/card";
import { useAuth } from "@/Context/useAuth";
import {
  ChatGetConversationAPI,
  ChatMarkAsReadAPI,
} from "@/Services/ChatService";

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatConversationPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const instructorEmail = decodeURIComponent(id as string);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const stompClientRef = useRef<Client | null>(null);

  /* ---------------- Load conversation ---------------- */

  useEffect(() => {
    if (!user?.email) return;

    const loadConversation = async () => {
      try {
        const res = await ChatGetConversationAPI(user.email, instructorEmail);

        if (!res?.data) return;

        setMessages(
          res.data.map((msg) => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          })),
        );

        const unread = res.data.filter(
          (msg) => msg.sender === instructorEmail && !msg.read,
        );

        await Promise.all(unread.map((m) => ChatMarkAsReadAPI(m.id)));
      } catch (err) {
        console.error("Failed to load conversation:", err);
      }
    };

    loadConversation();
  }, [user?.email, instructorEmail]);

  /* ---------------- WebSocket ---------------- */

  useEffect(() => {
    if (!user?.email) return;

    const socket = new SockJS("http://localhost:8085/ws");
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/private.${user.email}`, (frame) => {
        if (!frame.body) return;

        const msg = JSON.parse(frame.body);

        setMessages((prev) => [
          ...prev,
          {
            id: msg.id ?? Date.now(),
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
  }, [user?.email]);

  /* ---------------- Send message ---------------- */

  const sendMessage = () => {
    if (!message.trim() || !user?.email) return;

    stompClientRef.current?.publish({
      destination: "/app/private",
      body: JSON.stringify({
        sender: user.email,
        receiver: instructorEmail,
        content: message,
      }),
    });

    setMessage("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <header className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/chat">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <h1 className="text-2xl font-bold text-foreground">
          Chat with {instructorEmail}
        </h1>
      </header>

      {/* Chat Box */}
      <Card className="flex h-150 flex-col">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((msg) => {
            const mine = msg.sender === user?.email;

            return (
              <div
                key={msg.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
