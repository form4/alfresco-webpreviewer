(function(){Alfresco.HtmlWebPreviewLib=function(){};Alfresco.HtmlWebPreviewLib.renderContent=function(t,n,r,i,s,o,u){var a="document-content",f=document.createElement("div"),l=document.createElement("div"),c=document.createElement("div");if(n!="text/html"&&n!="text/xml"&&n!="text/xhtml+xml"){t=t.replace(/\n/g,"<br/>")}var h=null;if("text/xml"==n){h=c.appendChild(document.createElement("pre"));t=t.replace(/&/g,"&").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;");h.innerHTML=t}else{h=c.appendChild(document.createElement("div"));h.innerHTML=t}YAHOO.util.Dom.setAttribute(c,"id",a);YAHOO.util.Dom.setAttribute(c,"class","content "+r+(s?" toc-enabled ":""));if(s){YAHOO.util.Dom.setAttribute(l,"id","document-toc-wrapper");YAHOO.util.Dom.setAttribute(l,"class","toc-wrapper");f.appendChild(l)}f.appendChild(c);if(s){var p=new RegExp("h[1-"+u+"]","i");headings=YAHOO.util.Dom.getElementsBy(function(e){return p.test(e.nodeName)},"",c);if(headings.length>o){var d=l.appendChild(document.createElement("div")),v=d.appendChild(document.createElement("div")),m=d.appendChild(document.createElement("ul")),g=null,y=2;YAHOO.util.Dom.setAttribute(d,"id","document-toc");YAHOO.util.Dom.setAttribute(d,"class","toc "+"content");YAHOO.util.Dom.setAttribute(v,"id","document-toc-title");v.innerHTML=i("hwp.toc");for(var b=0;b<headings.length;b++){var w=headings[b],E=w.nodeName.match(/h([\d])/i);if(E&&E[1]){YAHOO.util.Dom.setAttribute(w,"id","title"+b);var S=E[1];if(!g){g=m}else if(S==y){g=g.parentNode}else if(S>y){g=g.appendChild(document.createElement("ul"))}else if(S<y){g=g.parentNode.parentNode}y=S;g=g.appendChild(document.createElement("li")),anchor=g.appendChild(document.createElement("a"));YAHOO.util.Dom.setAttribute(anchor,"id","link"+b);YAHOO.util.Dom.setAttribute(anchor,"class","tocLevel"+S);YAHOO.util.Dom.setAttribute(anchor,"href","#title"+b);YAHOO.util.Dom.setAttribute(anchor,"title",w.innerHTML);anchor.innerHTML=w.innerHTML}}}else{f.removeChild(l)}}return f}})()