"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  ConnectWalletText,
} from "@coinbase/onchainkit/wallet";
import Image from "next/image";
import { sdk } from '@farcaster/frame-sdk';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

export function TodoList() {
  const { address } = useAccount();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [fcUser, setFcUser] = useState<FarcasterUser | null>(null);

  useEffect(() => {
    // Get user info from Farcaster Mini App SDK
    const getUserInfo = async () => {
      try {
        const context = await sdk.context;
        console.log("Full Farcaster context:", context);
        if (context?.user) {
          console.log("Farcaster user data:", context.user);
          // Log all properties of the user object
          Object.keys(context.user as Record<string, unknown>).forEach(key => {
            console.log(`${key}:`, (context.user as Record<string, unknown>)[key]);
          });
          setFcUser(context.user);
        } else {
          console.log("No Farcaster user data available");
        }
      } catch (error) {
        console.error("Error getting Farcaster user data:", error);
      }
    };
    getUserInfo();
  }, []);

  console.log("Current address:", address);
  console.log("Farcaster user:", fcUser);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Todo List</h1>
        <div className="flex items-center space-x-2">
          {address ? (
            <div className="flex items-center space-x-2 bg-[var(--card-bg)] p-2 rounded-lg border border-[var(--border-color)]">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {fcUser?.pfpUrl ? (
                  <Image 
                    src={fcUser.pfpUrl} 
                    alt={fcUser.username || "User"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {address.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">
                  {fcUser?.displayName || fcUser?.username || "Connected"}
                </span>
                <span className="text-xs text-gray-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
            </div>
          ) : (
            <ConnectWallet>
              <ConnectWalletText className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                Connect Wallet
              </ConnectWalletText>
            </ConnectWallet>
          )}
        </div>
      </div>

      <form onSubmit={addTodo} className="mb-8">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--accent)] rounded focus:ring-[var(--accent)]"
              />
              <span
                className={`text-white ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 