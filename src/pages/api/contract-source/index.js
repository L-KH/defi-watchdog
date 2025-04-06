/**
 * API endpoint for fetching contract source code
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, network = 'linea' } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  try {
    // In a real application, this would fetch the source code from Etherscan, Lineascan, etc.
    // Here we're returning a sample contract for demonstration purposes
    
    // Sample contract source codes by network and address
    const sampleContracts = {
      // Linea network contracts
      'linea': {
        '0x2d8879046f1559e53eb052e949e9544bcb72f414': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OdosRouter
 * @dev Advanced DEX aggregator with multi-route swaps
 */
contract OdosRouter is Ownable {
    mapping(address => bool) public authorizedCallers;
    uint256 public constant MAX_FEE = 100; // 1%
    uint256 public feePercentage = 30; // 0.3%
    address public feeCollector;
    
    event Swap(address indexed sender, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event FeeCollected(address indexed token, uint256 amount);
    
    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
    }
    
    function authorize(address caller, bool status) external onlyOwner {
        authorizedCallers[caller] = status;
    }
    
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= MAX_FEE, "Fee too high");
        feePercentage = _feePercentage;
    }
    
    function setFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }
    
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        bytes calldata routeData
    ) external returns (uint256 amountOut) {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Unauthorized");
        
        // Transfer tokens from sender
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Calculate fee
        uint256 fee = (amountIn * feePercentage) / 10000;
        uint256 amountInAfterFee = amountIn - fee;
        
        // Execute swap using routeData (simplified)
        // In a real implementation, this would decode routeData and execute the swap
        amountOut = executeSwap(tokenIn, tokenOut, amountInAfterFee, routeData);
        require(amountOut >= minAmountOut, "Slippage too high");
        
        // Collect fee
        if (fee > 0 && feeCollector != address(0)) {
            IERC20(tokenIn).transfer(feeCollector, fee);
            emit FeeCollected(tokenIn, fee);
        }
        
        // Transfer output tokens to sender
        IERC20(tokenOut).transfer(msg.sender, amountOut);
        
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }
    
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        bytes calldata routeData
    ) internal returns (uint256) {
        // Simplified implementation for demo
        // In a real contract, this would decode routeData and execute the swap through various DEXes
        return amountIn; // Simplified return
    }
    
    // Allow receiving ETH
    receive() external payable {}
    
    // Allow owner to rescue tokens
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
    
    // Vulnerable function for demo purposes
    function unsafeCall(address target, bytes calldata data) external onlyOwner {
        (bool success, ) = target.call(data);
        require(success, "Call failed");
    }
}`,
        '0x610d2f07b7edc67565160f587f37636194c34e74': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LynexDEX
 * @dev Decentralized exchange with concentrated liquidity
 */
contract LynexDEX is Ownable {
    struct Pool {
        address token0;
        address token1;
        uint256 reserve0;
        uint256 reserve1;
        uint256 fee;
        bool initialized;
    }
    
    mapping(bytes32 => Pool) public pools;
    mapping(address => mapping(bytes32 => uint256)) public liquidity;
    mapping(address => bool) public whitelisted;
    
    event PoolCreated(bytes32 indexed poolId, address indexed token0, address indexed token1, uint256 fee);
    event LiquidityAdded(bytes32 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(bytes32 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1);
    event Swap(bytes32 indexed poolId, address indexed sender, address indexed recipient, uint256 amountIn, uint256 amountOut);
    
    constructor() {
        whitelisted[msg.sender] = true;
    }
    
    function createPool(address token0, address token1, uint256 fee) external returns (bytes32) {
        require(token0 != token1, "Identical tokens");
        require(token0 != address(0) && token1 != address(0), "Zero address");
        require(fee <= 10000, "Fee too high"); // Max 10%
        
        // Sort tokens
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
        }
        
        bytes32 poolId = keccak256(abi.encodePacked(token0, token1, fee));
        require(!pools[poolId].initialized, "Pool exists");
        
        pools[poolId] = Pool({
            token0: token0,
            token1: token1,
            reserve0: 0,
            reserve1: 0,
            fee: fee,
            initialized: true
        });
        
        emit PoolCreated(poolId, token0, token1, fee);
        return poolId;
    }
    
    function addLiquidity(
        bytes32 poolId,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    ) external returns (uint256 amount0, uint256 amount1) {
        Pool storage pool = pools[poolId];
        require(pool.initialized, "Pool not initialized");
        
        // Calculate amounts
        if (pool.reserve0 == 0 && pool.reserve1 == 0) {
            amount0 = amount0Desired;
            amount1 = amount1Desired;
        } else {
            uint256 amount1Optimal = (amount0Desired * pool.reserve1) / pool.reserve0;
            if (amount1Optimal <= amount1Desired) {
                require(amount1Optimal >= amount1Min, "Insufficient amount1");
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            } else {
                uint256 amount0Optimal = (amount1Desired * pool.reserve0) / pool.reserve1;
                require(amount0Optimal >= amount0Min, "Insufficient amount0");
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
        }
        
        // Transfer tokens
        IERC20(pool.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(pool.token1).transferFrom(msg.sender, address(this), amount1);
        
        // Update reserves
        pool.reserve0 += amount0;
        pool.reserve1 += amount1;
        
        // Update liquidity
        liquidity[msg.sender][poolId] += calculateLiquidity(amount0, amount1);
        
        emit LiquidityAdded(poolId, msg.sender, amount0, amount1);
        return (amount0, amount1);
    }
    
    function removeLiquidity(
        bytes32 poolId,
        uint256 liquidityAmount,
        uint256 amount0Min,
        uint256 amount1Min
    ) external returns (uint256 amount0, uint256 amount1) {
        Pool storage pool = pools[poolId];
        require(pool.initialized, "Pool not initialized");
        
        uint256 userLiquidity = liquidity[msg.sender][poolId];
        require(userLiquidity >= liquidityAmount, "Insufficient liquidity");
        
        // Calculate amounts
        amount0 = (liquidityAmount * pool.reserve0) / calculateTotalLiquidity(poolId);
        amount1 = (liquidityAmount * pool.reserve1) / calculateTotalLiquidity(poolId);
        
        require(amount0 >= amount0Min, "Insufficient amount0");
        require(amount1 >= amount1Min, "Insufficient amount1");
        
        // Update liquidity
        liquidity[msg.sender][poolId] -= liquidityAmount;
        
        // Update reserves
        pool.reserve0 -= amount0;
        pool.reserve1 -= amount1;
        
        // Transfer tokens
        IERC20(pool.token0).transfer(msg.sender, amount0);
        IERC20(pool.token1).transfer(msg.sender, amount1);
        
        emit LiquidityRemoved(poolId, msg.sender, amount0, amount1);
        return (amount0, amount1);
    }
    
    function swap(
        bytes32 poolId,
        bool zeroForOne,
        uint256 amountIn,
        uint256 amountOutMin,
        address recipient
    ) external returns (uint256 amountOut) {
        Pool storage pool = pools[poolId];
        require(pool.initialized, "Pool not initialized");
        
        address tokenIn = zeroForOne ? pool.token0 : pool.token1;
        address tokenOut = zeroForOne ? pool.token1 : pool.token0;
        
        // Transfer input tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Calculate output amount with fee
        uint256 amountInWithFee = (amountIn * (10000 - pool.fee)) / 10000;
        
        if (zeroForOne) {
            // token0 -> token1
            amountOut = (amountInWithFee * pool.reserve1) / (pool.reserve0 + amountInWithFee);
            require(amountOut >= amountOutMin, "Insufficient output amount");
            
            pool.reserve0 += amountIn;
            pool.reserve1 -= amountOut;
        } else {
            // token1 -> token0
            amountOut = (amountInWithFee * pool.reserve0) / (pool.reserve1 + amountInWithFee);
            require(amountOut >= amountOutMin, "Insufficient output amount");
            
            pool.reserve1 += amountIn;
            pool.reserve0 -= amountOut;
        }
        
        // Transfer output tokens
        IERC20(tokenOut).transfer(recipient, amountOut);
        
        emit Swap(poolId, msg.sender, recipient, amountIn, amountOut);
        return amountOut;
    }
    
    // Internal helper functions
    function calculateLiquidity(uint256 amount0, uint256 amount1) internal pure returns (uint256) {
        return sqrt(amount0 * amount1);
    }
    
    function calculateTotalLiquidity(bytes32 poolId) internal view returns (uint256) {
        // In a real implementation, this would track total liquidity shares
        Pool storage pool = pools[poolId];
        return sqrt(pool.reserve0 * pool.reserve1);
    }
    
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    
    // Privileged functions
    function updateWhitelist(address account, bool status) external {
        require(msg.sender == owner() || whitelisted[msg.sender], "Not authorized");
        whitelisted[account] = status;
    }
    
    // Vulnerable function for demo purposes
    function emergencyWithdraw(address token, uint256 amount) external {
        // Missing access control
        IERC20(token).transfer(msg.sender, amount);
    }
}`,
      },
      // Sonic network contracts
      'sonic': {
        '0xDd0F30DdC0D6B16B3e1E40bd7e95854246Ec3A13': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SonicSwapRouter
 * @dev High-performance DEX router for the Sonic blockchain
 */
contract SonicSwapRouter is Ownable {
    struct Route {
        address from;
        address to;
        address pair;
    }
    
    address public factory;
    address public SONIC;
    
    mapping(address => bool) public integrators;
    uint256 public feeBase = 10000;
    uint256 public integratorFee = 25; // 0.25%
    uint256 public protocolFee = 5; // 0.05%
    address public feeCollector;
    
    event Swap(address indexed sender, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event SetFactory(address indexed factory);
    event SetIntegrator(address indexed integrator, bool status);
    event SetFees(uint256 integratorFee, uint256 protocolFee);
    
    constructor(address _factory, address _SONIC, address _feeCollector) {
        factory = _factory;
        SONIC = _SONIC;
        feeCollector = _feeCollector;
    }
    
    function setFactory(address _factory) external onlyOwner {
        factory = _factory;
        emit SetFactory(_factory);
    }
    
    function setIntegrator(address _integrator, bool _status) external onlyOwner {
        integrators[_integrator] = _status;
        emit SetIntegrator(_integrator, _status);
    }
    
    function setFees(uint256 _integratorFee, uint256 _protocolFee) external onlyOwner {
        require(_integratorFee + _protocolFee <= 100, "Fees too high");
        integratorFee = _integratorFee;
        protocolFee = _protocolFee;
        emit SetFees(_integratorFee, _protocolFee);
    }
    
    function setFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }
    
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        Route[] calldata routes,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(deadline >= block.timestamp, "Expired");
        
        address tokenIn = routes[0].from;
        address tokenOut = routes[routes.length - 1].to;
        
        // Transfer input tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Calculate fee if the sender is an integrator
        uint256 feeAmount = 0;
        uint256 protocolFeeAmount = 0;
        
        if (integrators[msg.sender]) {
            feeAmount = (amountIn * integratorFee) / feeBase;
            protocolFeeAmount = (amountIn * protocolFee) / feeBase;
            
            if (feeAmount > 0) {
                // Send fee to integrator
                IERC20(tokenIn).transfer(msg.sender, feeAmount);
            }
            
            if (protocolFeeAmount > 0 && feeCollector != address(0)) {
                // Send protocol fee to collector
                IERC20(tokenIn).transfer(feeCollector, protocolFeeAmount);
            }
        }
        
        uint256 netAmount = amountIn - feeAmount - protocolFeeAmount;
        
        // Execute swap using routes
        amounts = executeSwap(netAmount, amountOutMin, routes, to);
        
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amounts[amounts.length - 1]);
        return amounts;
    }
    
    function executeSwap(
        uint256 amountIn,
        uint256 amountOutMin,
        Route[] calldata routes,
        address to
    ) internal returns (uint256[] memory amounts) {
        // Simplified implementation for demo
        // In a real contract, this would execute the route through the pairs
        
        // Just return the amounts (simplified)
        amounts = new uint256[](routes.length + 1);
        amounts[0] = amountIn;
        
        for (uint256 i = 0; i < routes.length; i++) {
            // Simplified, would actually perform the swap through each pair
            amounts[i + 1] = amounts[i];
        }
        
        require(amounts[amounts.length - 1] >= amountOutMin, "Insufficient output amount");
        
        // Transfer output tokens to recipient
        IERC20(routes[routes.length - 1].to).transfer(to, amounts[amounts.length - 1]);
        
        return amounts;
    }
    
    // Allow the contract to receive SONIC tokens
    function withdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
    
    // Allow receiving native Sonic coins
    receive() external payable {}
}`,
        '0x19B25E3f1B8d35a2C5a805c0b271ECeBE1E8A4Ec': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SonicStaking
 * @dev Staking contract for Sonic network tokens
 */
contract SonicStaking is Ownable, ReentrancyGuard {
    struct StakingInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastClaimTime;
        uint256 lockEnd;
    }
    
    struct PoolInfo {
        IERC20 stakeToken;
        IERC20 rewardToken;
        uint256 rewardPerBlock;
        uint256 lastRewardBlock;
        uint256 accRewardPerShare;
        uint256 totalStaked;
        uint256 allocPoint;
        uint256 lockDuration;
        bool paused;
    }
    
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => StakingInfo)) public userInfo;
    
    uint256 public totalAllocPoint = 0;
    uint256 public startBlock;
    uint256 public constant REWARD_PRECISION = 1e12;
    
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event ClaimReward(address indexed user, uint256 indexed pid, uint256 amount);
    event PoolAdded(uint256 indexed pid, address stakeToken, address rewardToken, uint256 rewardPerBlock, uint256 lockDuration);
    event PoolUpdated(uint256 indexed pid, uint256 rewardPerBlock, uint256 allocPoint);
    
    constructor(uint256 _startBlock) {
        startBlock = _startBlock > block.number ? _startBlock : block.number;
    }
    
    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }
    
    function addPool(
        IERC20 _stakeToken,
        IERC20 _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _allocPoint,
        uint256 _lockDuration,
        bool _withUpdate
    ) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint += _allocPoint;
        
        poolInfo.push(
            PoolInfo({
                stakeToken: _stakeToken,
                rewardToken: _rewardToken,
                rewardPerBlock: _rewardPerBlock,
                lastRewardBlock: lastRewardBlock,
                accRewardPerShare: 0,
                totalStaked: 0,
                allocPoint: _allocPoint,
                lockDuration: _lockDuration,
                paused: false
            })
        );
        
        emit PoolAdded(
            poolInfo.length - 1,
            address(_stakeToken),
            address(_rewardToken),
            _rewardPerBlock,
            _lockDuration
        );
    }
    
    function updatePool(
        uint256 _pid,
        uint256 _rewardPerBlock,
        uint256 _allocPoint,
        bool _withUpdate
    ) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        
        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].rewardPerBlock = _rewardPerBlock;
        
        emit PoolUpdated(_pid, _rewardPerBlock, _allocPoint);
    }
    
    function setPaused(uint256 _pid, bool _paused) external onlyOwner {
        poolInfo[_pid].paused = _paused;
    }
    
    function massUpdatePools() public {
        for (uint256 pid = 0; pid < poolInfo.length; ++pid) {
            updatePool(pid);
        }
    }
    
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        
        if (pool.totalStaked == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        
        uint256 multiplier = block.number - pool.lastRewardBlock;
        uint256 reward = multiplier * pool.rewardPerBlock * pool.allocPoint / totalAllocPoint;
        
        // Update accRewardPerShare
        pool.accRewardPerShare += reward * REWARD_PRECISION / pool.totalStaked;
        pool.lastRewardBlock = block.number;
    }
    
    function deposit(uint256 _pid, uint256 _amount) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        StakingInfo storage user = userInfo[_pid][msg.sender];
        
        require(!pool.paused, "Pool is paused");
        updatePool(_pid);
        
        // If user already has funds, claim pending rewards first
        if (user.amount > 0) {
            uint256 pending = user.amount * pool.accRewardPerShare / REWARD_PRECISION - user.rewardDebt;
            if (pending > 0) {
                safeRewardTransfer(pool.rewardToken, msg.sender, pending);
                emit ClaimReward(msg.sender, _pid, pending);
            }
        }
        
        // Update user staking info
        if (_amount > 0) {
            pool.stakeToken.transferFrom(address(msg.sender), address(this), _amount);
            user.amount += _amount;
            user.lockEnd = block.timestamp + pool.lockDuration;
            pool.totalStaked += _amount;
        }
        
        user.rewardDebt = user.amount * pool.accRewardPerShare / REWARD_PRECISION;
        user.lastClaimTime = block.timestamp;
        
        emit Deposit(msg.sender, _pid, _amount);
    }
    
    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        StakingInfo storage user = userInfo[_pid][msg.sender];
        
        require(user.amount >= _amount, "Insufficient balance");
        require(user.lockEnd <= block.timestamp, "Tokens still locked");
        
        updatePool(_pid);
        
        // Calculate pending rewards
        uint256 pending = user.amount * pool.accRewardPerShare / REWARD_PRECISION - user.rewardDebt;
        
        // Update user info before transfers
        if (_amount > 0) {
            user.amount -= _amount;
            pool.totalStaked -= _amount;
        }
        
        user.rewardDebt = user.amount * pool.accRewardPerShare / REWARD_PRECISION;
        
        // Process transfers
        if (pending > 0) {
            safeRewardTransfer(pool.rewardToken, msg.sender, pending);
            emit ClaimReward(msg.sender, _pid, pending);
        }
        
        if (_amount > 0) {
            pool.stakeToken.transfer(address(msg.sender), _amount);
        }
        
        emit Withdraw(msg.sender, _pid, _amount);
    }
    
    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        StakingInfo storage user = userInfo[_pid][msg.sender];
        
        uint256 amount = user.amount;
        require(amount > 0, "No tokens staked");
        
        user.amount = 0;
        user.rewardDebt = 0;
        pool.totalStaked -= amount;
        
        pool.stakeToken.transfer(address(msg.sender), amount);
        emit Withdraw(msg.sender, _pid, amount);
    }
    
    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        StakingInfo storage user = userInfo[_pid][_user];
        
        if (user.amount == 0) {
            return 0;
        }
        
        uint256 accRewardPerShare = pool.accRewardPerShare;
        
        if (block.number > pool.lastRewardBlock && pool.totalStaked > 0) {
            uint256 multiplier = block.number - pool.lastRewardBlock;
            uint256 reward = multiplier * pool.rewardPerBlock * pool.allocPoint / totalAllocPoint;
            accRewardPerShare += reward * REWARD_PRECISION / pool.totalStaked;
        }
        
        return user.amount * accRewardPerShare / REWARD_PRECISION - user.rewardDebt;
    }
    
    function safeRewardTransfer(IERC20 token, address to, uint256 amount) internal {
        uint256 tokenBal = token.balanceOf(address(this));
        if (amount > tokenBal) {
            token.transfer(to, tokenBal);
        } else {
            token.transfer(to, amount);
        }
    }
    
    // Function to recover wrong tokens sent to contract
    function recoverToken(IERC20 token, uint256 amount) external onlyOwner {
        token.transfer(owner(), amount);
    }
}`,
      }
    };

    // Default placeholder contract for addresses not in the sample set
    const defaultContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SampleContract
 * @dev This is a placeholder contract for demonstration
 */
contract SampleContract {
    address public owner;
    mapping(address => uint256) public balances;
    
    constructor() {
        owner = msg.sender;
    }
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
    
    // Potential vulnerability for demonstration
    function transferOwnership(address newOwner) external {
        // Missing access control
        owner = newOwner;
    }
}`;

    // Try to get contract from samples, fall back to default if not found
    const source = sampleContracts[network]?.[address.toLowerCase()] || defaultContract;

    return res.status(200).json({
      address,
      network,
      source,
      compiler: 'v0.8.17+commit.8df45f5f',
      success: true
    });
  } catch (error) {
    console.error('Error fetching contract source:', error);
    return res.status(500).json({ error: 'Failed to fetch contract source' });
  }
}
