#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, vec, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Project {
    pub id: u64,
    pub owner: Address,
    pub title: String,
    pub description: String,
    pub target_amount: i128,
    pub current_amount: i128,
    pub status: Symbol, // active, funded, completed
    pub deadline: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    ProjectCount,
    Project(u64), // Project ID -> Project
    UserBadges(Address),
}

#[contract]
pub struct InsigniaContract;

#[contractimpl]
impl InsigniaContract {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ProjectCount, &0u64);
    }

    // --- User & Badge Logic (Updated) ---

    pub fn award_badge(env: Env, admin: Address, user: Address, badge_type: Symbol) -> bool {
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        stored_admin.require_auth();
        
        if admin != stored_admin {
            return false;
        }

        let mut badges: Vec<Symbol> = env
            .storage()
            .persistent()
            .get(&DataKey::UserBadges(user.clone()))
            .unwrap_or(vec![&env]);

        if !badges.contains(&badge_type) {
            badges.push_back(badge_type);
            env.storage().persistent().set(&DataKey::UserBadges(user), &badges);
            true
        } else {
            false
        }
    }

    pub fn get_user_badges(env: Env, user: Address) -> Vec<Symbol> {
        env.storage()
            .persistent()
            .get(&DataKey::UserBadges(user))
            .unwrap_or(vec![&env])
    }

    // --- Project Logic (New Backend Replacement) ---

    pub fn create_project(
        env: Env,
        owner: Address,
        title: String,
        description: String,
        target_amount: i128,
        deadline: u64,
    ) -> u64 {
        owner.require_auth();

        let mut project_count: u64 = env.storage().instance().get(&DataKey::ProjectCount).unwrap_or(0);
        project_count += 1;

        let project = Project {
            id: project_count,
            owner,
            title,
            description,
            target_amount,
            current_amount: 0,
            status: symbol_short!("active"),
            deadline,
        };

        env.storage().instance().set(&DataKey::Project(project_count), &project);
        env.storage().instance().set(&DataKey::ProjectCount, &project_count);

        project_count
    }

    pub fn donate(env: Env, donor: Address, project_id: u64, amount: i128) {
        donor.require_auth();

        // 1. Get Project
        let mut project: Project = env.storage().instance().get(&DataKey::Project(project_id)).expect("Project not found");

        // 2. Transfer Tokens (Native XLM)
        // Note: For simplicity, we assume we are tracking value via logic, 
        // but in a real scenario you might transfer a specific Token.
        // For this demo, we'll verify the transfer happened if we were wrapping a token, 
        // but here we are just updating state. In a real 'crowdfunding' contract, 
        // you would use the `token` interface to transfer from `donor` to `project.owner` 
        // OR hold it in the contract until the goal is met.
        // Let's implement direct transfer to owner for MVP simplicity.
        // We actually need a Token Client to do the transfer.
        // For now, we will just track the commitment to keep it simple as replacing the DB logic.
        
        // Update Project State
        project.current_amount += amount;
        
        if project.current_amount >= project.target_amount {
            project.status = symbol_short!("funded");
        }

        env.storage().instance().set(&DataKey::Project(project_id), &project);

        // Optional: Award a badge automatically if donation > X
        if amount > 100 { // Example threshold
             let mut badges: Vec<Symbol> = env
                .storage()
                .persistent()
                .get(&DataKey::UserBadges(donor.clone()))
                .unwrap_or(vec![&env]);
            
            let supporter_badge = symbol_short!("supporter");
            if !badges.contains(&supporter_badge) {
                badges.push_back(supporter_badge);
                env.storage().persistent().set(&DataKey::UserBadges(donor), &badges);
            }
        }
    }

    pub fn get_project(env: Env, project_id: u64) -> Project {
        env.storage().instance().get(&DataKey::Project(project_id)).expect("Project not found")
    }
}

#[cfg(test)]
mod test;