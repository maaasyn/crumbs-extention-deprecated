export const crumbs_contract_address =
  "0x97fcB3d3Ca78e74b710A8f0D1EE1f6BDA814cb2f";

export const crumbs_contract_abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "url", type: "bytes32" },
      {
        indexed: false,
        internalType: "bytes32",
        name: "commentHash",
        type: "bytes32",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "CommentStored",
    type: "event",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "commentsByUrl",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_url", type: "string" }],
    name: "getCommentsByUrl",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "url", type: "bytes32" }],
    name: "getCommentsByUrlHash",
    outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_url", type: "bytes32" },
      { internalType: "bytes32", name: "_commentHash", type: "bytes32" },
    ],
    name: "storeComment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_url", type: "string" },
      { internalType: "string", name: "_comment", type: "string" },
    ],
    name: "storeCommentByUrlAndString",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "comment", type: "string" },
      { internalType: "string", name: "_url", type: "string" },
    ],
    name: "verifyComment",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
