import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  // username: '',
  email: "",
  name: "",
  avatar: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, email, name, avatarPath } = action.payload;
      state._id = _id;
      // state.username = username;
      state.email = email;
      state.avatar = avatarPath;
      state.name = name;
    },
    resetUser: (state, action) => {
      state._id = "";
      // state.username = username;
      state.email = "";
      state.avatar = "";
      state.name = "";
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
