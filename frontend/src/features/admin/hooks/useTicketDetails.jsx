import React, { useEffect, useState } from "react";
import { fetchTicketDetails } from "../services/adminServices";

const useTicketDetails = (id) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getTicketDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchTicketDetails(id);
      console.log(data);
      
      setTicketDetails(data);
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicketDetails();
  }, []);
  return { ticketDetails, loading, errors, getTicketDetails };
};

export default useTicketDetails;
