# About easy-alt

Easy-alt is a VS Code extension that enables inline AI-generated alt text suggestions for your img tags. This extension is a submission for Hashnode's AI-for-Tomorrow hackathon.

Submission article:

## Features

- Automatically generates alt text for images in HTML, JSX, and TSX files.
- Uses the HuggingFace API to generate accurate and descriptive alt text.
- Works with both local and remote images.
- Provides real-time feedback through the VS Code status bar.

![Easy Alt in Action](https://github.com/FatumaA/easy-alt/blob/main/easy-alt-g.mp4)

## Requirements

- VS Code version 1.60.0 or higher
- A HuggingFace account and API token

## Extension Settings

This extension contributes the following settings:

- `easyAlt.hfToken`: Your HuggingFace API token for generating alt text.

## Known Issues

- The extension may process the document multiple times if rapid changes are made.
- Large images or slow internet connections may cause delays in alt text generation.

## Release Notes

### 1.0.0

Initial release of easy-alt:

- Automatic alt text generation for img tags
- Support for HTML, JSX, and TSX files
- Integration with HuggingFace API

## How to Use

1. Install the extension from the VS Code Marketplace.
2. Set your HuggingFace API token:
   - Option 1: In VS Code settings, search for "Easy Alt" and enter your token in the "Hf Token" field.
   - Option 2: Set an environment variable named `HF_TOKEN` with your API token.
3. Open an HTML, JSX, or TSX file containing img tags.
4. The extension will automatically process the document and generate alt text for images without existing alt attributes.
5. A status bar item will show when the extension is processing images.

## Privacy and Security

This extension sends image data to the HuggingFace API for processing. Please ensure you have the rights to use and process any images in your project.

## Feedback and Contributions

We welcome feedback and contributions! Please file issues and pull requests on our GitHub repository.

---

## Following extension guidelines

This extension follows the VS Code extension guidelines:

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy using easy-alt!**
