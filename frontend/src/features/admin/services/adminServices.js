import api from "../../../services/api";

export const fetchUsers = async (searchTerm='', statusFilter='all') => {
  const res = await api.get("/api/users/", {
    params : {
      search : searchTerm,
      is_active : statusFilter
    }
  });
  return res.data;
};

export const fetchTickets = async (filters) => {
  const res = await api.get("/api/tickets/", {
    params: {
      search: filters.search || "",
      status: filters.status !== "all" ? filters.status : "",
      priority: filters.priority !== "all" ? filters.priority : "",
      view_type: filters.viewType !== "all" ? filters.viewType : "",
    },
  });
  console.log(res);
  return res.data.results;
};

export const fetchTicketDetails = async (id) => {
  const res = await api.get(`/api/tickets/${id}/`);
  return res.data;
};

export const fetchDashboard = async (d) => {
  const res = await api.get(`/api/dashboard/`);
  return res.data;
};
