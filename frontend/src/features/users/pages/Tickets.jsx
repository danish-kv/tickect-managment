import React, { useState, useEffect } from "react";
import {
  Ticket,
  Filter,
  Plus,
  Search,
  Clock,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateTicketForm from "../components/CreateTicketForm";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import useTicket from "../../admin/hooks/useTicket";
import { DateFormat } from "../../../utils/format";

const TicketsPage = () => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {tickets, loading, errors} = useTicket()
  console.log(tickets);
  


  const handleCreateTicket = async (ticketData) => {
    try {
      const res = await api.post("/api/tickets/", ticketData);
      console.log(res);
      showToast(200, 'New Ticket added')
    } catch (error) {
      console.log(error);
      showToast(400, 'Failed to create new Ticket')
    }
    // setIsCreateModalOpen(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50",
      medium: "text-yellow-600 bg-yellow-50",
      low: "text-green-600 bg-green-50",
    };
    return colors[priority] || "text-gray-600 bg-gray-50";
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "text-blue-600 bg-blue-50",
      "in-progress": "text-purple-600 bg-purple-50",
      resolved: "text-green-600 bg-green-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Support Tickets
            </h1>
            <p className="text-gray-600">
              Manage and track all support requests
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="relative">
            <select
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid gap-px bg-gray-200">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="bg-white p-4 hover:bg-gray-50 transition-colors "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {ticket.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {ticket.created_at ? DateFormat(ticket.created_at) : 'N/A'}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {ticket.comments.length} comments
                      </span>
                      <span>{ticket.user?.username}</span>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400 transform -rotate-90" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      {isCreateModalOpen && (
        <CreateTicketForm
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </div>
  );
};

export default TicketsPage;
