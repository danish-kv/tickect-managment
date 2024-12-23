import api from "../../../services/api";

export const fetchUsers = async () => {
  const res = await api.get("/api/users/");
  return res.data;
};

export const fetchTickets = async () => {
  const res = await api.get("/api/tickets/");
  return res.data;
};
export const fetchTicketDetails = async (id) => {
  const res = await api.get(`/api/tickets/${id}/`);
  return res.data;
};
