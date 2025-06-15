// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DeFiWatchdogAuditNFTDemo
 * @dev Demo version that allows ANY address (not just contracts)
 */
contract DeFiWatchdogAuditNFTDemo is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    uint256 private _tokenIdCounter;
    uint256 public constant STATIC_AUDIT_PRICE = 0 ether;
    
    enum AuditType { STATIC, AI_POWERED }
    enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }
    
    struct AuditReport {
        address contractAddress;
        address auditor;
        AuditType auditType;
        RiskLevel riskLevel;
        uint8 securityScore;
        string ipfsHash;
        string contractName;
        uint256 timestamp;
        uint256 paidAmount;
        bool exists;
    }
    
    mapping(uint256 => AuditReport) public auditReports;
    mapping(address => uint256[]) public userAudits;
    mapping(address => uint256[]) public contractAudits;
    mapping(address => uint256) public certificateCount; // Allow multiple certificates per address
    
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
    
    constructor() ERC721("DeFi Watchdog Audit Demo", "DWARD") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }
    
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
        
        // DEMO: No contract validation, allow any address
        // DEMO: Allow multiple certificates per address
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
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
        
        userAudits[msg.sender].push(tokenId);
        contractAudits[contractAddress].push(tokenId);
        certificateCount[contractAddress]++;
        
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
    
    function hasCertificate(address contractAddress) external view returns (bool) {
        return certificateCount[contractAddress] > 0;
    }
    
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
    
    function getUserAudits(address user) external view returns (uint256[] memory) {
        return userAudits[user];
    }
    
    function getTotalAudits() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
