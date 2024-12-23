import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  History,
  MessageSquare,
  Tag,
} from "lucide-react";
import useTicketDetails from "../../admin/hooks/useTicketDetails";
import api from "../../../services/api";
import { showToast } from "../../../utils/showToast";
import { DateFormat } from "../../../utils/format";
import AssignmentModal from "../components/AssignmentModal";
import useUsers from "../hooks/useUsers";
import TicketHeader from "../components/TicketHeader";
import TicketDetails from "../components/TicketDetails";
import Comments from "../components/Comments";

const AdminTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });
  const { users } = useUsers();
  console.log(users);

  const { ticketDetails, loading, errors, getTicketDetails } =
    useTicketDetails(id);

  useEffect(() => {
    if (ticketDetails) {
      setEditForm({
        title: ticketDetails.title || "",
        description: ticketDetails.description || "",
        status: ticketDetails.status || "",
        priority: ticketDetails.priority || "",
        assignee: ticketDetails.assignee || "",
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
      showToast(400, err.response?.data?.message || "Failed to update ticket");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post(`/api/tickets/${id}/comments/`, {
        comment: newComment,
        is_internal: true,
      });
      await getTicketDetails();
      setNewComment("");
      showToast(200, "Comment added successfully");
    } catch (err) {
      showToast(400, "Failed to add comment");
    }
  };

  const handleAssign = async () => {
    console.log("========", selectedAgent);

    try {
      await api.patch(`/api/tickets/${id}/`, {
        assigned_to: selectedAgent,
      });
      await getTicketDetails();
      setShowAssignModal(false);
      showToast(200, "Ticket assigned successfully");
    } catch (err) {
      showToast(400, "Failed to assign ticket");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/api/tickets/${id}/`);
        showToast(200, "Ticket deleted successfully");
        navigate("/admin/tickets");
      } catch (err) {
        showToast(400, "Failed to delete ticket");
      }
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
        <TicketHeader
          onBack={() => navigate('/admin/tickets')}
          onEdit={() => setIsEditing(!isEditing)}
          onDelete={handleDelete}
          onAssign={() => setShowAssignModal(true)}
          hasAssignee={!!ticketDetails.assigned_to}
          isEditing={isEditing}
        />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b">
                <TicketDetails
                  ticket={ticketDetails}
                  editForm={editForm}
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  onEditCancel={() => setIsEditing(false)}
                  onFormChange={setEditForm}
                />
              </div>
              <Comments
                comments={ticketDetails.comments}
                newComment={newComment}
                onCommentChange={setNewComment}
                onAddComment={handleAddComment}
              />
            </div>
          </div>


          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow border p-6 space-y-6">
              {/* Assigned To */}
              <div>
                <h2 className="text-lg font-medium mb-4">Assigned To</h2>
                <div className="flex items-center gap-3">
                  {ticketDetails.assigned_to ? (
                    <>
                      <div className="flex-shrink-0">
                        {ticketDetails.assigned_user.profile ? (
                          <img
                            src={ticketDetails.assigned_user.profile}
                            alt={ticketDetails.assigned_user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-8 h-8 p-1 bg-gray-200 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {ticketDetails.assigned_user.username}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">No agent assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AssignmentModal
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        availableAgents={users}
        handleAssign={handleAssign}
      />{" "}
    </div>
  );
};

export default AdminTicketDetails;
