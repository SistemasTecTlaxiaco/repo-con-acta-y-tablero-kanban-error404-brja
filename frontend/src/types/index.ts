export type Loan = {
  id: string;
  borrower: string;
  lender: string;
  principal: string;
  outstanding: string;
  interest_rate_bp: number;
  closed: boolean;
};
