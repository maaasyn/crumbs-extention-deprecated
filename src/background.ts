import {
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
  keccak256,
  toHex,
} from "viem";

import { sepolia } from "viem/chains";
// import {
//   crumbs_contract_abi,
//   crumbs_contract_address,
// } from "./contract/details";

console.log("background.ts, init");

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.message === "getCurrentTabInfo") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      sendResponse(tabs[0].id);
    });
    return true;
  }

  if (request.message === "sendTransaction") {
    console.log("sendTransaction", request.data);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const crumbs_contract_address =
        "0x97fcB3d3Ca78e74b710A8f0D1EE1f6BDA814cb2f";

      const crumbs_contract_abi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "url",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "commentHash",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
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

      const currentTabId = tabs[0].id!;
      const currentTabUrl = tabs[0].url!;

      console.log({ currentTabId, currentTabUrl });

      console.log({ urlHash: keccak256(toHex(currentTabUrl)) });

      const contract = getContract({
        abi: crumbs_contract_abi,
        address: crumbs_contract_address,
        client: createPublicClient({
          chain: sepolia,
          transport: http(),
        }),
      });

      // console.log({ contract });

      const encodedFn = encodeFunctionData({
        abi: contract.abi,
        functionName: "storeComment",
        args: [
          keccak256(toHex(currentTabUrl)),
          keccak256(toHex((request?.data?.message as string) || "Hello")),
        ],
      });

      chrome.scripting
        .executeScript({
          args: [encodedFn, contract.address],
          target: { tabId: currentTabId },
          func: async (encodedFnData, contractAddress) => {
            console.log({ location: location.href });

            console.log("executeScript");

            console.log({ "window.ethereum": window.ethereum });

            if (!window.ethereum) {
              console.error("No ethereum provider found");
              return false;
            }
            const provider = window.ethereum;

            const accounts = (await provider // Or window.ethereum if you don't support EIP-6963.
              .request({ method: "eth_requestAccounts" })) as string[];

            console.log({ accounts });

            if (!accounts) {
              console.error("No accounts found");
            }

            const account = accounts[0];

            console.log({ account });

            const tx = await provider.request({
              method: "eth_sendTransaction",
              params: [
                {
                  from: account,
                  to: contractAddress,
                  data: encodedFnData,
                },
              ],
            });

            console.log({ tx });
            sendResponse({ tx });
          },
          world: "MAIN",
        })
        .then((results) => {
          console.log({ results });
          // setChain(results[0].result?.chainId as string);
          // setAccount(results[0].result?.account[0] as unknown as string);
        });
    });

    return true;
  }
});
