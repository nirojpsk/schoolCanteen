import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTouchPresenceMutation } from "../../services/authApiSlice";

const HEARTBEAT_INTERVAL_MS = 60 * 1000;

export default function PresenceHeartbeat() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [touchPresence] = useTouchPresenceMutation();

  useEffect(() => {
    if (!userInfo?._id) {
      return undefined;
    }

    const sendHeartbeat = () => {
      touchPresence().catch(() => {});
    };

    sendHeartbeat();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendHeartbeat();
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [touchPresence, userInfo?._id]);

  return null;
}
