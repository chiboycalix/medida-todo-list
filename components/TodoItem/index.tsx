"use client"
import Image from 'next/image';
import dynamic from 'next/dynamic'
import React, { useState } from 'react';
import EditIcon from "@/assets/Images/editIcon.png"
import DeleteIcon from "@/assets/Images/deleteIcon.png"
import Modal from '../Modal';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Todo } from '@/types/Todo';

const UpdateTodo = dynamic(() => import('@/components/UpdateTodo'))
const DeleteConfirmationModal = dynamic(() => import('@/components/DeleteConfirmationModal'))

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false)

  const deleteTodo = async () => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  return (
    <div className='flex items-center justify-between shadow-[0_0_9.36px_0_#E5E5E5] p-4 rounded-2xl mb-6'>
      <div>
        <p className='mb-1'>{todo.title}</p>
        <Badge
          className={cn('py-1 rounded-lg capitalize',
            todo.priority === "high" && "bg-[#FCEEF5] text-[#571032]",
            todo.priority === "medium" && "bg-[#F8F2F4] text-[#B07289]",
            todo.priority === "low" && "bg-green-100 text-green-700")}>
          {todo.priority}
        </Badge>
      </div>
      <div className='flex items-center gap-4'>
        <Image src={EditIcon} loading="lazy" alt="EditIcon" className='w-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
        <Image src={DeleteIcon} loading="lazy" alt="DeleteIcon" className='w-6 cursor-pointer' onClick={() => setDeleteOpen(!deleteOpen)} />
      </div>
      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(!deleteOpen)}
        onConfirm={deleteTodo}
        todoTitle={todo.title}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} title='Update Todo'>
        <UpdateTodo
          todo={todo}
          onCancel={() => setIsOpen(!isOpen)}
        />
      </Modal>
    </div>
  )
}

export default TodoItem