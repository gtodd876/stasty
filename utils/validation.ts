export const validateTitle = (value) => {
  if (!value) {
    return "Title is required";
  } else return true;
};

export const validateKeywords = (value) => {
  if (!value) {
    return "Keywords are required";
  } else return true;
};
