"use client"
import { lazy } from 'react';

const TodoList = lazy(() => import('@/components/TodoList'))

export default function Home() {
  return (
    <div className="bg-[#e4e7f1] p-4 w-full min-h-screen">
      <TodoList />
    </div>
  );
}
