/*
	Copyright (c) 2004-2006, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

var dj_global=this;
function dj_undef(_1,_2){
if(!_2){
_2=dj_global;
}
return (typeof _2[_1]=="undefined");
}
if(dj_undef("djConfig")){
var djConfig={};
}
if(dj_undef("dojo")){
var dojo={};
}
dojo.version={major:0,minor:2,patch:2,flag:"+",revision:Number("$Rev: 3802 $".match(/[0-9]+/)[0]),toString:function(){
with(dojo.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
dojo.evalProp=function(_3,_4,_5){
return (_4&&!dj_undef(_3,_4)?_4[_3]:(_5?(_4[_3]={}):undefined));
};
dojo.parseObjPath=function(_6,_7,_8){
var _9=(_7?_7:dj_global);
var _a=_6.split(".");
var _b=_a.pop();
for(var i=0,l=_a.length;i<l&&_9;i++){
_9=dojo.evalProp(_a[i],_9,_8);
}
return {obj:_9,prop:_b};
};
dojo.evalObjPath=function(_d,_e){
if(typeof _d!="string"){
return dj_global;
}
if(_d.indexOf(".")==-1){
return dojo.evalProp(_d,dj_global,_e);
}
with(dojo.parseObjPath(_d,dj_global,_e)){
return dojo.evalProp(prop,obj,_e);
}
};
dojo.errorToString=function(_f){
return ((!dj_undef("message",_f))?_f.message:(dj_undef("description",_f)?_f:_f.description));
};
dojo.raise=function(_10,_11){
if(_11){
_10=_10+": "+dojo.errorToString(_11);
}
var he=dojo.hostenv;
if((!dj_undef("hostenv",dojo))&&(!dj_undef("println",dojo.hostenv))){
dojo.hostenv.println("FATAL: "+_10);
}
throw Error(_10);
};
dojo.debug=function(){
};
dojo.debugShallow=function(obj){
};
dojo.profile={start:function(){
},end:function(){
},stop:function(){
},dump:function(){
}};
function dj_eval(s){
return dj_global.eval?dj_global.eval(s):eval(s);
}
dojo.unimplemented=function(_15,_16){
var _17="'"+_15+"' not implemented";
if((!dj_undef(_16))&&(_16)){
_17+=" "+_16;
}
dojo.raise(_17);
};
dojo.deprecated=function(_18,_19,_1a){
var _1b="DEPRECATED: "+_18;
if(_19){
_1b+=" "+_19;
}
if(_1a){
_1b+=" -- will be removed in version: "+_1a;
}
dojo.debug(_1b);
};
dojo.inherits=function(_1c,_1d){
if(typeof _1d!="function"){
dojo.raise("dojo.inherits: superclass argument ["+_1d+"] must be a function (subclass: ["+_1c+"']");
}
_1c.prototype=new _1d();
_1c.prototype.constructor=_1c;
_1c.superclass=_1d.prototype;
_1c["super"]=_1d.prototype;
};
dojo.render=(function(){
function vscaffold(_1e,_1f){
var tmp={capable:false,support:{builtin:false,plugin:false},prefixes:_1e};
for(var x in _1f){
tmp[x]=false;
}
return tmp;
}
return {name:"",ver:dojo.version,os:{win:false,linux:false,osx:false},html:vscaffold(["html"],["ie","opera","khtml","safari","moz"]),svg:vscaffold(["svg"],["corel","adobe","batik"]),vml:vscaffold(["vml"],["ie"]),swf:vscaffold(["Swf","Flash","Mm"],["mm"]),swt:vscaffold(["Swt"],["ibm"])};
})();
dojo.hostenv=(function(){
var _22={isDebug:false,allowQueryConfig:false,baseScriptUri:"",baseRelativePath:"",libraryScriptUri:"",iePreventClobber:false,ieClobberMinimal:true,preventBackButtonFix:true,searchIds:[],parseWidgets:true};
if(typeof djConfig=="undefined"){
djConfig=_22;
}else{
for(var _23 in _22){
if(typeof djConfig[_23]=="undefined"){
djConfig[_23]=_22[_23];
}
}
}
return {name_:"(unset)",version_:"(unset)",getName:function(){
return this.name_;
},getVersion:function(){
return this.version_;
},getText:function(uri){
dojo.unimplemented("getText","uri="+uri);
}};
})();
dojo.hostenv.getBaseScriptUri=function(){
if(djConfig.baseScriptUri.length){
return djConfig.baseScriptUri;
}
var uri=new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
if(!uri){
dojo.raise("Nothing returned by getLibraryScriptUri(): "+uri);
}
var _26=uri.lastIndexOf("/");
djConfig.baseScriptUri=djConfig.baseRelativePath;
return djConfig.baseScriptUri;
};
(function(){
var _27={pkgFileName:"__package__",loading_modules_:{},loaded_modules_:{},addedToLoadingCount:[],removedFromLoadingCount:[],inFlightCount:0,modulePrefixes_:{dojo:{name:"dojo",value:"src"}},setModulePrefix:function(_28,_29){
this.modulePrefixes_[_28]={name:_28,value:_29};
},getModulePrefix:function(_2a){
var mp=this.modulePrefixes_;
if((mp[_2a])&&(mp[_2a]["name"])){
return mp[_2a].value;
}
return _2a;
},getTextStack:[],loadUriStack:[],loadedUris:[],post_load_:false,modulesLoadedListeners:[]};
for(var _2c in _27){
dojo.hostenv[_2c]=_27[_2c];
}
})();
dojo.hostenv.loadPath=function(_2d,_2e,cb){
if((_2d.charAt(0)=="/")||(_2d.match(/^\w+:/))){
dojo.raise("relpath '"+_2d+"'; must be relative");
}
var uri=this.getBaseScriptUri()+_2d;
if(djConfig.cacheBust&&dojo.render.html.capable){
uri+="?"+String(djConfig.cacheBust).replace(/\W+/g,"");
}
try{
return ((!_2e)?this.loadUri(uri,cb):this.loadUriAndCheck(uri,_2e,cb));
}
catch(e){
dojo.debug(e);
return false;
}
};
dojo.hostenv.loadUri=function(uri,cb){
if(this.loadedUris[uri]){
return;
}
var _33=this.getText(uri,null,true);
if(_33==null){
return 0;
}
this.loadedUris[uri]=true;
var _34=dj_eval(_33);
return 1;
};
dojo.hostenv.loadUriAndCheck=function(uri,_36,cb){
var ok=true;
try{
ok=this.loadUri(uri,cb);
}
catch(e){
dojo.debug("failed loading ",uri," with error: ",e);
}
return ((ok)&&(this.findModule(_36,false)))?true:false;
};
dojo.loaded=function(){
};
dojo.hostenv.loaded=function(){
this.post_load_=true;
var mll=this.modulesLoadedListeners;
this.modulesLoadedListeners=[];
for(var x=0;x<mll.length;x++){
mll[x]();
}
dojo.loaded();
};
dojo.addOnLoad=function(obj,_3c){
var dh=dojo.hostenv;
if(arguments.length==1){
dh.modulesLoadedListeners.push(obj);
}else{
if(arguments.length>1){
dh.modulesLoadedListeners.push(function(){
obj[_3c]();
});
}
}
if(dh.post_load_&&dh.inFlightCount==0){
dh.callLoaded();
}
};
dojo.hostenv.modulesLoaded=function(){
if(this.post_load_){
return;
}
if((this.loadUriStack.length==0)&&(this.getTextStack.length==0)){
if(this.inFlightCount>0){
dojo.debug("files still in flight!");
return;
}
dojo.hostenv.callLoaded();
}
};
dojo.hostenv.callLoaded=function(){
if(typeof setTimeout=="object"){
setTimeout("dojo.hostenv.loaded();",0);
}else{
dojo.hostenv.loaded();
}
};
dojo.hostenv._global_omit_module_check=false;
dojo.hostenv.loadModule=function(_3e,_3f,_40){
if(!_3e){
return;
}
_40=this._global_omit_module_check||_40;
var _41=this.findModule(_3e,false);
if(_41){
return _41;
}
if(dj_undef(_3e,this.loading_modules_)){
this.addedToLoadingCount.push(_3e);
}
this.loading_modules_[_3e]=1;
var _42=_3e.replace(/\./g,"/")+".js";
var _43=_3e.split(".");
var _44=_3e.split(".");
for(var i=_43.length-1;i>0;i--){
var _46=_43.slice(0,i).join(".");
var _47=this.getModulePrefix(_46);
if(_47!=_46){
_43.splice(0,i,_47);
break;
}
}
var _48=_43[_43.length-1];
if(_48=="*"){
_3e=(_44.slice(0,-1)).join(".");
while(_43.length){
_43.pop();
_43.push(this.pkgFileName);
_42=_43.join("/")+".js";
if(_42.charAt(0)=="/"){
_42=_42.slice(1);
}
ok=this.loadPath(_42,((!_40)?_3e:null));
if(ok){
break;
}
_43.pop();
}
}else{
_42=_43.join("/")+".js";
_3e=_44.join(".");
var ok=this.loadPath(_42,((!_40)?_3e:null));
if((!ok)&&(!_3f)){
_43.pop();
while(_43.length){
_42=_43.join("/")+".js";
ok=this.loadPath(_42,((!_40)?_3e:null));
if(ok){
break;
}
_43.pop();
_42=_43.join("/")+"/"+this.pkgFileName+".js";
if(_42.charAt(0)=="/"){
_42=_42.slice(1);
}
ok=this.loadPath(_42,((!_40)?_3e:null));
if(ok){
break;
}
}
}
if((!ok)&&(!_40)){
dojo.raise("Could not load '"+_3e+"'; last tried '"+_42+"'");
}
}
if(!_40&&!this["isXDomain"]){
_41=this.findModule(_3e,false);
if(!_41){
dojo.raise("symbol '"+_3e+"' is not defined after loading '"+_42+"'");
}
}
return _41;
};
dojo.hostenv.startPackage=function(_4a){
var _4b=dojo.evalObjPath((_4a.split(".").slice(0,-1)).join("."));
this.loaded_modules_[(new String(_4a)).toLowerCase()]=_4b;
var _4c=_4a.split(/\./);
if(_4c[_4c.length-1]=="*"){
_4c.pop();
}
return dojo.evalObjPath(_4c.join("."),true);
};
dojo.hostenv.findModule=function(_4d,_4e){
var lmn=(new String(_4d)).toLowerCase();
if(this.loaded_modules_[lmn]){
return this.loaded_modules_[lmn];
}
var _50=dojo.evalObjPath(_4d);
if((_4d)&&(typeof _50!="undefined")&&(_50)){
this.loaded_modules_[lmn]=_50;
return _50;
}
if(_4e){
dojo.raise("no loaded module named '"+_4d+"'");
}
return null;
};
dojo.kwCompoundRequire=function(_51){
var _52=_51["common"]||[];
var _53=(_51[dojo.hostenv.name_])?_52.concat(_51[dojo.hostenv.name_]||[]):_52.concat(_51["default"]||[]);
for(var x=0;x<_53.length;x++){
var _55=_53[x];
if(_55.constructor==Array){
dojo.hostenv.loadModule.apply(dojo.hostenv,_55);
}else{
dojo.hostenv.loadModule(_55);
}
}
};
dojo.require=function(){
dojo.hostenv.loadModule.apply(dojo.hostenv,arguments);
};
dojo.requireIf=function(){
if((arguments[0]===true)||(arguments[0]=="common")||(arguments[0]&&dojo.render[arguments[0]].capable)){
var _56=[];
for(var i=1;i<arguments.length;i++){
_56.push(arguments[i]);
}
dojo.require.apply(dojo,_56);
}
};
dojo.requireAfterIf=dojo.requireIf;
dojo.provide=function(){
return dojo.hostenv.startPackage.apply(dojo.hostenv,arguments);
};
dojo.setModulePrefix=function(_58,_59){
return dojo.hostenv.setModulePrefix(_58,_59);
};
dojo.exists=function(obj,_5b){
var p=_5b.split(".");
for(var i=0;i<p.length;i++){
if(!(obj[p[i]])){
return false;
}
obj=obj[p[i]];
}
return true;
};
if(typeof window=="undefined"){
dojo.raise("no window object");
}
(function(){
if(djConfig.allowQueryConfig){
var _5e=document.location.toString();
var _5f=_5e.split("?",2);
if(_5f.length>1){
var _60=_5f[1];
var _61=_60.split("&");
for(var x in _61){
var sp=_61[x].split("=");
if((sp[0].length>9)&&(sp[0].substr(0,9)=="djConfig.")){
var opt=sp[0].substr(9);
try{
djConfig[opt]=eval(sp[1]);
}
catch(e){
djConfig[opt]=sp[1];
}
}
}
}
}
if(((djConfig["baseScriptUri"]=="")||(djConfig["baseRelativePath"]==""))&&(document&&document.getElementsByTagName)){
var _65=document.getElementsByTagName("script");
var _66=/(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
for(var i=0;i<_65.length;i++){
var src=_65[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_66);
if(m){
root=src.substring(0,m.index);
if(src.indexOf("bootstrap1")>-1){
root+="../";
}
if(!this["djConfig"]){
djConfig={};
}
if(djConfig["baseScriptUri"]==""){
djConfig["baseScriptUri"]=root;
}
if(djConfig["baseRelativePath"]==""){
djConfig["baseRelativePath"]=root;
}
break;
}
}
}
var dr=dojo.render;
var drh=dojo.render.html;
var drs=dojo.render.svg;
var dua=drh.UA=navigator.userAgent;
var dav=drh.AV=navigator.appVersion;
var t=true;
var f=false;
drh.capable=t;
drh.support.builtin=t;
dr.ver=parseFloat(drh.AV);
dr.os.mac=dav.indexOf("Macintosh")>=0;
dr.os.win=dav.indexOf("Windows")>=0;
dr.os.linux=dav.indexOf("X11")>=0;
drh.opera=dua.indexOf("Opera")>=0;
drh.khtml=(dav.indexOf("Konqueror")>=0)||(dav.indexOf("Safari")>=0);
drh.safari=dav.indexOf("Safari")>=0;
var _71=dua.indexOf("Gecko");
drh.mozilla=drh.moz=(_71>=0)&&(!drh.khtml);
if(drh.mozilla){
drh.geckoVersion=dua.substring(_71+6,_71+14);
}
drh.ie=(document.all)&&(!drh.opera);
drh.ie50=drh.ie&&dav.indexOf("MSIE 5.0")>=0;
drh.ie55=drh.ie&&dav.indexOf("MSIE 5.5")>=0;
drh.ie60=drh.ie&&dav.indexOf("MSIE 6.0")>=0;
dr.vml.capable=drh.ie;
drs.capable=f;
drs.support.plugin=f;
drs.support.builtin=f;
if(document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("org.w3c.dom.svg","1.0")){
drs.capable=t;
drs.support.builtin=t;
drs.support.plugin=f;
}
})();
dojo.hostenv.startPackage("dojo.hostenv");
dojo.render.name=dojo.hostenv.name_="browser";
dojo.hostenv.searchIds=[];
var DJ_XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
dojo.hostenv.getXmlhttpObject=function(){
var _72=null;
var _73=null;
try{
_72=new XMLHttpRequest();
}
catch(e){
}
if(!_72){
for(var i=0;i<3;++i){
var _75=DJ_XMLHTTP_PROGIDS[i];
try{
_72=new ActiveXObject(_75);
}
catch(e){
_73=e;
}
if(_72){
DJ_XMLHTTP_PROGIDS=[_75];
break;
}
}
}
if(!_72){
return dojo.raise("XMLHTTP not available",_73);
}
return _72;
};
dojo.hostenv.getText=function(uri,_77,_78){
var _79=this.getXmlhttpObject();
if(_77){
_79.onreadystatechange=function(){
if((4==_79.readyState)&&(_79["status"])){
if(_79.status==200){
_77(_79.responseText);
}
}
};
}
_79.open("GET",uri,_77?true:false);
try{
_79.send(null);
}
catch(e){
if(_78&&!_77){
return null;
}else{
throw e;
}
}
if(_77){
return null;
}
return _79.responseText;
};
dojo.hostenv.defaultDebugContainerId="dojoDebug";
dojo.hostenv._println_buffer=[];
dojo.hostenv._println_safe=false;
dojo.hostenv.println=function(_7a){
if(!dojo.hostenv._println_safe){
dojo.hostenv._println_buffer.push(_7a);
}else{
try{
var _7b=document.getElementById(djConfig.debugContainerId?djConfig.debugContainerId:dojo.hostenv.defaultDebugContainerId);
if(!_7b){
_7b=document.getElementsByTagName("body")[0]||document.body;
}
var div=document.createElement("div");
div.appendChild(document.createTextNode(_7a));
_7b.appendChild(div);
}
catch(e){
try{
document.write("<div>"+_7a+"</div>");
}
catch(e2){
window.status=_7a;
}
}
}
};
dojo.addOnLoad(function(){
dojo.hostenv._println_safe=true;
while(dojo.hostenv._println_buffer.length>0){
dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
}
});
function dj_addNodeEvtHdlr(_7d,_7e,fp,_80){
var _81=_7d["on"+_7e]||function(){
};
_7d["on"+_7e]=function(){
fp.apply(_7d,arguments);
_81.apply(_7d,arguments);
};
return true;
}
dj_addNodeEvtHdlr(window,"load",function(){
if(arguments.callee.initialized){
return;
}
arguments.callee.initialized=true;
var _82=function(){
if(dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
};
if(dojo.hostenv.inFlightCount==0){
_82();
dojo.hostenv.modulesLoaded();
}else{
dojo.addOnLoad(_82);
}
});
dojo.hostenv.makeWidgets=function(){
var _83=[];
if(djConfig.searchIds&&djConfig.searchIds.length>0){
_83=_83.concat(djConfig.searchIds);
}
if(dojo.hostenv.searchIds&&dojo.hostenv.searchIds.length>0){
_83=_83.concat(dojo.hostenv.searchIds);
}
if((djConfig.parseWidgets)||(_83.length>0)){
if(dojo.evalObjPath("dojo.widget.Parse")){
try{
var _84=new dojo.xml.Parse();
if(_83.length>0){
for(var x=0;x<_83.length;x++){
var _86=document.getElementById(_83[x]);
if(!_86){
continue;
}
var _87=_84.parseElement(_86,null,true);
dojo.widget.getParser().createComponents(_87);
}
}else{
if(djConfig.parseWidgets){
var _87=_84.parseElement(document.getElementsByTagName("body")[0]||document.body,null,true);
dojo.widget.getParser().createComponents(_87);
}
}
}
catch(e){
dojo.debug("auto-build-widgets error:",e);
}
}
}
};
dojo.addOnLoad(function(){
if(!dojo.render.html.ie){
dojo.hostenv.makeWidgets();
}
});
try{
if(dojo.render.html.ie){
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
}
catch(e){
}
dojo.hostenv.writeIncludes=function(){
};
dojo.byId=function(id,doc){
if(id&&(typeof id=="string"||id instanceof String)){
if(!doc){
doc=document;
}
return doc.getElementById(id);
}
return id;
};
(function(){
if(typeof dj_usingBootstrap!="undefined"){
return;
}
var _8a=false;
var _8b=false;
var _8c=false;
if((typeof this["load"]=="function")&&(typeof this["Packages"]=="function")){
_8a=true;
}else{
if(typeof this["load"]=="function"){
_8b=true;
}else{
if(window.widget){
_8c=true;
}
}
}
var _8d=[];
if((this["djConfig"])&&((djConfig["isDebug"])||(djConfig["debugAtAllCosts"]))){
_8d.push("debug.js");
}
if((this["djConfig"])&&(djConfig["debugAtAllCosts"])&&(!_8a)&&(!_8c)){
_8d.push("browser_debug.js");
}
if((this["djConfig"])&&(djConfig["compat"])){
_8d.push("compat/"+djConfig["compat"]+".js");
}
var _8e=djConfig["baseScriptUri"];
if((this["djConfig"])&&(djConfig["baseLoaderUri"])){
_8e=djConfig["baseLoaderUri"];
}
for(var x=0;x<_8d.length;x++){
var _90=_8e+"src/"+_8d[x];
if(_8a||_8b){
load(_90);
}else{
try{
document.write("<scr"+"ipt type='text/javascript' src='"+_90+"'></scr"+"ipt>");
}
catch(e){
var _91=document.createElement("script");
_91.src=_90;
document.getElementsByTagName("head")[0].appendChild(_91);
}
}
}
})();

