import { apiSlice } from "./apiSlice";
import { PREORDER_URL } from "../constants/apiConstants";

const preorderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPreorder: builder.mutation({
      query: (body) => ({
        url: PREORDER_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Preorder", "Dashboard", "User"],
    }),
    getMyPreorders: builder.query({
      query: () => ({
        url: `${PREORDER_URL}/me`,
      }),
      providesTags: (result) => [
        { type: "Preorder", id: "MY_LIST" },
        ...(result?.data ?? []).map((preorder) => ({
          type: "Preorder",
          id: preorder._id,
        })),
      ],
    }),
    updateMyPreorder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${PREORDER_URL}/me/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Preorder", id },
        "Preorder",
        "Dashboard",
        "User",
      ],
    }),
    cancelMyPreorder: builder.mutation({
      query: (id) => ({
        url: `${PREORDER_URL}/me/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Preorder", id },
        "Preorder",
        "Dashboard",
        "User",
      ],
    }),
    getPreorders: builder.query({
      query: (params = {}) => ({
        url: PREORDER_URL,
        params,
      }),
      providesTags: (result) => [
        { type: "Preorder", id: "LIST" },
        ...(result?.data ?? []).map((preorder) => ({
          type: "Preorder",
          id: preorder._id,
        })),
      ],
    }),
    getPreorderById: builder.query({
      query: (id) => ({
        url: `${PREORDER_URL}/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "Preorder", id }],
    }),
    updatePreorderStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${PREORDER_URL}/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Preorder", id },
        "Preorder",
        "Dashboard",
        "User",
      ],
    }),
  }),
});

export const {
  useCreatePreorderMutation,
  useGetMyPreordersQuery,
  useUpdateMyPreorderMutation,
  useCancelMyPreorderMutation,
  useGetPreordersQuery,
  useGetPreorderByIdQuery,
  useUpdatePreorderStatusMutation,
} = preorderApiSlice;
