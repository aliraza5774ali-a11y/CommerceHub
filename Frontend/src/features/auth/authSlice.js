import { createSlice } from "@reduxjs/toolkit";
import { storedSession } from "../../api/apiClient";
const session = storedSession();
const authSlice = createSlice({
  name: "auth",
  initialState: { user: session?.user || null, accessToken: session?.accessToken || null, refreshToken: session?.refreshToken || null, loading: false, error: null, isAuthenticated: Boolean(session?.accessToken) },
  reducers: {
    authStarted: (state) => { state.loading = true; state.error = null; },
    authSucceeded: (state, action) => { Object.assign(state, action.payload, { loading: false, error: null, isAuthenticated: true }); },
    authFailed: (state, action) => { state.loading = false; state.error = action.payload; },
    sessionCleared: (state) => { Object.assign(state, { user: null, accessToken: null, refreshToken: null, loading: false, error: null, isAuthenticated: false }); },
  },
});
export const { authStarted, authSucceeded, authFailed, sessionCleared } = authSlice.actions;
export default authSlice.reducer;
