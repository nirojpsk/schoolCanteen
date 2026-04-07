import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiConstants";
import { clearCredentials, setSessionChecked } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    timeout: 15000,
});

const baseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 || result?.error?.status === 403) {
        api.dispatch(clearCredentials());
        api.dispatch(setSessionChecked());
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api", //yesle store ma kun name le rakheko xa vanne kura ho
    baseQuery,
    tagTypes: ["Auth", "Category", "MenuItem", "Special", "Preorder", "Dashboard", "User"],
    refetchOnFocus: true,
    refetchOnReconnect: true,
    endpoints: () => ({}),
});
