const initialState = {
    isAdmin: true,
    jobId: null,
    output: null
  };
  
  const JobReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_JOB':
        return {
          ...state,
          isAdmin: action.payload.isAdmin,
          jobId: action.payload.jobId,
          output: action.payload.output,
        };
  
      case 'GET_JOB':
        return state;
  
      default:
        return state;
    }
  };
  
  export default JobReducer;
  