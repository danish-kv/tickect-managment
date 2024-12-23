import React, { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import useTicket from "../hooks/useTicket";
import { DateFormat } from "../../../utils/format";
import { Link } from "react-router-dom";

const TicketManagement = () => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });

  const { tickets, loading, getTicket, errors } = useTicket();

  useEffect(() => {
    const delay = setTimeout(() => {
      getTicket(filters);
    }, 500);

    return () => clearTimeout(delay);
  }, [filters]);

  const getStatusColor = (status) => {
    const colors = {
      Open: "bg-yellow-100 text-yellow-800",
      'In-Progress' : "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                      {ticket.description}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {ticket.comments.length}
                        </span>
                        <span>{ticket.user.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assigned_user?.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.updated_at ? DateFormat(ticket.updated_at) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/tickets/${ticket.id}/`}>
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketManagement;
