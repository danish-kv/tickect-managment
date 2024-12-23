import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Trash2, User } from "lucide-react";
import useTicketDetails from "../../admin/hooks/useTicketDetails";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import { DateFormat } from "../../../utils/format";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });

  const { ticketDetails, loading, errors, getTicketDetails } =
    useTicketDetails(id);

  useEffect(() => {
    if (ticketDetails) {
      setEditForm({
        title: ticketDetails.title || "",
        description: ticketDetails.description || "",
        status: ticketDetails.status || "",
        priority: ticketDetails.priority || "",
      });
    }
  }, [ticketDetails]);

  const handleEdit = async () => {
    try {
      const res = await api.patch(`/api/tickets/${id}/`, editForm);

      if (res.status === 200) {
        await getTicketDetails();
        setIsEditing(false);
        showToast(200, "Ticket updated successfully");
      }
    } catch (err) {
      console.error("Edit error:", err);
      showToast(400, err.response?.data?.message || "Failed to update ticket");
    }
  };

  const handleStartEditing = () => {
    setEditForm({
      title: ticketDetails.title || "",
      description: ticketDetails.description || "",
      status: ticketDetails.status || "",
      priority: ticketDetails.priority || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: ticketDetails.title || "",
      description: ticketDetails.description || "",
      status: ticketDetails.status || "",
      priority: ticketDetails.priority || "",
    });
  };

  const isValidForm = () => {
    return (
      editForm.title.trim() !== "" &&
      editForm.description.trim() !== "" &&
      editForm.status !== "" &&
      editForm.priority !== ""
    );
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        const res = await api.delete(`/api/tickets/${id}/`);
        await getTicketDetails();
        console.log(res);
        showToast(200, "deleted");

        navigate("/tickets");
      } catch (err) {
        showToast(400, "Failed to delete ticket");
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post("/api/comment/", {
        comment: newComment,
        ticket: id,
      });
      console.log(res);
      await getTicketDetails();
      showToast(200, "Comment added");
      setNewComment("");
    } catch (err) {
      showToast(400, "Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/tickets")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tickets</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleStartEditing} // Changed from setIsEditing(!isEditing)
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ticket title"
                  required
                />
                <div className="flex gap-4">
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In-Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <select
                    value={editForm.priority}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    disabled={!isValidForm()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {ticketDetails.title}
                </h1>
                <div className="flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      ticketDetails.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : ticketDetails.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticketDetails.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      ticketDetails.status === "open"
                        ? "bg-blue-100 text-blue-800"
                        : ticketDetails.status === "in-progress"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {ticketDetails.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Description</h2>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{ticketDetails.description}</p>
                )}
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Comments</h2>
                <div className="space-y-4">
                  {ticketDetails?.comments &&
                    ticketDetails?.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {comment.user.profile ? (
                          <img
                            src={comment.user.profile}
                            alt={comment.user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-5 h-5 " />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {comment.user.username}
                            </span>
                            <span className="text-sm text-gray-500">
                              {comment.created_at
                                ? DateFormat(comment.created_at)
                                : "N/A"}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}

                  <div className="mt-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
