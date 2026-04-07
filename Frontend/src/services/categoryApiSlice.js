import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants/apiConstants";

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORY_URL,
      }),
      providesTags: (result) => [
        { type: "Category", id: "LIST" },
        ...(result?.data ?? []).map((category) => ({
          type: "Category",
          id: category._id,
        })),
      ],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: CATEGORY_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category", "MenuItem", "Dashboard"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Category", id },
        "Category",
        "MenuItem",
        "Dashboard",
      ],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "MenuItem", "Dashboard"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
