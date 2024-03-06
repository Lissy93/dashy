import os
import re

# A script to update each markdown file in the docs directory
# Used to process the docs from the GitHub repo to be used for dashy.to website
# Because GH and Docusourus dashy.to expect slightly different markdown features
# Written by @CrazyWolf13

def process_file(file_path):
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remove <!-- --> Comments
    content = re.sub(r'<!--(.*?)-->', '', content, flags=re.DOTALL)

    # Replace <br> with <br />
    content = content.replace('<br>', '<br />')

    # Make each link relative, so replace ./docs with /docs
    content = content.replace('./docs', '/docs')

    # Remove .md extension from every relative link (ignoring http/https links) 
    content = re.sub(r'(\[[^\]]+\]\((?!https?://)[^)#]+?)\.md(/?#?[^)]*?)(\))', r'\1\2\3', content)

    # Replace back to top buttons
    content = re.sub(r'\[\s*⬆️\s*Back to Top\s*\]\(#.*?\)', '[⬆️ Back to Top](#top)', content, flags=re.IGNORECASE)

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
    docs_folder_path = "./docs/"
    process_docs_folder(docs_folder_path)
