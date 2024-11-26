const getCurrentISODate = () => {
  const today = new Date();
  today.setHours(12, 30, 0, 0);
  return today.toISOString();
};

export default getCurrentISODate;
