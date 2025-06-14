export const clearURLParams = () => {
  window.history.replaceState(null, "", window.location.pathname);
};
