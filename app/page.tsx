"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { TodoList } from "./components/TodoList";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto py-12">
        <TodoList />
      </div>
    </main>
  );
}
