# Word Add in proof of concept

Purpose is to create a word add in replace ment for the VBA code that is in use in ephorte.

The proof of concept has been implemented as follows: 
    
1. The Add in is a form that has asks you to choose a template to use.
2. Based on the template chosen, you get to a new pane where you input information in:
    * A dropdown menu
    * A check box
    * A text field where you enter text

2. When clicking the generate document button, a named autotext is inserted into the document at a bookmark name or at the end of the document. The text is changed based on the input in the demopane.


The initial code was greated using [Yeoman Generator](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/yeoman-generator-overview).

# How to run

To run it, start a lokal sever using "npm start" in cmd at the rootlocation of the project.
