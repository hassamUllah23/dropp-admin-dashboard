export const setJob = (isAdmin, jobId, output) => ({
  type: "SET_JOB",
  payload: { isAdmin, jobId, output },
});
