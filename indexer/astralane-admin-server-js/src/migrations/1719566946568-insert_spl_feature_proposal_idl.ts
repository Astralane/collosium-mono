import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSplFeatureProposalIdl1719566946568
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const idl = {
      version: '1.0.0',
      name: 'spl_feature_proposal',
      instructions: [
        {
          name: 'propose',
          accounts: [
            {
              name: 'fundingAddress',
              isMut: true,
              isSigner: true,
            },
            {
              name: 'featureProposalAddress',
              isMut: true,
              isSigner: true,
            },
            {
              name: 'mintAddress',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'distributorTokenAddress',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'acceptanceTokenAddress',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'feature',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'systemProgram',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'tokenProgram',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'rent',
              isMut: false,
              isSigner: false,
            },
          ],
          args: [
            {
              name: 'tokensToMint',
              type: 'u64',
            },
            {
              name: 'acceptanceCriteria',
              type: {
                defined: 'AcceptanceCriteria',
              },
            },
          ],
        },
        {
          name: 'tally',
          accounts: [
            {
              name: 'featureProposalAddress',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'acceptanceTokenAddress',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'feature',
              isMut: true,
              isSigner: false,
            },
            {
              name: 'systemProgram',
              isMut: false,
              isSigner: false,
            },
            {
              name: 'clock',
              isMut: false,
              isSigner: false,
            },
          ],
          args: [],
        },
      ],
      accounts: [
        {
          name: 'FeatureProposal',
          type: {
            kind: 'enum',
            variants: [
              {
                name: 'Uninitialized',
              },
              {
                name: 'Pending',
                fields: [
                  {
                    defined: 'AcceptanceCriteria',
                  },
                ],
              },
              {
                name: 'Accepted',
                fields: [
                  {
                    name: 'tokens_upon_acceptance',
                    type: 'u64',
                  },
                ],
              },
              {
                name: 'Expired',
              },
            ],
          },
        },
      ],
      types: [
        {
          name: 'AcceptanceCriteria',
          type: {
            kind: 'struct',
            fields: [
              {
                name: 'tokensRequired',
                type: 'u64',
              },
              {
                name: 'deadline',
                type: 'i64',
              },
            ],
          },
        },
      ],
    };

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('program_idl')
        .values({
          program_pubkey: 'Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse',
          idl: idl,
        })
        .orUpdate(['idl'], ['program_pubkey'])
        .execute();
    } catch (error) {
      console.error('Error inserting IDL:', error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `DELETE FROM program_idl WHERE program_pubkey = 'Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse';`,
      );
    } catch (error) {
      console.error('Error deleting IDL:', error);
    }
  }
}
