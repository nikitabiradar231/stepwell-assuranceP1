// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import { Script, console } from "forge-std/Script.sol";
import { MeetupAssurance } from "../contracts/MeetupAssurance.sol";

contract DeployScript is Script {
    function run() external returns (MeetupAssurance campaign) {
        uint256 targetWei = vm.envOr("CAMPAIGN_TARGET_WEI", uint256(0.1 ether));
        uint256 deadline = vm.envOr("CAMPAIGN_DEADLINE", uint256(block.timestamp + 7 days));
        address payable beneficiary = payable(vm.envOr("CAMPAIGN_BENEFICIARY", address(0)));

        if (beneficiary == address(0)) {
            beneficiary = payable(msg.sender);
        }

        require(targetWei > 0, "CAMPAIGN_TARGET_WEI must be > 0");
        require(deadline > block.timestamp, "CAMPAIGN_DEADLINE must be in the future");
        require(beneficiary != address(0), "CAMPAIGN_BENEFICIARY cannot be zero address");

        console.log("=== Stepwell: MeetupAssurance Deployment ===");
        console.log("Target (wei):", targetWei);
        console.log("Deadline (timestamp):", deadline);
        console.log("Beneficiary:", beneficiary);

        vm.startBroadcast();
        campaign = new MeetupAssurance(targetWei, deadline, beneficiary);
        vm.stopBroadcast();

        console.log("--------------------------------------------");
        console.log("MeetupAssurance deployed at:", address(campaign));
        console.log("============================================");
    }
}
