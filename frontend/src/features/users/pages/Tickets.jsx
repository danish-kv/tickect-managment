import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Search,
  Clock,
  ChevronDown,
  MessageSquare,
  User,
  UserCheck,
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
    viewType: "all",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tickets, loading, errors, getTicket } = useTicket();
  console.log("data in main====", tickets, loading);


  useEffect(() => {
    const delay = setTimeout(() => {
      getTicket(filters);
    }, 500);

    return () => clearTimeout(delay);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      const res = await api.post("/api/tickets/", ticketData);
      console.log(res);
      await getTicket()
      showToast(200, "New Ticket added");
    } catch (error) {
      showToast(400, "Failed to create new Ticket");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "text-red-600 bg-red-50",
      Medium: "text-yellow-600 bg-yellow-50",
      Low: "text-green-600 bg-green-50",
    };
    return colors[priority] || "text-gray-600 bg-gray-50";
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "text-blue-600 bg-blue-50",
      "In-Progress": "text-purple-600 bg-purple-50",
      Resolved: "text-green-600 bg-green-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const ToggleButton = ({ active, onClick, icon: Icon, children }) => (
    <button
      onClick={onClick}
      className={`
        flex items-center px-4 py-2 rounded-lg transition-colors duration-200
        ${
          active
            ? "bg-blue-100 text-blue-700 border border-blue-200"
            : "text-gray-600 hover:bg-gray-100 border border-transparent"
        }
      `}
    >
      <Icon className="h-5 w-5 mr-2" />
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </button>
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-6 space-y-4">
          {/* View Type Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
            <ToggleButton
              active={filters.viewType === "all"}
              onClick={() => setFilters((f) => ({ ...f, viewType: "all" }))}
              icon={Ticket}
            >
              All Tickets
            </ToggleButton>
            <ToggleButton
              active={filters.viewType === "my-tickets"}
              onClick={() => handleFilterChange("viewType", "my-tickets")}
              icon={User}
            >
              My Tickets
            </ToggleButton>
            <ToggleButton
              active={filters.viewType === "assigned-to-me"}
              onClick={(e) => handleFilterChange("viewType", "assigned-to-me")}
              icon={UserCheck}
            >
              Assigned to Me
            </ToggleButton>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 cursor-pointer"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Priority Select */}
            <div className="relative">
              <select
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 cursor-pointer"
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-2">No tickets found</div>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or create a new ticket
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-3 mb-2">
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
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {ticket.created_at
                            ? DateFormat(ticket.created_at)
                            : "N/A"}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {ticket.comments?.length || 0} comments
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {ticket.user?.username || "Unknown"}
                        </span>
                        {ticket.assigned_to && (
                          <span className="flex items-center">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assigned to: {ticket.assigned_user.username}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 transform -rotate-90 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
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
