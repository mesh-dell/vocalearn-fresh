"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

export default function JoinGroupPage() {
  const router = useRouter();
  const [groupId, setGroupId] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId.trim()) return;
    router.push(`/dashboard/group-chat/${groupId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 text-foreground">
      <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          Join a Group Chat
        </h1>

        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            type="number"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="Enter Group ID"
          />

          <Button type="submit" className="w-full">
            Join Group
          </Button>
        </form>
      </div>
    </div>
  );
}
