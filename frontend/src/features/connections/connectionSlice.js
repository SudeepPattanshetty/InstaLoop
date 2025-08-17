import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}

const connectionSlice = createSlice({
    name: "Connection",
    initialState,
    reducers: {

    }
})

export default connectionSlice.reducer;