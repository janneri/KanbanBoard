  $.fn.exists = function () {
    return this.length !== 0;
  }

  Array.prototype.drop = function(howmany) { 
    while (howmany--)
      this.splice(0, 1); 
  }

  String.prototype.startsWith = function(str) { 
    if (str == null || str == "undefined") return false;
    return this.substring(0, str.length) === str;
  };