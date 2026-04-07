import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants/apiConstants";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"],
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),

        getMe: builder.query({
            query: () => ({
                url: `${AUTH_URL}/me`,
                method: "GET",
            }),
            providesTags: ["Auth"],
        }),

        touchPresence: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/presence`,
                method: "POST",
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/change-password`,
                method: "PUT",
                body: data,
            }),
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/update-profile`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Auth"],
        }),

        registerStudent: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/register-student`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Auth"],
        }),

        getUsers: builder.query({
            query: (params = {}) => ({
                url: `${AUTH_URL}/users`,
                method: "GET",
                params,
            }),
            providesTags: (result) => [
                { type: "User", id: "LIST" },
                ...(result?.data ?? []).map((user) => ({
                    type: "User",
                    id: user._id,
                })),
            ],
        }),

        getUserOrderHistory: builder.query({
            query: (id) => ({
                url: `${AUTH_URL}/users/${id}/orders`,
                method: "GET",
            }),
            providesTags: (_, __, id) => [{ type: "User", id }],
        }),

        updateUserStatus: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${AUTH_URL}/users/${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_, __, { id }) => [
                { type: "User", id },
                "User",
                "Dashboard",
                "Auth",
            ],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${AUTH_URL}/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, __, id) => [
                { type: "User", id },
                "User",
                "Dashboard",
            ],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetMeQuery,
    useTouchPresenceMutation,
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useRegisterStudentMutation,
    useGetUsersQuery,
    useGetUserOrderHistoryQuery,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
} = authApiSlice;
