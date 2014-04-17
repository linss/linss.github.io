var userfilepath = window.location.pathname;
var thispage = userfilepath.substring(userfilepath.lastIndexOf('/')+1);
var thispagename = thispage.replace(".html","");
var thisversion = userfilepath.substring(userfilepath.lastIndexOf('versions/')+9);
thisversion = thisversion.replace("/"+thispage,"");

var thisproject = userfilepath.substring(userfilepath.lastIndexOf('projects/')+9);
thisproject = thisproject.replace("/"+thispage,"");
thisproject = thisproject.replace("/versions/"+thisversion,"");
 
userfilepath = $.trim(userfilepath.replace(thispage,"").replace("versions/"+thisversion+"/","").replace("projects/"+thisproject+"/",""));
var localuserfilepath = "file://"+userfilepath;


