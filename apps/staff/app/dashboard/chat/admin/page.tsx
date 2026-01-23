"use client";

import { useState, useEffect, useRef } from "react";
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
import { adminGetAPI } from "@/Services/AdminService";

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

export default function ChatConversationPage() {
  const { user } = useAuth();

  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  /* ---------------- Load admin email ---------------- */
  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await adminGetAPI();
      if (!res?.data || res.data.length === 0) return;

      // Assuming first admin in the list
      setAdminEmail(res.data[0].email);
    };

    fetchAdmin();
  }, []);

  /* ---------------- Load conversation ---------------- */
  useEffect(() => {
    if (!user?.email || !adminEmail) return;

    const fetchMessages = async () => {
      const res = await ChatGetConversationAPI(user.email, adminEmail);
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

      // Mark unread admin messages as read
      await Promise.all(
        formatted
          .filter((m) => m.sender === adminEmail && !m.read)
          .map((m) => ChatMarkAsReadAPI(m.id)),
      );
    };

    fetchMessages();
  }, [user?.email, adminEmail]);

  /* ---------------- WebSocket ---------------- */
  useEffect(() => {
    if (!user?.email || !adminEmail) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8085/ws") as any,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/user/${user.email}/private`, async (frame) => {
        if (!frame.body) return;

        const msg = JSON.parse(frame.body);

        if (msg.sender === adminEmail) {
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
  }, [user?.email, adminEmail]);

  /* ---------------- Send message ---------------- */
  const handleSendMessage = () => {
    if (
      !message.trim() ||
      !stompClientRef.current ||
      !user?.email ||
      !adminEmail
    )
      return;

    stompClientRef.current.publish({
      destination: "/app/private",
      body: JSON.stringify({
        sender: user.email,
        receiver: adminEmail,
        content: message,
      }),
    });

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: user.email,
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/chat">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Chat with Admin</h1>
          <p className="text-sm text-muted-foreground">
            {adminEmail || "Loading admin..."}
          </p>
        </div>
      </div>

      {/* Chat */}
      <Card className="flex h-150 flex-col">
        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === user?.email;

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
              disabled={!adminEmail}
            />
            <Button onClick={handleSendMessage} disabled={!adminEmail}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
