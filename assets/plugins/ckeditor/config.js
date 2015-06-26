/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	  config.uiColor = '#3C8DBC';
      
      config.toolbar = [  
          ['Undo', 'Redo','Cut','Copy','Paste','PasteText','PasteFromWord'],
          ['find','Replace','SelectAll','Scayt'],
	[ 'Bold', 'Italic', 'Underline', 'Strike'],
	 [ 'NumberedList', 'BulletedList'],
        [ 'Outdent', 'Indent','Blockquote','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor','Link','Unlink'],
        ['Image','HorizontalRule']
         
 ];
      
      
      
      
};
