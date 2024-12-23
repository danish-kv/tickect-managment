import React from "react";
import { Clock, AlertCircle } from "lucide-react";
import { DateFormat } from "../../../utils/format";

const TicketDetails = ({
  ticket,
  editForm,
  isEditing,
  onEdit,
  onEditCancel,
  onFormChange,
}) => {
  const getStatusBadgeColor = (status) =>
    ({
      Open: "bg-blue-100 text-blue-800",
      "In-Progress": "bg-yellow-100 text-yellow-800",
      Resolved: "bg-green-100 text-green-800",
      Closed: "bg-gray-100 text-gray-800",
    }[status] || "bg-gray-100 text-gray-800");

  const getPriorityBadgeColor = (priority) =>
    ({
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    }[priority] || "bg-gray-100 text-gray-800");

  if (isEditing) {
    return (
      <div className="space-y-4">
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ticket title"
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            value={editForm.status}
            onChange={(e) =>
              onFormChange({ ...editForm, status: e.target.value })
            }
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="In-Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={editForm.priority}
            onChange={(e) =>
              onFormChange({ ...editForm, priority: e.target.value })
            }
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <textarea
          value={editForm.description}
          onChange={(e) =>
            onFormChange({ ...editForm, description: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Ticket description"
        />
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onEditCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-sm ${getPriorityBadgeColor(
            ticket.priority
          )}`}
        >
          {ticket.priority}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>
        {ticket.category && (
          <span className="px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            {ticket.category}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Created: {DateFormat(ticket.created_at)}</span>
        </div>
        {ticket.due_date && (
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Due: {DateFormat(ticket.due_date)}</span>
          </div>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <p className="text-gray-600">{ticket.description}</p>
      </div>
    </div>
  );
};

export default TicketDetails;
