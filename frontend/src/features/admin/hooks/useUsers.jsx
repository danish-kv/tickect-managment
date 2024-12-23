import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/adminServices";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      console.log(res);
      setUsers(data);
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return { users, loading, errors, getUsers };
};

export default useUsers;
