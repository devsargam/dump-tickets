export const clearURLParams = () => {
  window.history.replaceState(null, "", window.location.pathname);
};

export const isIssueUnchanged = (
  currentIssue: { title: string; description: string } | undefined,
  newTitle: string,
  newDescription: string
): boolean => {
  return (
    currentIssue !== undefined &&
    currentIssue.title === newTitle &&
    currentIssue.description === newDescription
  );
};
