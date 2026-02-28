import sys
import subprocess
import importlib

def install_and_import(package):
    try:
        importlib.import_module(package)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

install_and_import('PyPDF2')
import PyPDF2  # type: ignore

def read_pdf_to_file(pdf_path, txt_path):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = []
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text.append(extracted)
        with open(txt_path, 'w', encoding='utf-8') as out:
            out.write('\n'.join(text))
    except Exception as e:
        with open(txt_path, 'w', encoding='utf-8') as out:
            out.write(str(e))

read_pdf_to_file(r"c:\Users\RDP\Downloads\Zertainity-all-phases-combined\Zertainity-all-phases-combined\implementation_plan.pdf", r"c:\Users\RDP\Downloads\Zertainity-all-phases-combined\Zertainity-all-phases-combined\impl_plan.txt")
read_pdf_to_file(r"c:\Users\RDP\Downloads\Zertainity-all-phases-combined\Zertainity-all-phases-combined\Notes_260228_135052_91f.pdf", r"c:\Users\RDP\Downloads\Zertainity-all-phases-combined\Zertainity-all-phases-combined\notes.txt")
