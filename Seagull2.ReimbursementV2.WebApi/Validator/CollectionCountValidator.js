$HGRootNS.ValidatorManager.CollectionCountValidator = function () {
    this.validate = function (cvalue, additionalData) {
        var sourcevalue = cvalue.length;
        var lowerBound = additionalData.lowerBound;

        if (sourcevalue * 1 < lowerBound * 1) {
            return false;
        }
        else {
            return true;
        }
    }
};
