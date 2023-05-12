import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";
import { setUser } from "../store/userSlice";

const usePersistentSession = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_PATH}/users/refresh`,
          { withCredentials: true }
        );
        const { data } = response;
        dispatch(setAuth(data.auth));
        dispatch(setUser(data.data.user));
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
};

export default usePersistentSession;
