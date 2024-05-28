export const ContractAddress = '0x3eeEEBF970E4921E4bFf0EF64409421041D1DA71';
export const EthreumNull = '0x0000000000000000000000000000000000000000';
export const TIDEABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwnwer',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NFTAccepted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NFTBurned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NFTCompleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'NFTExpired',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'offer',
        type: 'address',
      },
    ],
    name: 'NFTOffer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiryDays',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'expiryTimestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderNumber',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'enum TideTokenNFT.NFTState',
        name: 'state',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'enum TideTokenNFT.ExpiryState',
        name: 'expiryState',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'currentlyListed',
        type: 'bool',
      },
    ],
    name: 'TokenListedSuccess',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'TokenExpiry',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_tideToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'acceptOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryDays',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryState',
        type: 'uint256',
      },
    ],
    name: 'createToken',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'currentBuyer',
    outputs: [
      {
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'Email',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'FullName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'Phone',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'FullAddress',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'ShippingMethod',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'declineOffer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'generateOrderNumber',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllNFTs',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getBuyerDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'buyer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'Email',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'FullName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'Phone',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'FullAddress',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ShippingMethod',
            type: 'string',
          },
        ],
        internalType: 'struct TideTokenNFT.BuyerInfo',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentTokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLatestIdOfListedToken',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getListingPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMintingCurrency',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyNFTS',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMyOffers',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getOrderNumber',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSoldNFTs',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTokenData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDays',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'seller',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'offer',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'orderNumber',
            type: 'string',
          },
          {
            internalType: 'enum TideTokenNFT.NFTState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'enum TideTokenNFT.ExpiryState',
            name: 'expiryState',
            type: 'uint8',
          },
          {
            internalType: 'bool',
            name: 'curentlyListed',
            type: 'bool',
          },
        ],
        internalType: 'struct TideTokenNFT.ListedToken',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'listPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'email',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'fullName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'phone',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'fullAddress',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'shippingMethod',
        type: 'string',
      },
    ],
    name: 'makeOffer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newMintingCurrency',
        type: 'address',
      },
    ],
    name: 'setMintingCurrency',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tideTokenAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_listPrice',
        type: 'uint256',
      },
    ],
    name: 'updateListingPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
