use {
    solana_program::{
        account_info::{next_account_info, AccountInfo}, 
        entrypoint, 
        entrypoint::ProgramResult, 
        msg, 
        native_token::LAMPORTS_PER_SOL,
        program::invoke,
        pubkey::Pubkey,
        system_instruction,
    },
    spl_token::{
        instruction as token_instruction,
    },
    spl_associated_token_account::{
        instruction as token_account_instruction,
    },
};


entrypoint!(process_instruction);


fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();

    let mint = next_account_info(accounts_iter)?;  // Token "CgVBsGvoS6jwfqH42kFpGvAQ7efEFHyFa11E8TUFXCMb"
    let token_account = next_account_info(accounts_iter)?; // Token account
    let mint_authority = next_account_info(accounts_iter)?;  // wallet
    let rent = next_account_info(accounts_iter)?; // 
    let system_program = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;
    let associated_token_program = next_account_info(accounts_iter)?;
    
    msg!("Creating mint account...");
    msg!("Mint: {}", mint.key);
    invoke(
        &system_instruction::create_account(
            &mint_authority.key,
            &mint.key,
            LAMPORTS_PER_SOL,
            82,
            &token_program.key,  // SPL_TOKEN pid
        ),
        &[
            mint.clone(),
            mint_authority.clone(),
            token_program.clone(),
        ]
    )?;

    msg!("Initializing mint account...");
    msg!("Mint: {}", mint.key);
    invoke(
        &token_instruction::initialize_mint(
            &token_program.key, 
            &mint.key,
            &mint_authority.key,
            Some(&mint_authority.key),
            0,
        )?,
        &[
            mint.clone(),
            mint_authority.clone(),
            token_program.clone(),
            rent.clone(),
        ]
    )?;

    msg!("Creating token account...");
    msg!("Token Address: {}", token_account.key);    
    invoke(
        &token_account_instruction::create_associated_token_account(
            &mint_authority.key,  // funding_address
            &mint_authority.key,  // wallet_address
            &mint.key, // token_mint_address
        ),
        &[
            mint.clone(),
            token_account.clone(),
            mint_authority.clone(),
            token_program.clone(),
            associated_token_program.clone(),
        ]
    )?;

    msg!("Minting token to token account...");
    msg!("Mint: {}", mint.key);   
    msg!("Token Address: {}", token_account.key);
    invoke(
        &token_instruction::mint_to(
            &token_program.key,  // token_program_id
            &mint.key,           // mint_pubkey
            &token_account.key,  // account_pubkey
            &mint_authority.key, // owner_pubkey
            &[&mint_authority.key],  //signer_pubkeys
            1, // amount 
        )?,
        &[
            mint.clone(),
            mint_authority.clone(),
            token_account.clone(),
            token_program.clone(),
            rent.clone(),
        ]
    )?;

    msg!("Token mint process completed successfully.");


    msg!("Disabling token to token account...");
    msg!("Mint: {}", mint.key);   
    msg!("Token Address: {}", token_account.key);
    invoke(
        &token_instruction::freeze_account(
            &token_program.key, 
            &token_account.key,  
            &mint.key,          
            &mint_authority.key, 
            &[&mint_authority.key], 
        )?,
        &[
            mint.clone(),
            mint_authority.clone(),
            token_account.clone(),
            token_program.clone(),
            rent.clone(),
        ]
    )?;
    

    msg!("Success to disable Token");
    Ok(())
}
