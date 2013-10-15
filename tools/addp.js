/*
node addp testaddp.xml
*/

/* add valid pair here*/
var validending={"ག":true,"ང":true,"ད":true,"ན":true,"བ":true,"མ":true,
"འ":true,"ར":true,"ལ":true,"ས":true,"ཏ":true, "པའ":true};





//////////////////////////////////////////////////////////////////////

var fs=require('fs');

var dtobj={};
var dtcount=0,addpcount=0,linecount=0;

var doline=function(l) {

	if (l.length<4) return l;

	var i=3;
	var out=l[0]+l[1]+l[2];
	var putp=function() {
		while ((l[i]=='།' || l[i]==' ') && i<l.length) {
			out+=l[i++];
		}
		out+='<p/>';
		addpcount++;
	}

	while (i<l.length) {
		if (l[i-1]=='ོ' && l[i]=='།') {
			if (validending[l[i-2]]) {
				if (l[i-3]=='་') {
					putp();
				} else {
					if (validending[l[i-3]+l[i-2]])  putp();
				}
			}
		}
		if (i<l.length) out+=l[i++];
	}
	return out;
}
var doline1=function(l){
	var rdzogs_tsig=l.match(/(..ོ།)/g);

	if(!rdzogs_tsig) return l;
	dtcount+=rdzogs_tsig.length;
	for (var j=0;j<rdzogs_tsig.length;j++) {
		if (!dtobj[ rdzogs_tsig[j] ])dtobj[ rdzogs_tsig[j] ]=0;
		dtobj[ rdzogs_tsig[j] ]++;
	}	
}
var addp=function(f) {
	console.log('adding <p> for',f);
	var arr=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');

	var newfile=[];
	for (var i=0;i<arr.length;i++) newfile[i]=doline(arr[i]);

	//make sure only <p/> is added
	linecount+=arr.length;
	if (newfile.join('\n').replace(/<p\/>/g,'') != arr.join('\n') ){
		throw 'something other than <p/> is added';
	} else {
		fs.writeFileSync(f+'.p',newfile.join('\n'),'utf8');	
	}
}

var fn=process.argv.slice(2)[0];
if (!fn) {
	fn='testaddp.xml';
	auto=true;
}

if (fn.indexOf('.lst')>-1) {
	lst=fs.readFileSync(fn,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
	for (var i in lst) {
		addp(lst[i])
	}
} else {
	addp(fn)
}

fs.writeFileSync('rdzogs_tsig.txt',JSON.stringify(dtobj,'',' '),'utf8');
console.log('addpcount',addpcount)
if (auto) {
	if (addpcount!=linecount) throw 'test not passed'
}
