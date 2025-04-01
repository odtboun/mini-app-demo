"use client";

import { TodoList } from "./components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto py-12">
        <TodoList />
      </div>
    </main>
  );
}
