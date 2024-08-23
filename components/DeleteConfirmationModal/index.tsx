import React, { useReducer } from 'react';
import Modal from '@/components/Modal';
import Loader from '@/components/Loader';
import { Button } from "@/components/ui/button";
import { initialTodoState, todoReducer } from '@/reducers/todoReducer';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  todoTitle,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const { isDeletingTodo } = state;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-4">
        <p>Are you sure you want to delete the following todo?</p>
        <p className="font-semibold">{todoTitle}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {isDeletingTodo ? <Loader /> : "Delete Todo"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;