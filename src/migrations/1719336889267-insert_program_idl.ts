import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertProgramIdl1719336889267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO program_idl (id, program_pubkey, idl) VALUES 
            (1, '11111111111111111111111111111111', '{
                "version": "0.1.0",
                "name": "system_program",
                "instructions": [
                    {
                        "name": "advanceNonceAccount",
                        "discriminator": [4, 0, 0, 0],
                        "accounts": [
                            {"name": "nonce", "isMut": true, "isSigner": false},
                            {"name": "recentBlockhashes", "isMut": false, "isSigner": false},
                            {"name": "authorized", "isMut": false, "isSigner": true}
                        ],
                        "args": [
                            {"name": "authorized", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "allocate",
                        "discriminator": [8, 0, 0, 0],
                        "accounts": [
                            {"name": "pubkey", "isMut": true, "isSigner": true}
                        ],
                        "args": [
                            {"name": "space", "type": "u64"}
                        ]
                    },
                    {
                        "name": "allocateWithSeed",
                        "discriminator": [9, 0, 0, 0],
                        "accounts": [
                            {"name": "account", "isMut": true, "isSigner": false},
                            {"name": "base", "isMut": true, "isSigner": true}
                        ],
                        "args": [
                            {"name": "base", "type": "publicKey"},
                            {"name": "seed", "type": "string"},
                            {"name": "space", "type": "u64"},
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "assign",
                        "discriminator": [1, 0, 0, 0],
                        "accounts": [
                            {"name": "pubkey", "isMut": true, "isSigner": true}
                        ],
                        "args": [
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "assignWithSeed",
                        "discriminator": [10, 0, 0, 0],
                        "accounts": [
                            {"name": "account", "isMut": true, "isSigner": false},
                            {"name": "base", "isMut": true, "isSigner": true}
                        ],
                        "args": [
                            {"name": "base", "type": "publicKey"},
                            {"name": "seed", "type": "string"},
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "authorizeNonceAccount",
                        "discriminator": [7, 0, 0, 0],
                        "accounts": [
                            {"name": "nonce", "isMut": true, "isSigner": false},
                            {"name": "authorized", "isMut": false, "isSigner": true}
                        ],
                        "args": [
                            {"name": "authorized", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "createAccount",
                        "discriminator": [0, 0, 0, 0],
                        "accounts": [
                            {"name": "from", "isMut": true, "isSigner": true},
                            {"name": "to", "isMut": true, "isSigner": true}
                        ],
                        "args": [
                            {"name": "lamports", "type": "u64"},
                            {"name": "space", "type": "u64"},
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "createAccountWithSeed",
                        "discriminator": [3, 0, 0, 0],
                        "accounts": [
                            {"name": "from", "isMut": true, "isSigner": true},
                            {"name": "to", "isMut": true, "isSigner": false},
                            {"name": "base", "isMut": false, "isSigner": true}
                        ],
                        "args": [
                            {"name": "base", "type": "publicKey"},
                            {"name": "seed", "type": "string"},
                            {"name": "lamports", "type": "u64"},
                            {"name": "space", "type": "u64"},
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "initializeNonceAccount",
                        "discriminator": [6, 0, 0, 0],
                        "accounts": [
                            {"name": "nonce", "isMut": true, "isSigner": true},
                            {"name": "recentBlockhashes", "isMut": false, "isSigner": false},
                            {"name": "rent", "address": "SysvarRent111111111111111111111111111111111"}
                        ],
                        "args": [
                            {"name": "authorized", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "transfer",
                        "discriminator": [2, 0, 0, 0],
                        "accounts": [
                            {"name": "from", "isMut": true, "isSigner": true},
                            {"name": "to", "isMut": true, "isSigner": false}
                        ],
                        "args": [
                            {"name": "lamports", "type": "u64"}
                        ]
                    },
                    {
                        "name": "transferWithSeed",
                        "discriminator": [11, 0, 0, 0],
                        "accounts": [
                            {"name": "from", "isMut": true, "isSigner": false},
                            {"name": "base", "isMut": true, "isSigner": true},
                            {"name": "to", "isMut": true, "isSigner": false}
                        ],
                        "args": [
                            {"name": "lamports", "type": "u64"},
                            {"name": "seed", "type": "string"},
                            {"name": "owner", "type": "publicKey"}
                        ]
                    },
                    {
                        "name": "withdrawNonceAccount",
                        "discriminator": [5, 0, 0, 0],
                        "accounts": [
                            {"name": "nonce", "isMut": true, "isSigner": false},
                            {"name": "to", "isMut": true, "isSigner": false},
                            {"name": "recentBlockhashes", "isMut": false, "isSigner": false},
                            {"name": "rent", "address": "SysvarRent111111111111111111111111111111111"},
                            {"name": "authorized", "isMut": false, "isSigner": true}
                        ],
                        "args": [
                            {"name": "lamports", "type": "u64"}
                        ]
                    }
                ],
                "accounts": [
                    {
                        "name": "nonce",
                        "type": {
                            "kind": "struct",
                            "fields": [
                                {"name": "version", "type": "u32"},
                                {"name": "state", "type": "u32"},
                                {"name": "authorizedPubkey", "type": "publicKey"},
                                {"name": "nonce", "type": "publicKey"},
                                {
                                    "name": "feeCalculator",
                                    "type": {
                                        "defined": "feeCalculator"
                                    }
                                }
                            ]
                        }
                    }
                ],
                "types": [
                    {
                        "name": "feeCalculator",
                        "type": {
                            "kind": "struct",
                            "fields": [
                                {"name": "lamportsPerSignature", "type": "u64"}
                            ]
                        }
                    }
                ]
            }');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM program_idl WHERE program_pubkey = '11111111111111111111111111111111';
        `);
  }
}
