pragma solidity >=0.4.71;

import "./Dhi.sol";

contract DhiSale {
    address admin;
    Dhi public dhiContract;
    uint256 public dhiPrice;
    uint256 public dhiSold;

    constructor(Dhi _dhiContract, uint256 _dhiPrice) public {
        admin = msg.sender;
        dhiContract = _dhiContract;
        dhiPrice = _dhiPrice;
    }

    event Sell(address _buyer, uint256 _amount);

    function multiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyToken(uint256 _numberOfDhi) public payable {
        // require(msg.value == multiply(_numberOfDhi, dhiPrice));
        require(dhiContract.balanceOff(address(this)) >= _numberOfDhi);
        require(dhiContract.transfer(msg.sender, _numberOfDhi));

        dhiSold += _numberOfDhi;

        emit Sell(msg.sender, _numberOfDhi);
    }

    function endSale() public {
        require(admin == msg.sender);
        require(
            dhiContract.transfer(admin, dhiContract.balanceOff(address(this)))
        );

        selfdestruct(msg.sender);
    }
}
