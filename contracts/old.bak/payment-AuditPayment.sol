// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuditPayment
 * @dev Handles payments for DeFi Watchdog premium audits with IPFS report storage
 */
contract AuditPayment is Ownable, ReentrancyGuard {
    // Audit price: 0.003 ETH (~$10 at $3333/ETH)
    uint256 public constant AUDIT_PRICE = 0.003 ether;
    
    // Counter for audit requests
    uint256 public requestCounter;
    
    // Audit request structure
    struct AuditRequest {
        address user;
        address contractToAudit;
        string contractName;
        uint256 paidAmount;
        uint256 timestamp;
        bool completed;
        string reportIPFSHash;
        uint256 securityScore;
        string riskLevel;
    }
    
    // Mapping from request ID to audit request
    mapping(uint256 => AuditRequest) public auditRequests;
    
    // Mapping from user address to their request IDs
    mapping(address => uint256[]) public userRequests;
    
    // Mapping to check if a user has audited a specific contract
    mapping(address => mapping(address => uint256)) public userContractAudits;
    
    // Events
    event AuditPaid(
        uint256 indexed requestId, 
        address indexed user, 
        address indexed contractToAudit,
        string contractName,
        uint256 paidAmount
    );
    
    event AuditCompleted(
        uint256 indexed requestId,
        string reportIPFSHash,
        uint256 securityScore,
        string riskLevel
    );
    
    event RefundIssued(
        uint256 indexed requestId,
        address indexed user,
        uint256 amount
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Request a premium audit by paying the required fee
     * @param _contractToAudit Address of the contract to audit
     * @param _contractName Name of the contract for easy identification
     * @return requestId The ID of the audit request
     */
    function requestAudit(
        address _contractToAudit,
        string memory _contractName
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= AUDIT_PRICE, "Insufficient payment: 0.003 ETH required");
        require(_contractToAudit != address(0), "Invalid contract address");
        require(bytes(_contractName).length > 0, "Contract name required");
        
        // Check if user already audited this contract (allow re-audits)
        uint256 existingRequestId = userContractAudits[msg.sender][_contractToAudit];
        
        requestCounter++;
        uint256 newRequestId = requestCounter;
        
        // Create audit request
        auditRequests[newRequestId] = AuditRequest({
            user: msg.sender,
            contractToAudit: _contractToAudit,
            contractName: _contractName,
            paidAmount: msg.value,
            timestamp: block.timestamp,
            completed: false,
            reportIPFSHash: "",
            securityScore: 0,
            riskLevel: ""
        });
        
        // Track user's requests
        userRequests[msg.sender].push(newRequestId);
        userContractAudits[msg.sender][_contractToAudit] = newRequestId;
        
        // Emit payment event
        emit AuditPaid(newRequestId, msg.sender, _contractToAudit, _contractName, msg.value);
        
        // Return excess payment if any
        if (msg.value > AUDIT_PRICE) {
            uint256 excess = msg.value - AUDIT_PRICE;
            (bool refunded, ) = msg.sender.call{value: excess}("");
            require(refunded, "Excess refund failed");
        }
        
        return newRequestId;
    }
    
    /**
     * @dev Complete an audit by storing the IPFS hash (only owner)
     * @param _requestId The audit request ID
     * @param _ipfsHash IPFS hash of the audit report
     * @param _securityScore Security score (0-100)
     * @param _riskLevel Risk level string
     */
    function completeAudit(
        uint256 _requestId,
        string memory _ipfsHash,
        uint256 _securityScore,
        string memory _riskLevel
    ) external onlyOwner {
        AuditRequest storage request = auditRequests[_requestId];
        require(request.user != address(0), "Invalid request ID");
        require(!request.completed, "Audit already completed");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(_securityScore <= 100, "Invalid security score");
        
        request.completed = true;
        request.reportIPFSHash = _ipfsHash;
        request.securityScore = _securityScore;
        request.riskLevel = _riskLevel;
        
        emit AuditCompleted(_requestId, _ipfsHash, _securityScore, _riskLevel);
    }
    
    /**
     * @dev Issue refund for failed audits (only owner)
     * @param _requestId The audit request ID
     */
    function issueRefund(uint256 _requestId) external onlyOwner nonReentrant {
        AuditRequest storage request = auditRequests[_requestId];
        require(request.user != address(0), "Invalid request ID");
        require(!request.completed, "Cannot refund completed audit");
        require(request.paidAmount > 0, "No payment to refund");
        
        uint256 refundAmount = request.paidAmount;
        request.paidAmount = 0; // Prevent double refunds
        
        (bool sent, ) = request.user.call{value: refundAmount}("");
        require(sent, "Refund failed");
        
        emit RefundIssued(_requestId, request.user, refundAmount);
    }
    
    /**
     * @dev Get all audit requests for a user
     * @param _user User address
     * @return Array of request IDs
     */
    function getUserRequests(address _user) external view returns (uint256[] memory) {
        return userRequests[_user];
    }
    
    /**
     * @dev Get detailed audit history for a user
     * @param _user User address
     * @return requests Array of audit requests
     */
    function getUserAuditHistory(address _user) external view returns (AuditRequest[] memory) {
        uint256[] memory requestIds = userRequests[_user];
        AuditRequest[] memory requests = new AuditRequest[](requestIds.length);
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            requests[i] = auditRequests[requestIds[i]];
        }
        
        return requests;
    }
    
    /**
     * @dev Check if audit is paid and valid
     * @param _requestId Request ID to check
     * @return isPaid Whether the audit is paid
     * @return user Address of the user who paid
     */
    function isAuditPaid(uint256 _requestId) external view returns (bool isPaid, address user) {
        AuditRequest memory request = auditRequests[_requestId];
        isPaid = request.paidAmount >= AUDIT_PRICE && request.user != address(0);
        user = request.user;
    }
    
    /**
     * @dev Withdraw accumulated fees (only owner)
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Withdrawal failed");
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency function to update audit completion if needed
     */
    function emergencyCompleteAudit(uint256 _requestId) external onlyOwner {
        AuditRequest storage request = auditRequests[_requestId];
        require(request.user != address(0), "Invalid request ID");
        
        if (!request.completed) {
            request.completed = true;
            request.reportIPFSHash = "emergency-completion";
            request.securityScore = 0;
            request.riskLevel = "Unknown";
        }
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
