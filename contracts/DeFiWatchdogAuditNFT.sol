// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DeFiWatchdogAuditNFT
 * @dev NFT contract for DeFi Watchdog security audit reports
 * @author DeFi Watchdog Team
 * 
 * Features:
 * - Free minting for static analysis reports
 * - Paid minting (0.003 ETH) for AI-powered analysis reports
 * - IPFS integration for report storage
 * - Complete audit history tracking
 * - Two-tier audit system (Static vs AI)
 */
contract DeFiWatchdogAuditNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    uint256 private _tokenIdCounter;
    
    // Pricing structure
    uint256 public constant AI_AUDIT_PRICE = 0.003 ether;
    uint256 public constant STATIC_AUDIT_PRICE = 0 ether; // Free
    
    // Audit types
    enum AuditType { STATIC, AI_POWERED }
    
    // Risk levels
    enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }
    
    // Audit report structure
    struct AuditReport {
        address contractAddress;      // Audited contract address
        address auditor;             // User who performed the audit
        AuditType auditType;         // Type of audit (Static or AI)
        RiskLevel riskLevel;         // Overall risk assessment
        uint8 securityScore;         // Security score (0-100)
        string ipfsHash;             // IPFS hash of detailed report
        string contractName;         // Name of the audited contract
        uint256 timestamp;           // When the audit was performed
        uint256 paidAmount;          // Amount paid for the audit
        bool exists;                 // Flag to check if audit exists
    }
    
    // ============ Storage Mappings ============
    
    // Core audit storage
    mapping(uint256 => AuditReport) public auditReports;
    
    // User audit history
    mapping(address => uint256[]) public userAudits;
    
    // Contract audit history  
    mapping(address => uint256[]) public contractAudits;
    
    // Track if contract already has a certificate to prevent duplicates
    mapping(address => bool) public hasCertificate;
    
    // Statistics tracking
    mapping(AuditType => uint256) public auditTypeCount;
    mapping(RiskLevel => uint256) public riskLevelCount;
    
    // ============ Events ============
    
    event AuditReportMinted(
        uint256 indexed tokenId,
        address indexed contractAddress,
        address indexed auditor,
        AuditType auditType,
        RiskLevel riskLevel,
        uint8 securityScore,
        string ipfsHash,
        uint256 paidAmount
    );
    
    event PaymentReceived(
        address indexed user,
        uint256 amount,
        AuditType auditType
    );
    
    event FeesWithdrawn(
        address indexed owner,
        uint256 amount
    );
    
    // ============ Constructor ============
    
    constructor() ERC721("DeFi Watchdog Audit Report", "DWARN") Ownable(msg.sender) {
        // Initialize counter to start from 1
        _tokenIdCounter = 1;
    }
    
    // ============ Main Functions ============
    
    /**
     * @dev Mint a static audit report NFT (Free)
     * @param contractAddress The audited contract address
     * @param contractName Name of the audited contract
     * @param ipfsHash IPFS hash of the detailed report
     * @param securityScore Security score (0-100)
     * @param riskLevel Risk level assessment
     * @return tokenId The minted NFT token ID
     */
    function mintStaticAuditReport(
        address contractAddress,
        string memory contractName,
        string memory ipfsHash,
        uint8 securityScore,
        RiskLevel riskLevel
    ) external nonReentrant returns (uint256) {
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(contractName).length > 0, "Contract name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(securityScore <= 100, "Security score must be 0-100");
        require(!hasCertificate[contractAddress], "Certificate already exists for this contract");
        
        // Verify the contract exists (has code)
        require(_isContract(contractAddress), "Address is not a contract");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Create audit report
        auditReports[tokenId] = AuditReport({
            contractAddress: contractAddress,
            auditor: msg.sender,
            auditType: AuditType.STATIC,
            riskLevel: riskLevel,
            securityScore: securityScore,
            ipfsHash: ipfsHash,
            contractName: contractName,
            timestamp: block.timestamp,
            paidAmount: 0,
            exists: true
        });
        
        // Update tracking
        userAudits[msg.sender].push(tokenId);
        contractAudits[contractAddress].push(tokenId);
        hasCertificate[contractAddress] = true;
        auditTypeCount[AuditType.STATIC]++;
        riskLevelCount[riskLevel]++;
        
        // Mint NFT with IPFS metadata
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        emit AuditReportMinted(
            tokenId,
            contractAddress,
            msg.sender,
            AuditType.STATIC,
            riskLevel,
            securityScore,
            ipfsHash,
            0
        );
        
        return tokenId;
    }
    
    /**
     * @dev Mint an AI-powered audit report NFT (0.003 ETH)
     * @param contractAddress The audited contract address
     * @param contractName Name of the audited contract
     * @param ipfsHash IPFS hash of the detailed report
     * @param securityScore Security score (0-100)
     * @param riskLevel Risk level assessment
     * @return tokenId The minted NFT token ID
     */
    function mintAIAuditReport(
        address contractAddress,
        string memory contractName,
        string memory ipfsHash,
        uint8 securityScore,
        RiskLevel riskLevel
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= AI_AUDIT_PRICE, "Insufficient payment for AI audit");
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(contractName).length > 0, "Contract name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(securityScore <= 100, "Security score must be 0-100");
        require(!hasCertificate[contractAddress], "Certificate already exists for this contract");
        
        // Verify the contract exists (has code)
        require(_isContract(contractAddress), "Address is not a contract");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Create audit report
        auditReports[tokenId] = AuditReport({
            contractAddress: contractAddress,
            auditor: msg.sender,
            auditType: AuditType.AI_POWERED,
            riskLevel: riskLevel,
            securityScore: securityScore,
            ipfsHash: ipfsHash,
            contractName: contractName,
            timestamp: block.timestamp,
            paidAmount: msg.value,
            exists: true
        });
        
        // Update tracking
        userAudits[msg.sender].push(tokenId);
        contractAudits[contractAddress].push(tokenId);
        hasCertificate[contractAddress] = true;
        auditTypeCount[AuditType.AI_POWERED]++;
        riskLevelCount[riskLevel]++;
        
        // Mint NFT with IPFS metadata
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        emit PaymentReceived(msg.sender, msg.value, AuditType.AI_POWERED);
        
        emit AuditReportMinted(
            tokenId,
            contractAddress,
            msg.sender,
            AuditType.AI_POWERED,
            riskLevel,
            securityScore,
            ipfsHash,
            msg.value
        );
        
        return tokenId;
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get audit report details by token ID
     */
    function getAuditReport(uint256 tokenId) external view returns (
        address contractAddress,
        address auditor,
        AuditType auditType,
        RiskLevel riskLevel,
        uint8 securityScore,
        string memory ipfsHash,
        string memory contractName,
        uint256 timestamp,
        uint256 paidAmount
    ) {
        require(auditReports[tokenId].exists, "Audit report does not exist");
        
        AuditReport memory report = auditReports[tokenId];
        return (
            report.contractAddress,
            report.auditor,
            report.auditType,
            report.riskLevel,
            report.securityScore,
            report.ipfsHash,
            report.contractName,
            report.timestamp,
            report.paidAmount
        );
    }
    
    /**
     * @dev Get user's audit history
     */
    function getUserAudits(address user) external view returns (uint256[] memory) {
        return userAudits[user];
    }
    
    /**
     * @dev Get contract's audit history
     */
    function getContractAudits(address contractAddress) external view returns (uint256[] memory) {
        return contractAudits[contractAddress];
    }
    
    /**
     * @dev Get total number of audits performed
     */
    function getTotalAudits() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Get statistics about audit types
     */
    function getAuditTypeStats() external view returns (uint256 staticCount, uint256 aiCount) {
        return (auditTypeCount[AuditType.STATIC], auditTypeCount[AuditType.AI_POWERED]);
    }
    
    /**
     * @dev Get statistics about risk levels
     */
    function getRiskLevelStats() external view returns (
        uint256 lowCount,
        uint256 mediumCount,
        uint256 highCount,
        uint256 criticalCount
    ) {
        return (
            riskLevelCount[RiskLevel.LOW],
            riskLevelCount[RiskLevel.MEDIUM],
            riskLevelCount[RiskLevel.HIGH],
            riskLevelCount[RiskLevel.CRITICAL]
        );
    }
    
    /**
     * @dev Check if audit report exists
     */
    function auditExists(uint256 tokenId) external view returns (bool) {
        return auditReports[tokenId].exists;
    }
    
    /**
     * @dev Get audit summary for quick display
     */
    function getAuditSummary(uint256 tokenId) external view returns (
        address contractAddr,
        string memory contractName,
        AuditType auditType,
        uint8 securityScore,
        RiskLevel riskLevel,
        uint256 timestamp
    ) {
        require(auditReports[tokenId].exists, "Audit does not exist");
        AuditReport memory report = auditReports[tokenId];
        return (
            report.contractAddress,
            report.contractName,
            report.auditType,
            report.securityScore,
            report.riskLevel,
            report.timestamp
        );
    }
    
    // ============ Owner Functions ============
    
    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FeesWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Emergency function to remove certificate status (owner only)
     * @dev Only for resolving conflicts or fixing errors
     */
    function removeCertificateStatus(address contractAddress) external onlyOwner {
        hasCertificate[contractAddress] = false;
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Check if address is a contract
     */
    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
    
    // ============ Override Functions ============
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // ============ Receive Function ============
    
    receive() external payable {
        // Accept direct ETH deposits for fees
        emit PaymentReceived(msg.sender, msg.value, AuditType.STATIC);
    }
}
