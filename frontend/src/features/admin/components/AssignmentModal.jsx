import { useState } from "react";
import Modal from "./Modal";

const AssignmentModal = ({ 
  showAssignModal, 
  setShowAssignModal, 
  selectedAgent, 
  setSelectedAgent,
  availableAgents,
  handleAssign 
}) => (
  <Modal
    isOpen={showAssignModal}
    onClose={() => setShowAssignModal(false)}
    title="Assign Ticket"
  >
    <div className="mb-4">
      <select
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select an agent</option>
        {availableAgents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.username}
          </option>
        ))}
      </select>
    </div>
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setShowAssignModal(false)}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        onClick={handleAssign}
        disabled={!selectedAgent}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        Assign
      </button>
    </div>
  </Modal>
);

export default AssignmentModal;