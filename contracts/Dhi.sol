pragma solidity >=0.4.17;

contract Dhi {
    uint256 public totalSupply;
    string public name = "DHI TOKEN";
    string public symbol = "DHI";
    uint8 public decimals = 2;

    mapping(address => uint256) public balanceOff;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address _from, address _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOff[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_to != msg.sender, "not self transfer");
        require(balanceOff[msg.sender] >= _value, "low Balance");

        balanceOff[msg.sender] -= _value;
        balanceOff[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOff[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);

        balanceOff[_from] -= _value;
        balanceOff[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
