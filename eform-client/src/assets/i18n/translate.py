import re
import os
import argparse
import time
from googletrans import Translator

def translate_with_retry(translator, text, src, dest, max_retries=5, delay=1.0):
    retries = 0
    while retries < max_retries:
        try:
            translation = translator.translate(text, src=src, dest=dest).text
            return translation
        except Exception as e:
            print(f"Error occurred during translation. Retrying... ({retries}/{max_retries})")
            retries += 1
            time.sleep(delay)
    return None

def translate_ts_file(filename, source_language):
    with open(filename, 'r', encoding='utf-8') as file:
        ts_data = file.read()

    entries = re.findall(r'("[^"]*"): (\'.*\'|".*")\s*,', ts_data)
    translator = Translator()

    for i, (source_text, target_text) in enumerate(entries):
        source_text = source_text.strip('"')
        target_text = target_text.strip('"\'')

        print(f"Translating sentence {i + 1}/{len(entries)}:")
        print(f"Source Text ({source_language}): {source_text}")

        if target_text:
            print(f"Skipping already translated sentence {i + 1}/{len(entries)}:")
            print(f"Source Text ({source_language}): {source_text}")
            print(f"Target Text ({target_language}): {target_text}")
            continue

        translation = translate_with_retry(translator, source_text, src=source_language, dest=target_language)

        if translation is not None:
            print(f"Translated Text ({target_language}): {translation}")
            ts_data = ts_data.replace(f'"{source_text}": {target_text}', f'"{source_text}": "{translation}"')
        else:
            print("Translation failed. Skipping this entry.")

    with open(filename, 'w', encoding='utf-8') as file:
        file.write(ts_data)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Translate ts file.')
    parser.add_argument('ts_file', help='Path to the ts file to translate')
    parser.add_argument('source_language', help='Source language code, e.g., "en" for English')

    args = parser.parse_args()

    ts_file_path = args.ts_file
    source_language = args.source_language

    # Extract the target language code from the filename
    target_language = os.path.splitext(os.path.basename(ts_file_path))[0]
    print(f"Translating {ts_file_path} from {source_language} to {target_language}...")
    target_language = target_language.split('-')[0]
    print(f"Translating {ts_file_path} from {source_language} to {target_language}...")

    translate_ts_file(ts_file_path, source_language)
