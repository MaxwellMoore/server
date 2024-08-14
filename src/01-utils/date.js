const getDate = () => {
  const currentDateInMillis = Date.now(); // Get the current time in milliseconds
  const dateObject = new Date(currentDateInMillis); // Create a Date object

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const day = String(dateObject.getDate()).padStart(2, "0");

  const formattedDate = `${year}/${month}/${day}`;

  return formattedDate;
};

module.exports = {
  getDate,
};
