
export async function createLoan(borrower: string, principal: number, interest: number) {
  console.log("createLoan()", borrower, principal, interest);
  return "loan_created_simulado";
}

export async function getLoan(loanId: number) {
  console.log("getLoan()", loanId);
  return {
    id: loanId,
    borrower: "Gxxxx",
    principal: 100,
    interest: 500,
    paid: false,
  };
}

export async function payLoan(loanId: number) {
  console.log("payLoan()", loanId);
  return "loan_paid_simulado";
}
