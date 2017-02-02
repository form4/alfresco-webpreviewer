/*
 * #%L
 * Html Web Previewer - Share Extension
 * %%
 * Copyright (C) 2014 form4 GmbH & Co. KG
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */

/**
 * HtmlWebPreview library.
 * 
 * @namespace Alfresco
 * @class Alfresco.HtmlWebPreviewLib
 */
(function() {

	/**
	 * Constructor.
	 */
	Alfresco.HtmlWebPreviewLib = function() {
	};

	/**
	 * 
	 * @method renderContent
	 * @param content {string} 
	 * @param mimeType {string} 
	 * @param cssClass {string} 
	 * @param msg {object}
	 * @param renderToc {boolean} if toc will be rendered
	 * @param minTocHeadlines {integer} min amount of headlines (hx elements), to show uu table of contents
	 * @param maxHeadlineLevel {integer} Max headline level that will be shown in the table of contents. E.g. 4 means headline from h2, h3, h4 will be shown
	 *            
	 * @return {object} DOM object all contents.
	 */
	Alfresco.HtmlWebPreviewLib.renderContent = function HC_renderContent(content, mimeType, cssClass, msg, renderToc, minTocHeadlines, maxHeadlineLevel) {
		var contentId = 'document-content', 
			contentDiv = document.createElement('div'),
			tocWrapper = document.createElement('div'),
			contentElem = document.createElement('div');

		if (mimeType != 'text/html' && mimeType != 'text/xml' && mimeType != 'text/xhtml+xml') {
			content = content.replace(/\n/g, "<br/>");
		}
		
		var contentInnerEl = null;
		
		if ('text/xml' == mimeType) {
			// add as plain text to assure xml rendering
			contentInnerEl = contentElem.appendChild(document.createElement('pre'));
			// YAHOO.util.Dom.setAttribute(contentInnerEl, 'class', 'prettyprint lang-xml');
			
			// encode entities
			content = content.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			contentInnerEl.innerHTML = content;
			// add pretty code
			// contentInnerEl.innerHTML = prettyPrintOne(content);
			
		} else {
			// add as html content
			contentInnerEl = contentElem.appendChild(document.createElement('div'));
			contentInnerEl.innerHTML = content;
		}
		
		YAHOO.util.Dom.setAttribute(contentElem, 'id', contentId);
		YAHOO.util.Dom.setAttribute(contentElem, 'class', "content " + cssClass + (renderToc ? " toc-enabled " : ""));
	
		if(renderToc) {
			YAHOO.util.Dom.setAttribute(tocWrapper, 'id', "document-toc-wrapper");
			YAHOO.util.Dom.setAttribute(tocWrapper, 'class', "toc-wrapper");
			contentDiv.appendChild(tocWrapper);
		}
		contentDiv.appendChild(contentElem);
	
		/* TOC */
		if(renderToc) {
			
			var matcher = new RegExp("h[1-" + maxHeadlineLevel + "]", "i");
				headings = YAHOO.util.Dom.getElementsBy(function(el) {
				return (matcher.test(el.nodeName));
			}, '', contentElem);
	
			//if (console && console.log) {console.log('headings', headings, contentId); }
		
			if (headings.length > minTocHeadlines) {
				var toc = tocWrapper.appendChild(document.createElement('div')), 
					tocTitle = toc.appendChild(document.createElement('div')), 
					tocList = toc.appendChild(document.createElement('ul')), 
					listElem = null, 
					lastLevel = 2; // we start at headline level h2
		
				YAHOO.util.Dom.setAttribute(toc, 'id', "document-toc");
				YAHOO.util.Dom.setAttribute(toc, 'class', "toc " + "content");
		
				YAHOO.util.Dom.setAttribute(tocTitle, 'id', "document-toc-title");
				tocTitle.innerHTML = msg('hwp.toc');
		
				for ( var i = 0; i < headings.length; i++) {
					var hl = headings[i], hlMatch = hl.nodeName.match(/h([\d])/i);
		
					if (hlMatch && hlMatch[1]) {
						YAHOO.util.Dom.setAttribute(hl, 'id', "title" + i);
						var currentLevel = hlMatch[1];
		
						if (!listElem) {
							listElem = tocList;
						} else if (currentLevel == lastLevel) {
							listElem = listElem.parentNode;
							//console.log('level '+i, currentLevel, hl);
						} else if (currentLevel > lastLevel) {
							listElem = listElem.appendChild(document.createElement('ul'));
							//console.log('increment level', currentLevel, hl, listElem);
						} else if (currentLevel < lastLevel) {
							listElem = listElem.parentNode.parentNode;
							//console.log('decrement level', currentLevel, hl, listElem);
						}
		
						lastLevel = currentLevel;
		
						listElem = listElem.appendChild(document.createElement('li')), 
							anchor = listElem.appendChild(document.createElement('a'));
		
						YAHOO.util.Dom.setAttribute(anchor, 'id', "link" + i);
						YAHOO.util.Dom.setAttribute(anchor, 'class', 'tocLevel' + currentLevel);
						YAHOO.util.Dom.setAttribute(anchor, 'href', "#title" + i);
						YAHOO.util.Dom.setAttribute(anchor, 'title', hl.innerHTML);
		
						anchor.innerHTML = hl.innerHTML;
		
					}
				}
			} else {
				contentDiv.removeChild(tocWrapper);
			}
		}
		
		
		return contentDiv;
	};

})();
