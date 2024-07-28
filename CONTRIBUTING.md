# Contributing to Easy Alt

First off, thank you for considering contributing to Easy Alt! It's people like you that make Easy Alt such a great tool for improving web accessibility.

## Getting Started

- Make sure you have a [GitHub account](https://github.com/signup/free)
- Submit a GitHub issue for any bugs or feature requests
- Fork the repository on GitHub

## Setting up your development environment

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Clone your fork of the repository
3. Run `npm install` in the project directory to install dependencies
4. Open the project in VS Code

## Making Changes

1. Create a topic branch from where you want to base your work.
   - This is usually the `main` branch.
   - To quickly create a topic branch based on main, run `git checkout -b fix/my_contribution main`.
     Please avoid working directly on the `main` branch.
2. Make small commits.
3. Check for unnecessary whitespace with `git diff --check` before committing.
4. Make sure your commit messages are in the proper format:
5. Make sure you have added the necessary tests for your changes.
6. Run all the tests to assure nothing else was accidentally broken.

## Testing Your Changes

Testing is crucial to ensure that Easy Alt continues to function correctly and efficiently. Here's how you can test your changes:

1. Make sure you have the VS Code Extension Development environment set up as described in the "Setting up your development environment" section.

2. To run the extension in debug mode:

- Press F5 in VS Code. This will compile and run the extension in a new Extension Development Host window.
- In the Extension Development Host window, open an HTML, JSX, or TSX file.
- Add an image tag without an alt attribute.
- The extension should automatically generate and insert alt text for the image.

3. To run the automated tests:

- Open a terminal in the project root directory.
- Run `npm test` to execute the test suite.
- All tests should pass. If any fail, please fix the issues before submitting your pull request.

4. Manual testing:

- Test the extension with various types of images (local, remote, different formats).
- Try with different file types (HTML, JSX, TSX).
- Check edge cases like images without src attributes, or with existing alt text.

5. Performance testing:

- Test with files containing many images to ensure the extension remains responsive.
- Monitor CPU and memory usage to ensure your changes don't introduce performance regressions.

6. If you've added new features, please add appropriate test cases to cover them.

Remember, thorough testing helps maintain the quality and reliability of Easy Alt. If you're unsure about how to test a particular change, feel free to ask in your pull request or open an issue for discussion.

## Submitting Changes

1. Push your changes to a topic branch in your fork of the repository.
2. Submit a pull request to the main Easy Alt repository.
3. The core team looks at Pull Requests on a regular basis and will provide feedback.

## Additional Resources

- [General GitHub documentation](https://help.github.com/)
- [GitHub pull request documentation](https://help.github.com/articles/creating-a-pull-request/)
- [VS Code Extension API](https://code.visualstudio.com/api)

## Reporting Bugs

1. Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/yourusername/easy-alt/issues).
2. If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/yourusername/easy-alt/issues/new). Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

## Suggesting Enhancements

1. Open a new issue with a clear title and description.
2. Provide a step-by-step description of the suggested enhancement.
3. Provide specific examples to demonstrate the steps.
4. Describe the current behavior and explain which behavior you expected to see instead and why.

Thank you for your contributions to making the web more accessible with Easy Alt!
