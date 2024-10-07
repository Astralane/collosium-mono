export type TTokenMetaDataHelius = {
  account: string;
  onChainAccountInfo: {
    accountInfo: {
      key: string;
      isSigner: boolean;
      isWritable: boolean;
      lamports: number;
      data: {
        parsed: {
          info: {
            decimals: number;
            freezeAuthority: string;
            isInitialized: boolean;
            mintAuthority: string;
            supply: string;
          };
          type: string;
        };
        program: string;
        space: number;
      };
      owner: string;
      executable: boolean;
      rentEpoch: number;
    };
    error: string;
  };
  onChainMetadata: {
    metadata: {
      tokenStandard: string;
      key: string;
      updateAuthority: string;
      mint: string;
      data: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: string | null;
      };
      primarySaleHappened: boolean;
      isMutable: boolean;
      editionNonce: number;
      uses: {
        useMethod: string;
        remaining: number;
        total: number;
      };
      collection: null;
      collectionDetails: null;
    };
    error: string;
  };
  offChainMetadata: {
    metadata: {
      createdOn: string;
      description: string;
      image: string;
      name: string;
      showName: boolean;
      symbol: string;
    };

    uri: string;
    error: string;
  };
  legacyMetadata: {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
    tags: null;
    extensions: {
      coingeckoId: string;
      serumV3Usdc: string;
      serumV3Usdt: string;
      website: string;
    };
  };
};
