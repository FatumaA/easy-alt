![A screenshot of showing alt attribute of an image tag with a dropdown saying "An arafed cat wearing sunglasses and a pink jacket sits on a bed" with an image of the cat to the left](https://github.com/user-attachments/assets/ec5ac877-0317-495c-92d5-e17e0794e3f6)

# About easy-alt

Easy-alt is a VS Code extension that enables inline AI-generated alt text suggestions for your img tags. This extension was originally a submission for Hashnode's AI-for-Tomorrow hackathon.

[This is the submission article](https://blog.hijabicoder.dev/auto-add-alt-text-to-img-tags-with-easy-alt-an-ai-powered-vscode-extension)

## Features

- Generates alt text for images in HTML, JSX, and TSX files.
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

### How to Configure

To set your HuggingFace API token:

1. **Open the Settings JSON**:

   - Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (macOS) to open the Command Palette.
   - Type `Preferences: User Settings` and select it.

2. **Edit the `settings.json` File**:

   - Add the following line to the JSON object:
     ```json
     "easyAlt.hfToken": "your_huggingface_token"
     ```
   - Replace `"your_huggingface_token"` with your actual HuggingFace API token.

3. **Save the File and Restart VSCode**.
4. **When in an Image alt tag, press `Ctrl + E` (Windows/Linux) or `Cmd + E` (macOS) to generate alt text**

## Known Issues

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
3. Open an HTML, JSX, or TSX file containing Image tags.
4. When in an Image alt tag, press `Ctrl + E` (Windows/Linux) or `Cmd + E` (macOS) to generate alt text.
5. The generated alt text will show up in a dropdown along with a preview of the image.
6. Press enter to accept the generated alt text or press escape to cancel.
7. A status bar item will show when the extension is processing images.

## Privacy and Security

This extension sends image data to the HuggingFace API for processing. Please ensure you have the rights to use and process any images in your project.

## Feedback and Contributions

We welcome feedback and contributions! Please file issues and pull requests on our GitHub repository.

---

## Following extension guidelines

This extension follows the VS Code extension guidelines:

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy using easy-alt!**
