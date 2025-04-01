"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  Avatar,
} from "@coinbase/onchainkit/identity";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const { address } = useAccount();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  console.log("Current address:", address);

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
            <Wallet>
              <WalletDropdown>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {address.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <Identity address={address}>
                      <Name className="text-white" />
                    </Identity>
                  </div>
                </div>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          ) : (
            <ConnectWallet>
              <ConnectWalletText>Connect Wallet</ConnectWalletText>
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