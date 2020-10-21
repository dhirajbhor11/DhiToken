const Dhi = artifacts.require("Dhi");
const DhiSale = artifacts.require("DhiSale");

module.exports = function (deployer) {
    deployer.deploy(Dhi, 100000).then((DhiInstance) => {
        var price = 1000000000;
        return deployer.deploy(DhiSale, DhiInstance.address, price);
    });
};
