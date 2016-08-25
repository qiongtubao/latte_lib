(function() {
	/**
		@class Number
		@method add
		@param a {String Or Int}
		@return Number;
		浮点数加法
	*/
	this.add = function(a, b) {
		var r1,r2,m;
		try{
			r1 = a.toString().split(".")[1].length
		}catch(e) {
			console.log("Number method add arg[0] is ",a);
			r1 = 0;
		}
		try{
			r2 = b.toString().split(".")[1].length
		}catch(e) {
			console.log("Number method add arg[1] is ",b);
			r2 = 0;
		}
		m=Math.pow(10,Math.max(r1,r2))
    	return (arg1*m+arg2*m)/m
	}
	/**
		@class Number
		@method add
		@param a {String Or Int}
		@return Number;
		浮点数减法
	*/
	this.sub = function(a, b) {
		return self.add(a, -b);
	}
	/**
		@class Number
		@method add
		@param a {String Or Int}
		@return Number;
		浮点数乘法
	*/
	this.mul = function(a, b) {
		var m=0,s1=a.toString(),s2=b.toString();
    	try{ m+=s1.split(".")[1].length }catch(e){}
    	try{ m+=s2.split(".")[1].length }catch(e){}
    	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
	}
	/**
		@class Number
		@method add
		@param a {String Or Int}
		@return Number;
		浮点数除法
	*/
	this.div = function(a, b) {
		try{t1=a.toString().split(".")[1].length}catch(e){}
    	try{t2=b.toString().split(".")[1].length}catch(e){}
   
        	r1=Number(a.toString().replace(".",""))
        	r2=Number(b.toString().replace(".",""))
        	return (r1/r2)*Math.pow(10,t2-t1);
    	

	}
}).call(Number.prototype);