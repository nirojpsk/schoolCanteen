import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearCredentials,
  setCredentials,
  setSessionChecked,
  setSessionError,
} from "../../features/auth/authSlice";
import { useGetMeQuery } from "../../services/authApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

export default function SessionBootstrap() {
  const dispatch = useDispatch();
  const { data, error, isLoading, isFetching } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data));
      return;
    }

    if (error?.status === 401 || error?.status === 403) {
      dispatch(clearCredentials());
      return;
    }

    if (error) {
      dispatch(
        setSessionError(
          getApiErrorMessage(error, "Could not verify your session.")
        )
      );
      return;
    }

    if (!isLoading && !isFetching) {
      dispatch(setSessionChecked());
    }
  }, [data, dispatch, error, isFetching, isLoading]);

  return null;
}
