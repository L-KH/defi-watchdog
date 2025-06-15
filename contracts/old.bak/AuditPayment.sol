// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditPayment {
    uint256 public AUDIT_PRICE = 0.003 ether;
    uint256 private requestIdCounter = 1;
    address public owner;
    
    struct AuditRequest {
        uint256 requestId;
        address user;
        address contractToAudit;
        string contractName;
        uint256 paidAmount;
        uint256 timestamp;
    }
    
    mapping(uint256 => AuditRequest) public auditRequests;
    mapping(address => uint256[]) public userRequests;
    
    event AuditPaid(
        uint256 indexed requestId,
        address indexed user,
        address indexed contractToAudit,
        string contractName,
        uint256 paidAmount
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    function requestAudit(address contractToAudit, string memory contractName) 
        external 
        payable 
        returns (uint256) 
    {
        require(msg.value >= AUDIT_PRICE, "Insufficient payment");
        require(contractToAudit != address(0), "Invalid contract address");
        require(bytes(contractName).length > 0, "Contract name cannot be empty");
        
        uint256 requestId = requestIdCounter++;
        
        AuditRequest memory newRequest = AuditRequest({
            requestId: requestId,
            user: msg.sender,
            contractToAudit: contractToAudit,
            contractName: contractName,
            paidAmount: msg.value,
            timestamp: block.timestamp
        });
        
        auditRequests[requestId] = newRequest;
        userRequests[msg.sender].push(requestId);
        
        emit AuditPaid(requestId, msg.sender, contractToAudit, contractName, msg.value);
        
        return requestId;
    }
    
    function getRequestCount() external view returns (uint256) {
        return requestIdCounter - 1;
    }
    
    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }
    
    function getAuditRequest(uint256 requestId) external view returns (AuditRequest memory) {
        return auditRequests[requestId];
    }
    
    function updateAuditPrice(uint256 newPrice) external onlyOwner {
        AUDIT_PRICE = newPrice;
    }
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    receive() external payable {
        revert("Use requestAudit function");
    }
}