import React, { useEffect, useState } from "react";
import { Ticket, Clock, CheckCircle, BarChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";

const LandingPage = () => {
  const [stats, setStats] = useState({
    activeTickets: 0,
    resolvedToday: 0,
  });

  useEffect(() => {

    const fetchStats = async () => {
      try {

        setStats({
          activeTickets: 150,
          resolvedToday: 45,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="flex-1 bg-gradient-to-br from-white to-blue-50 flex items-center">
        <div className="w-full">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 rounded-full text-sm text-blue-600">
                  <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="hidden sm:inline">
                    Smart Ticket Management System
                  </span>
                  <span className="sm:hidden">Smart Ticketing</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Streamline Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    Support Workflow
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600">
                  Efficiently manage support tickets, track resolutions, and deliver
                  exceptional customer service with our intelligent ticketing system.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <span className="inline-flex items-center px-6 sm:px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all transform hover:translate-y-[-2px] shadow-sm hover:shadow w-full sm:w-auto justify-center">
                      Get Started
                      <BarChart className="ml-2 h-5 w-5" />
                    </span>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t">
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Active Tickets</span>
                      <span className="sm:hidden">Active</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stats.activeTickets}+
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Resolved Today</span>
                      <span className="sm:hidden">Resolved</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stats.resolvedToday}+
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8 transform -rotate-3 transition-transform hover:rotate-0">
                  {/* Ticket Dashboard Preview */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="h-8 w-8 bg-blue-50 rounded-full"></div>
                    </div>

                    {/* Ticket List Preview */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Ticket className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          <div className="flex gap-2">
                            <div className="h-6 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="h-2 w-8 bg-blue-300 rounded"></div>
                            </div>
                            <div className="h-6 w-20 rounded-full bg-green-100 flex items-center justify-center">
                              <div className="h-2 w-12 bg-green-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;