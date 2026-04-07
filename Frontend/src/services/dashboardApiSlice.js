import { apiSlice } from "./apiSlice";
import { DASHBOARD_URL } from "../constants/apiConstants";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${DASHBOARD_URL}/stats`,
      }),
      providesTags: ["Dashboard"],
    }),
    getRecentOrders: builder.query({
      query: () => ({
        url: `${DASHBOARD_URL}/recent-orders`,
      }),
      providesTags: ["Dashboard", "Preorder"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentOrdersQuery } =
  dashboardApiSlice;
