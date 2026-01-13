"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useAuth } from "@/Context/useAuth";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatGetGroupMessagesAPI } from "@/Services/ChatService";
import { useParams } from "next/navigation";

interface GroupMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export default function GroupChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const groupId = params.id as string;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  // FETCH GROUP MESSAGE HISTORY
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await ChatGetGroupMessagesAPI(groupId);
        if (response?.data) {
          setMessages(
            response.data.map((msg: any) => ({
              id: msg.id,
              sender: msg.sender,
              content: msg.content,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching group messages:", error);
      }
    };

    fetchMessages();
  }, [groupId]);

  // CONNECT TO WEBSOCKET
  useEffect(() => {
    const socket = new SockJS("http://localhost:8085/ws");
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 4000,
      debug: console.log,
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to group
      client.subscribe(`/topic/group.${groupId}`, (msg) => {
        if (!msg.body) return;

        const data = JSON.parse(msg.body);

        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            sender: data.sender,
            content: data.content,
            timestamp: new Date(data.createdAt).toLocaleTimeString([], {
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
  }, [groupId]);

  // SEND GROUP MESSAGE
  const handleSendMessage = () => {
    if (!message.trim() || !user?.email) return;

    const payload = {
      sender: user.email,
      groupId: Number(groupId),
      content: message,
    };

    stompClientRef.current?.publish({
      destination: "/app/group",
      body: JSON.stringify(payload),
    });

    setMessage("");
  };

  return (
    <div className="mx-auto max-w-4xl text-foreground">
      {/* HEADER */}
      <div className="mb-6 flex items-center space-x-4">
        <Link href="/dashboard/chat">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Group Chat — {groupId}</h1>
      </div>

      {/* CHAT BOX */}
      <Card className="flex h-150 flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const mine = msg.sender === user?.email;
            return (
              <div
                key={msg.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                    mine
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {!mine && (
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">
                      {msg.sender}
                    </p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      mine ? "text-accent-muted" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>

        {/* INPUT BOX */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="w-16">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
