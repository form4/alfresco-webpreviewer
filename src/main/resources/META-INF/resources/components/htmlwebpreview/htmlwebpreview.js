/*
 * #%L
 * WebPreviewer - Share Extension
 * %%
 * Copyright (C) 2014 - 2017 form4 GmbH & Co. KG
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
var honk = null;
/**
 * WebPreview component rendering HTML oder other plain text contents inline on
 * a document-detail page. Will be associated with specific mimetypes by
 * configuration.
 * 
 * @author form4 Gmbh & Co. KG
 */
Alfresco.WebPreview.prototype.Plugins.HtmlWebPreview = function(wp, attributes) {

	this.wp = wp;
	this.options = wp.options;
	this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes),
			attributes);
	return this;
};

Alfresco.WebPreview.prototype.Plugins.HtmlWebPreview.prototype = {
	/**
	 * Attributes
	 */
	attributes : {
		/**
		 * Specify thumbnail's mimeType if src has been set to a thumbnail. will
		 * be "null" by default, and the use the node's content's mimeType.
		 * 
		 * @type String
		 * @default null
		 */
		srcMimeType : null
	},

	/**
	 * Tests if the plugin can be used in the users browser.
	 * 
	 * @method report
	 * @return {String} Returns nothing if the plugin may be used, otherwise
	 *         returns a message containing the reason it cant be used as a
	 *         string.
	 * @public
	 */
	report : function HtmlWebPreview_report() {
		// Report nothing

	},

	/**
	 * Display the node.
	 * 
	 * @method display
	 * @public
	 */
	display : function HtmlWebPreview_display() {

		var mimeType = this.attributes.srcMimeType ? this.attributes.srcMimeType
				: this.wp.options.mimeType, cssClass = mimeType.replace("/",
				"-");

		this.getDocument(this.wp.options.nodeRef, mimeType, cssClass);

		return '';
	},

	/**
	 * Gets the nodes content and renders it as html.
	 * 
	 * @method content
	 * @private
	 */
	getDocument : function HtmlWebPreview_content_getdocument(nodeRef,
			mimeType, cssClass) {
		
		var docUrl = this.wp.getContentUrl(false);
		Alfresco.util.Ajax
				.request({
					url : docUrl,
					responseContentType : "text/html",
					successCallback : {
						fn : function(response) {
							this.wp.widgets.previewerElement.innerHTML = " ";

							var content = ''
									renderToc = this.wp.options.htmlpreviewTocRender,
									minToc = this.wp.options.htmlpreviewTocMin,
									maxHlevel = this.wp.options.htmlpreviewTocMaxHeadlineLevel;

							if (response.serverResponse
									&& response.serverResponse.status
									&& response.serverResponse.status == 200) {
								content = response.serverResponse.responseText;
							} else {
								content = '<div class="error">'
										+ this.wp.msg('hwp.error.getcontent')
										+ '</div>';
							}

							// content
							var contentDiv = Alfresco.HtmlWebPreviewLib
									.renderContent(content, mimeType, cssClass,
											this.wp.msg, renderToc, minToc,
											maxHlevel);
							contentDiv
									.appendChild(document.createElement('hr'));

							this.wp.widgets.previewerElement
									.appendChild(contentDiv);

						},
						scope : this
					},
					failureCallback : {
						fn : function(response) {
							this.wp.widgets.previewerElement.innerHTML += '<div class="error">'
									+ this.wp.msg('hwp.error.getcontent')
									+ '</div>';
						},
						scope : this
					},
					scope : this
				});

	}

};
