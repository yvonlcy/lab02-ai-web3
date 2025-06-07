// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Message {
    string public currentMessage = "Hello from Web3!";

    event MessageUpdated(string oldMessage, string newMessage);

    function setMessage(string memory _message) public {
        string memory old = currentMessage;
        currentMessage = _message;
        emit MessageUpdated(old, _message);
    }
}
