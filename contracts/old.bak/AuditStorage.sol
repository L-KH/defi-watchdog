// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AuditStorage
 * @dev Smart contract for storing audit reports on-chain with IPFS references
 * @author DeFi Watchdog
 */
contract AuditStorage {
    
    // Risk levels enum
    enum RiskLevel { LOW, MEDIUM, HIGH }
    
    // Audit report structure
    struct AuditReport {
        address contractAddress;    // The audited contract address
        address auditor;           // Who performed the audit (user wallet)
        string ipfsHash;           // IPFS hash of the detailed report
        uint8 securityScore;       // Security score 0-100
        RiskLevel riskLevel;       // Risk level enum
        uint256 timestamp;         // When the audit was stored
        bool exists;               // Flag to check if audit exists
    }
    
    // Storage
    mapping(uint256 => AuditReport) public auditReports;
    mapping(address => uint256[]) public userAudits;
    mapping(address => uint256[]) public contractAudits;
    
    uint256 public nextAuditId = 1;
    uint256 public storageFee = 0.003 ether;
    address public owner;
    
    // Events
    event AuditStored(
        uint256 indexed auditId,
        address indexed contractAddress,
        address indexed auditor,
        string ipfsHash,
        uint8 securityScore,
        RiskLevel riskLevel
    );
    
    event StorageFeeUpdated(uint256 oldFee, uint256 newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Save an audit report to the blockchain
     * @param contractAddress The address of the contract that was audited
     * @param ipfsHash The IPFS hash containing the detailed audit report
     * @param securityScore Security score from 0-100
     * @param riskLevel Risk level (0=LOW, 1=MEDIUM, 2=HIGH)
     * @return auditId The ID of the stored audit
     */
    function saveAuditReport(
        address contractAddress,
        string calldata ipfsHash,
        uint8 securityScore,
        RiskLevel riskLevel
    ) external payable returns (uint256 auditId) {
        require(msg.value >= storageFee, "Insufficient payment for storage fee");
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(securityScore <= 100, "Security score must be 0-100");
        
        auditId = nextAuditId++;
        
        auditReports[auditId] = AuditReport({
            contractAddress: contractAddress,
            auditor: msg.sender,
            ipfsHash: ipfsHash,
            securityScore: securityScore,
            riskLevel: riskLevel,
            timestamp: block.timestamp,
            exists: true
        });
        
        // Track audits by user and contract
        userAudits[msg.sender].push(auditId);
        contractAudits[contractAddress].push(auditId);
        
        emit AuditStored(
            auditId,
            contractAddress,
            msg.sender,
            ipfsHash,
            securityScore,
            riskLevel
        );
        
        return auditId;
    }
    
    /**
     * @dev Get an audit report by ID
     * @param auditId The audit ID to retrieve
     * @return contractAddress The audited contract address
     * @return auditor The auditor's address
     * @return ipfsHash The IPFS hash of the report
     * @return securityScore The security score
     * @return riskLevel The risk level
     * @return timestamp When the audit was performed
     */
    function getAuditReport(uint256 auditId) external view returns (
        address contractAddress,
        address auditor,
        string memory ipfsHash,
        uint8 securityScore,
        RiskLevel riskLevel,
        uint256 timestamp
    ) {
        require(auditReports[auditId].exists, "Audit report does not exist");
        
        AuditReport memory audit = auditReports[auditId];
        return (
            audit.contractAddress,
            audit.auditor,
            audit.ipfsHash,
            audit.securityScore,
            audit.riskLevel,
            audit.timestamp
        );
    }
    
    /**
     * @dev Get all audit IDs for a specific user
     * @param user The user's address
     * @return Array of audit IDs
     */
    function getUserAudits(address user) external view returns (uint256[] memory) {
        return userAudits[user];
    }
    
    /**
     * @dev Get all audit IDs for a specific contract
     * @param contractAddress The contract address
     * @return Array of audit IDs
     */
    function getContractAudits(address contractAddress) external view returns (uint256[] memory) {
        return contractAudits[contractAddress];
    }
    
    /**
     * @dev Get the current storage fee
     * @return The storage fee in wei
     */
    function getStorageFee() external view returns (uint256) {
        return storageFee;
    }
    
    /**
     * @dev Get total number of audits stored
     * @return Total audit count
     */
    function getTotalAudits() external view returns (uint256) {
        return nextAuditId - 1;
    }
    
    /**
     * @dev Check if an audit exists
     * @param auditId The audit ID to check
     * @return Whether the audit exists
     */
    function auditExists(uint256 auditId) external view returns (bool) {
        return auditReports[auditId].exists;
    }
    
    /**
     * @dev Get audit summary for display
     * @param auditId The audit ID
     * @return contractAddr The audited contract
     * @return score The security score
     * @return risk The risk level
     * @return auditTime The audit timestamp
     */
    function getAuditSummary(uint256 auditId) external view returns (
        address contractAddr,
        uint8 score,
        RiskLevel risk,
        uint256 auditTime
    ) {
        require(auditReports[auditId].exists, "Audit does not exist");
        AuditReport memory audit = auditReports[auditId];
        return (audit.contractAddress, audit.securityScore, audit.riskLevel, audit.timestamp);
    }
    
    // Owner functions
    
    /**
     * @dev Update the storage fee (owner only)
     * @param newFee The new storage fee in wei
     */
    function updateStorageFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = storageFee;
        storageFee = newFee;
        emit StorageFeeUpdated(oldFee, newFee);
    }
    
    /**
     * @dev Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Transfer ownership (owner only)
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
