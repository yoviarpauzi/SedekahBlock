const availableDonation = (balance: number) => {
  if (balance <= 1) {
    return balance;
  }
  return (balance * 0.95).toFixed(2);
};

export default availableDonation;
