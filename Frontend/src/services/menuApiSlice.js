import { apiSlice } from "./apiSlice";
import { MENU_ITEM_URL } from "../constants/apiConstants";

const menuApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: (params = {}) => ({
        url: MENU_ITEM_URL,
        params,
      }),
      providesTags: (result) => [
        { type: "MenuItem", id: "LIST" },
        ...(result?.data ?? []).map((item) => ({
          type: "MenuItem",
          id: item._id,
        })),
      ],
    }),
    getMenuItemById: builder.query({
      query: (id) => ({
        url: `${MENU_ITEM_URL}/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "MenuItem", id }],
    }),
    createMenuItem: builder.mutation({
      query: (body) => ({
        url: MENU_ITEM_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MenuItem", "Special", "Dashboard"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${MENU_ITEM_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "MenuItem", id },
        "MenuItem",
        "Special",
        "Dashboard",
      ],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `${MENU_ITEM_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItem", "Special", "Dashboard"],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApiSlice;
