import React, { useEffect, useState } from "react";
import { fetchDashboard } from "../services/adminServices";

const useDashboard = () => {
  const [dashboardDatas, setDashboardDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const getDashboard = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboard();
      console.log(data);

      setDashboardDatas(data);
    } catch (error) {
      console.log(error);
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);
  return { dashboardDatas, loading, errors, getDashboard };
};

export default useDashboard;
