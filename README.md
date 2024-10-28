# Word Add-in

Welcome to our Word Add-in, designed for creating standardised documents at UiB. It replaces the old VBA macros with a more efficient and user-friendly solution. The Add-in features two main functions: work agreements and standardised texts.

The work agreement function automates filling in necessary details, saving time and reducing errors, and allows easy generation of work agreements directly in Word.

For standardised text, HTML files are organised into folders and one-level subfolders on a website. The add-in will automatically add new standardised texts as they are added to the website. These texts can be inserted into Word at the "START" bookmark or at the document's end if "START" is missing. 


# How to Run

Before running the Word Add-in, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

Follow the steps below to run the Add-in:

1. Open your command prompt or terminal.
2. Navigate to the root directory of the project using the `cd` command. For example, if your project is in a folder named `word-add-in` on your desktop, you would type `cd Desktop/word-add-in`.
3. Once you're in the project's root directory, install the project's dependencies by running `npm install`.
4. After the dependencies have been installed, you can start the local server by running `npm start`.


# CI

Whenever something is commited to a protected branch, the application is built and uploaded to `https://ds.app.uib.no/add-in/$CI_COMMIT_BRANCH`:

* `dev` branch: https://ds.app.uib.no/add-in/dev/
* `prod` branch: https://ds.app.uib.no/add-in/prod/

Only maintainers can modify the protected branches.
