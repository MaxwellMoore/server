import sys
import json
import spacy
nlp = spacy.load("en_core_web_sm")

def your_python_function(data):
    # Process the data
    return {"processed": data}

if __name__ == '__main__':
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    result = your_python_function(data)
    print(json.dumps(result))