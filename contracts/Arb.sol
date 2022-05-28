//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
	function totalSupply() external view returns (uint);
	function balanceOf(address account) external view returns (uint);
	function transfer(address recipient, uint amount) external returns (bool);
	function allowance(address owner, address spender) external view returns (uint);
	function approve(address spender, uint amount) external returns (bool);
	function transferFrom(address sender, address recipient, uint amount) external returns (bool);
	event Transfer(address indexed from, address indexed to, uint value);
	event Approval(address indexed owner, address indexed spender, uint value);
}

interface IUniswapV2Router {
  function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory amounts);
  function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts);
}

interface IUniswapV2Pair {
  function token0() external view returns (address);
  function token1() external view returns (address);
  function swap(uint256 amount0Out,	uint256 amount1Out,	address to,	bytes calldata data) external;
}

contract Arb is Ownable {

    function swap(address _router, address _tokenIn, address _tokenOut, uint _amount) private {
        IERC20(_tokenIn).approve(_router, _amount);
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint deadline = block.timestamp + 300;
        IUniswapV2Router(_router).swapExactTokensForTokens(_amount, 1, path, address(this), deadline);
    }

    function getAmountOutMin(address _router, address _tokenIn, address _tokenOut, uint _amount) public view returns (uint) {
        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        uint[] memory amountOutMins  = IUniswapV2Router(_router).getAmountsOut(_amount, path);
        return amountOutMins[path.length -1];
    }

    function calcDualTrade(address _router0, address _router1, address _token0, address _token1, uint _amount) external view returns (uint) {
        uint amountBack1 = getAmountOutMin(_router0, _token0, _token1, _amount);
        uint amountBack2 = getAmountOutMin(_router1, _token0, _token1, amountBack1);
        return amountBack2;
    }

    function execDualTrade(address _router0, address _router1, address _token0, address _token1, uint _amount) external onlyOwner {
        uint startBal = IERC20(_token0).balanceOf(address(this));
        
    }

    function getBalance(address _token) external view returns (uint) {

    }

    function recoverEth() external onlyOwner {

    }
    
    function recoverERC20(address _token) external onlyOwner {

    }

    receive() external payable {}
    fallback() external payable {}
}