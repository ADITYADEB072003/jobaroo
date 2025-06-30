import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        setSearchJobByText: "",
        searchedQuery: "",
        allAppliedJobs: [],
        savedJobs: [], // Add savedJobs to the initial state
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        clearSingleJob: (state) => { 
            state.singleJob = null;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        addSavedJob: (state, action) => {
            // Ensure state.savedJobs is an array before calling 'some'
            if (!Array.isArray(state.savedJobs)) {
                console.error("savedJobs is not an array:", state.savedJobs);
                state.savedJobs = []; // Initialize to an empty array if it's not
            }
        
            if (action.payload && !state.savedJobs.some(job => job._id === action.payload._id)) {
                state.savedJobs.push(action.payload); // Add job if it's not already saved
            }
        },
        
        removeSavedJob: (state, action) => {
            state.savedJobs = state.savedJobs.filter(job => job._id !== action.payload);
        },
    }
});

// Selector to filter jobs by title based on the searched query
export const selectFilteredJobs = (state) =>
    state.job.allJobs.filter(job =>
        job.title.toLowerCase().includes(state.job.searchedQuery.toLowerCase()) 
    );

export const {
    setAllJobs,
    setSingleJob,
    clearSingleJob,
    setAllAdminJobs,
    setAllAppliedJobs,
    setSearchedQuery,
    setSearchJobByText,
    addSavedJob,     // Export addSavedJob
    removeSavedJob   // Export removeSavedJob
} = jobSlice.actions;

export default jobSlice.reducer;