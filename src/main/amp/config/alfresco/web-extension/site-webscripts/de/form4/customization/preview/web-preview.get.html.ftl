<#--
 #%L
 Html Web Previewer - Share Extension
 %%
 Copyright (C) 2014 form4 GmbH & Co. KG
 %%
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 #L%
-->

<@markup id="htmlwebpreview-css" target="css" action="after">
   <#if stylesheets??>
      <#list stylesheets as cssFile>
         <@link rel="stylesheet" type="text/css" href="${url.context}/res/${cssFile}" group="${dependencyGroup}"/>
      </#list>
   </#if>
</@>

<@markup id="htmlwebpreview-js" target="js" action="after">
  <@script src="${url.context}/res/components/htmlwebpreview/htmlwebpreview.lib.js" group="${dependencyGroup}"/>
  <@script src="${url.context}/res/components/htmlwebpreview/htmlwebpreview.js" group="${dependencyGroup}"/>
</@>
