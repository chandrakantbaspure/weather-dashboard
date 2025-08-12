// Simple date formatting utility to replace date-fns
export const format = (date, formatString) => {
  const d = new Date(date);
  
  const formatMap = {
    'MMM dd, yyyy': () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month} ${day}, ${year}`;
    },
    'HH:mm': () => {
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    'EEE': () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[d.getDay()];
    },
    'MMM dd': () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const day = d.getDate().toString().padStart(2, '0');
      return `${month} ${day}`;
    }
  };
  
  return formatMap[formatString] ? formatMap[formatString]() : d.toLocaleDateString();
};
