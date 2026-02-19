// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  CalendarCheck,
  Users,
  Car,
  Plus,
  UserCog,
  CheckCircle,
  UserPlus,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Stats
        const statsRes = await api.get("/auth/stats");
        setStats(statsRes.data);

        // ✅ All bookings (admin only)
        const bookingsRes = await api.get("/bookings");
        setBookings(bookingsRes.data);

        // ✅ All users
        const usersRes = await api.get("/auth/users");
        setUsers(usersRes.data);
      } catch (err) {
        console.error(
          "❌ Failed to fetch dashboard data:",
          err.response?.data || err.message
        );
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || "No stats available"}</p>
      </div>
    );
  }

  // ---------- Transform data ----------
  // Bookings grouped by day
  const bookingTrend = Object.values(
    bookings.reduce((acc, b) => {
      const date = new Date(b.createdAt).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  // Users grouped by day
  const userTrend = Object.values(
    users.reduce((acc, u) => {
      const date = new Date(u.createdAt).toLocaleDateString();
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  // Recent activity: mix of latest bookings + users
  const recentActivities = [
    ...bookings.slice(-3).map((b) => ({
      type: "booking",
      message: `New booking by ${b.firstName} ${b.lastName}`,
      time: b.createdAt,
    })),
    ...users.slice(-2).map((u) => ({
      type: "user",
      message: `New user: ${u.firstName} ${u.lastName}`,
      time: u.createdAt,
    })),
  ].reverse();

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>

        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
          <Button variant="outline">
            <UserCog className="w-4 h-4 mr-2" />
            Manage Drivers
          </Button>
          <Button variant="outline">
            <Car className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" /> Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.bookings?.total ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.users?.total ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" /> Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.drivers?.total ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bookings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={300} height={160} data={bookingTrend}>
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={160} data={userTrend}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => {
                let Icon = Activity;
                let color = "text-gray-500";
                if (activity.type === "booking") {
                  Icon = CheckCircle;
                  color = "text-green-500";
                } else if (activity.type === "user") {
                  Icon = UserPlus;
                  color = "text-blue-500";
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition"
                  >
                    <Icon className={`w-5 h-5 mt-1 ${color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
