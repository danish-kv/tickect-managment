import React, { useEffect, useState } from "react";
import { fetchTickets } from "../services/adminServices";

const useTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getTicket = async () => {
    setLoading(false);
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    getTicket()
  }, [])
  return { tickets, loading, errors };
};

export default useTicket;
