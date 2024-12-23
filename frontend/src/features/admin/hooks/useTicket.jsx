import React, { useEffect, useState } from "react";
import { fetchTickets } from "../services/adminServices";

const useTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getTicket = async (filters={}) => {
    setLoading(true);
    try {
      const data = await fetchTickets(filters);
      console.log(data);
      
      setTickets(data);
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicket()
  }, [])
  return { tickets, loading, errors, getTicket };
};

export default useTicket;
