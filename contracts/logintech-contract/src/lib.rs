#![no_std]
use soroban_sdk::{env::Env, contractimpl, symbol, Address, BytesN, Map, Symbol, Vec, panic_with_error};
use soroban_sdk::serde::{Serialize, Deserialize};

// Error enum
#[derive(Debug)]
pub enum Error {
    NotAdmin,
    AlreadyInitialized,
    NotFound,
    Unauthorized,
    InvalidAmount,
    LoanClosed,
}

// Roles
#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Role {
    Admin,
    Student,
    Teacher,
    Lender,
}

// Loan data structure
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Loan {
    pub id: u128,
    pub borrower: Address,
    pub lender: Address,
    pub principal: i128,
    pub outstanding: i128,
    pub interest_rate_bp: i32, // basis points
    pub closed: bool,
}

// Storage keys
const ADMIN_KEY: &str = "ADMIN";
const ROLE_MAP_KEY: &str = "ROLE_MAP";
const LOAN_COUNTER_KEY: &str = "LOAN_COUNTER";
const LOAN_PREFIX: &str = "LOAN_";

pub struct LoginTechContract;

#[contractimpl]
impl LoginTechContract {
    // initialize admin (call once)
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().has(&Symbol::new(&env, ADMIN_KEY)) {
            panic_with_error!(&env, Error::AlreadyInitialized)
        }
        env.storage().set(&Symbol::new(&env, ADMIN_KEY), &admin);
    }

    // only admin can set roles
    pub fn set_role(env: Env, whom: Address, role: Role) {
        let admin: Address = env.storage().get_unchecked(&Symbol::new(&env, ADMIN_KEY)).unwrap();
        if env.invoker() != admin {
            panic_with_error!(&env, Error::NotAdmin)
        }
        let mut map: Map<Address, Role> = env.storage().get(&Symbol::new(&env, ROLE_MAP_KEY)).unwrap_or(Map::new(&env));
        map.set(whom, role);
        env.storage().set(&Symbol::new(&env, ROLE_MAP_KEY), &map);
    }

    pub fn get_role(env: Env, whom: Address) -> Option<Role> {
        let map: Map<Address, Role> = env.storage().get(&Symbol::new(&env, ROLE_MAP_KEY)).unwrap_or(Map::new(&env));
        map.get(whom)
    }

    // Create loan: lender creates loan offer to borrower, principal > 0
    pub fn create_loan(env: Env, borrower: Address, lender: Address, principal: i128, interest_rate_bp: i32) -> u128 {
        if principal <= 0 {
            panic_with_error!(&env, Error::InvalidAmount)
        }
        // increment counter
        let mut counter: u128 = env.storage().get(&Symbol::new(&env, LOAN_COUNTER_KEY)).unwrap_or(0u128);
        counter += 1;
        env.storage().set(&Symbol::new(&env, LOAN_COUNTER_KEY), &counter);

        let loan = Loan {
            id: counter,
            borrower: borrower.clone(),
            lender: lender.clone(),
            principal,
            outstanding: principal,
            interest_rate_bp,
            closed: false,
        };

        env.storage().set(&Symbol::new(&env, format!("{}{}", LOAN_PREFIX, counter)), &loan);
        counter
    }

    pub fn get_loan(env: Env, loan_id: u128) -> Option<Loan> {
        env.storage().get(&Symbol::new(&env, format!("{}{}", LOAN_PREFIX, loan_id)))
    }

    // Pay towards loan: can be called by borrower or lender
    pub fn pay(env: Env, loan_id: u128, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, Error::InvalidAmount)
        }
        let key = Symbol::new(&env, format!("{}{}", LOAN_PREFIX, loan_id));
        let mut loan: Loan = env.storage().get_unchecked(&key).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));

        if loan.closed {
            panic_with_error!(&env, Error::LoanClosed)
        }

        let caller = env.invoker();
        if caller != loan.borrower && caller != loan.lender {
            panic_with_error!(&env, Error::Unauthorized)
        }

        if amount >= loan.outstanding {
            loan.outstanding = 0;
            loan.closed = true;
        } else {
            loan.outstanding -= amount;
        }

        env.storage().set(&key, &loan);
    }

    // Admin-only close
    pub fn close_loan(env: Env, loan_id: u128) {
        let admin: Address = env.storage().get_unchecked(&Symbol::new(&env, ADMIN_KEY)).unwrap();
        if env.invoker() != admin {
            panic_with_error!(&env, Error::NotAdmin)
        }
        let key = Symbol::new(&env, format!("{}{}", LOAN_PREFIX, loan_id));
        let mut loan: Loan = env.storage().get_unchecked(&key).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));
        loan.closed = true;
        env.storage().set(&key, &loan);
    }
}
