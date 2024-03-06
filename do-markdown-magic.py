import os
import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remove <!-- --> Comments
    content = re.sub(r'<!--(.*?)-->', '', content, flags=re.DOTALL)

    # Replace <br> with <br />
    content = content.replace('<br>', '<br />')

    # Make each link relative, so replace ./docs with /docs
    content = content.replace('./docs', '/docs')

    # Remove .md extension from every link while ensuring idempotency
    content = re.sub(r'(\[[^\]]+\]\((?!https?://)[^)#]+?)\.md(/?#?[^)]*?)(\))', r'\1\2\3', content)

    # Replace back to top buttons
    # Assuming this pattern is correct; adjust if necessary
    content = re.sub(r'\[.*Back to top.*\]', '[⬆️ Back to Top](https://riot.im/app/#)', content)

    # Remove any <details> tags
    content = re.sub(r'<details>.*?</details>', '', content, flags=re.DOTALL)

    # Save the processed content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

def process_docs_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                process_file(file_path)

if __name__ == "__main__":
    # Update this path to the correct relative path where the script will be run in the GitHub Action
    docs_folder_path = "./docs/"
    process_docs_folder(docs_folder_path)
