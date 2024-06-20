# Word Add-in

Welcome to our Word Add-in, a tool designed to streamline the process of creating work agreements at UiB. This Add-in replaces our legacy VBA macros, providing a more efficient and user-friendly way to generate these documents.

With this Add-in, you can automatically populate arbeidsavtaler with the necessary information, saving time and reducing the possibility of errors. It's designed with simplicity in mind, making it easy for anyone to generate arbeidsavtaler directly within Microsoft Word.

# How to Run

Before running the Word Add-in, make sure you have [Node.js](https://nodejs.org/) installed on your machine.

Follow the steps below to run the Add-in:

1. Open your command prompt or terminal.
2. Navigate to the root directory of the project using the `cd` command. For example, if your project is in a folder named `word-add-in` on your desktop, you would type `cd Desktop/word-add-in`.
3. Once you're in the project's root directory, install the project's dependencies by running `npm install`.
4. After the dependencies have been installed, you can start the local server by running `npm start`.


# CI

Whenever something is commited to a protected branch, the application is built and uploaded to `https://org.uib.no/ds/add-in/$CI_COMMIT_BRANCH`:

* `dev` branch: https://org.uib.no/ds/add-in/dev/
* `prod` branch: https://org.uib.no/ds/add-in/prod/

Only maintainers can modify the protected branches.
