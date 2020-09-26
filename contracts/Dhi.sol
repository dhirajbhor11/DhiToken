//spdx

pragma solidity >=0.4.17;

contract Dhi {
    uint256 public totalSupply;
    string public name = "DHI TOKEN";
    string public symbol = "DHI";
    uint8 public decimals = 2;

    mapping(address => uint256) public balanceOff;

    event Transfer(address _from, address _to, uint256 _value);

    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOff[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOff[msg.sender] >= _value, "low Balance");

        balanceOff[msg.sender] -= _value;
        balanceOff[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
