#![cfg(test)]
use super::*;
use soroban_sdk::{Env, testutils::{Address as _, Ledger}, Address, symbol_short, vec};

#[test]
fn test_create_project() {
    let env = Env::default();
    let contract_id = env.register_contract(None, InsigniaContract);
    let client = InsigniaContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let items_addr = Address::generate(&env);
    
    // Project Info
    let title = String::from_str(&env, "Solar for Schools");
    let description = String::from_str(&env, "Installing panels on roof");
    let target = 10000;
    let deadline = 1000;

    // Create Project
    let project_id = client.create_project(
        &items_addr, 
        &title, 
        &description, 
        &target, 
        &deadline
    );

    assert_eq!(project_id, 1);

    // Verify Project Data
    let project = client.get_project(&project_id);
    assert_eq!(project.owner, items_addr);
    assert_eq!(project.current_amount, 0);
    assert_eq!(project.status, symbol_short!("active"));
}

#[test]
fn test_donate_flow() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, InsigniaContract);
    let client = InsigniaContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let owner = Address::generate(&env);
    let donor = Address::generate(&env);

    // Create Project
    let project_id = client.create_project(
        &owner, 
        &String::from_str(&env, "Save the Ocean"), 
        &String::from_str(&env, "Cleanup plastic"), 
        &500, 
        &2000
    );

    // Donate
    client.donate(&donor, &project_id, &100);

    let project = client.get_project(&project_id);
    assert_eq!(project.current_amount, 100);
    assert_eq!(project.status, symbol_short!("active"));

    // Donate to complete
    client.donate(&donor, &project_id, &400);
    
    let project_finished = client.get_project(&project_id);
    assert_eq!(project_finished.current_amount, 500);
    assert_eq!(project_finished.status, symbol_short!("funded"));
}

#[test]
fn test_badge_award() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, InsigniaContract);
    let client = InsigniaContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let user = Address::generate(&env);
    let badge = symbol_short!("hero");

    // Award Badge
    client.award_badge(&admin, &user, &badge);

    // Verify
    let badges = client.get_user_badges(&user);
    assert!(badges.contains(&badge));
}
