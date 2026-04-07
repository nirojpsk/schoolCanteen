import { apiSlice } from "./apiSlice";
import { SPECIAL_URL } from "../constants/apiConstants";

const specialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpecials: builder.query({
      query: () => ({
        url: SPECIAL_URL,
      }),
      providesTags: (result) => [
        { type: "Special", id: "LIST" },
        ...(result?.data ?? []).map((special) => ({
          type: "Special",
          id: special._id,
        })),
      ],
    }),
    getActiveSpecials: builder.query({
      query: () => ({
        url: `${SPECIAL_URL}/active`,
      }),
      providesTags: [{ type: "Special", id: "ACTIVE" }],
    }),
    createSpecial: builder.mutation({
      query: (body) => ({
        url: SPECIAL_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Special", "Dashboard"],
    }),
    updateSpecial: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${SPECIAL_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Special", id },
        "Special",
        "Dashboard",
      ],
    }),
    deleteSpecial: builder.mutation({
      query: (id) => ({
        url: `${SPECIAL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Special", "Dashboard"],
    }),
  }),
});

export const {
  useGetSpecialsQuery,
  useGetActiveSpecialsQuery,
  useCreateSpecialMutation,
  useUpdateSpecialMutation,
  useDeleteSpecialMutation,
} = specialApiSlice;
