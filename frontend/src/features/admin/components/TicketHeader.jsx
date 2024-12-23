import React from 'react';
import { ArrowLeft, Edit3, Trash2, UserPlus } from 'lucide-react';

const TicketHeader = ({ onBack, onEdit, onDelete, onAssign, hasAssignee, isEditing }) => (
  <div className="mb-6 flex items-center justify-between">
    <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
      <ArrowLeft className="h-5 w-5" />
      <span>Back to Tickets</span>
    </button>
    <div className="flex gap-2">
      {!hasAssignee && (
        <button onClick={onAssign} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <UserPlus className="h-4 w-4" />
          <span>Assign</span>
        </button>
      )}
      <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Edit3 className="h-4 w-4" />
        <span>Edit</span>
      </button>
      <button onClick={onDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </div>
  </div>
);

export default TicketHeader