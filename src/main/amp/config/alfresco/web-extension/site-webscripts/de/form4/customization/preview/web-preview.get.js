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
/**
 * Extends standard web preview controller (web-preview.get.js)
 * 
 * It extends widget configuration to associate specific mimetypes to be rendered by HtmlWebPreview client component.
 * 
 * There are default plugin mappings for HtmlWebPreview component or it may be customized by share-config XML 
 * definition. See documentation for details.
 * 
 * @author form4 GmbH & Co. KG
 */

var HtmlWebPreviewDefaultMimeTypes = [ "text/plain", "text/html", "text/xhtml+xml", "application/javascript", "application/x-javascript", "text/css", "text/xml", "message/rfc822" ];

if(model.widgets) {
   // Find the default widget and adjust some settings
   for (var i=0; i<model.widgets.length; i++)
   {
      if (model.widgets[i].id == "WebPreview")
      {
         var pluginConditions = [],
            origPluginConditions = eval('(' + model.widgets[i].options.pluginConditions + ')'),
            htmlpreviewTocRender = false,
            htmlpreviewTocMin = 3,
            htmlpreviewTocMaxHeadlineLevel = 3;
         
         // extend used plugin configuration
         if(config.scoped["HtmlWebPreview"] && config.scoped["HtmlWebPreview"].mimetypes) 
         {
            if (logger.isLoggingEnabled())
            {
               logger.log('htmlwebpreviewer: loading configuration from share-config');
            }
            // config section in share-config exists, so we use this
            var mimetypes = [],
               mimetypesConfig = config.scoped["HtmlWebPreview"].mimetypes.getChildren("mimetype"),
               mimetype = null;
            
            if (mimetypesConfig)
            {
               for (var j = 0; j < mimetypesConfig.size(); j++)
               {
                  mimetype = mimetypesConfig.get(j);
                  mimetypes.push(mimetype.getValue());
               }
            }
            var additionalDefs = getAdditionalPluginConditions(mimetypes);
            pluginConditions = additionalDefs.concat(origPluginConditions);
         } 
         else 
         {
            if (logger.isLoggingEnabled())
            {
                logger.log('htmlwebpreviewer: loading default configuration');
            }
            // no custom config, so use default settings
            var additionalDefs = getAdditionalPluginConditions(HtmlWebPreviewDefaultMimeTypes);
            pluginConditions = additionalDefs.concat(origPluginConditions);
            
         }
         
         model.widgets[i].options.pluginConditions = jsonUtils.toJSONString(pluginConditions);
         
         if(config.scoped["HtmlWebPreview"]) 
         {
            if(config.scoped["HtmlWebPreview"]["show-toc"]) {
               htmlpreviewTocRender = config.scoped["HtmlWebPreview"]["show-toc"].getValue();
            }
            if(config.scoped["HtmlWebPreview"]["toc-min-headlines"]) {
               htmlpreviewTocMin = config.scoped["HtmlWebPreview"]["toc-min-headlines"].getValue();
            }
            
            if(config.scoped["HtmlWebPreview"]["toc-max-headline-level"]) {
                htmlpreviewTocMaxHeadlineLevel = config.scoped["HtmlWebPreview"]["toc-max-headline-level"].getValue();
             }
         }
         model.widgets[i].options.htmlpreviewTocRender = htmlpreviewTocRender;
         model.widgets[i].options.htmlpreviewTocMin = htmlpreviewTocMin;
         model.widgets[i].options.htmlpreviewTocMaxHeadlineLevel = htmlpreviewTocMaxHeadlineLevel;
         
         // css dependencies
         model.stylesheets = [];
         
         if(config.scoped["HtmlWebPreview"] && config.scoped["HtmlWebPreview"]["stylesheets"])
         {
            files = config.scoped["HtmlWebPreview"]["stylesheets"].getChildren("src");
            if (files)
            {
                for (var m = 0; m < files.size(); m++)
                {
                   model.stylesheets.push(files.get(m).getValue());
                }
            }
         }
         
         if(model.stylesheets.length < 1)
         {
            model.stylesheets.push('components/htmlwebpreview/htmlwebpreview.css');
         }
      }
   }
}

/**
 * Generates dynamic Web Preview plugin configuration for HtmlWebPreview plugin.
 * 
 * @param mimetypes Array of mimetypes HtmlWebPreview plugin should handle. 
 * @returns Definitions.
 */
function getAdditionalPluginConditions(mimetypes) {
   if (logger.isLoggingEnabled())
   {
      logger.log('htmlwebpreviewer: register mimetypes '+ mimetypes);
   }
   
   var defs = [];
   
   for each (type in mimetypes)
   {
      condition =
      {
          attributes: { mimeType : type },
          plugins: [ { name: "HtmlWebPreview", attributes: { poster: "imgpreview", posterFileSuffix: ".png"  } } ]
      };
      defs.push(condition);
   }  
   return defs;
}

